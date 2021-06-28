import React, { useState, useEffect } from "react";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import PropTypes from "prop-types";
import { Link as LinkTo, withRouter } from "react-router-dom";
import ToasterMessageComponent from "../../common/toaster";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ComponentLoadderComponent from "../../common/loadder/componentloadder";
import questionaireService from "../../../services/questionaireService";
import TooltipComponent from "../../common/tooltip";

function MultiSelectQuestion(props) {
  const questionaireApiCall = new questionaireService();

  const surveyIdURL = props.match.params.id;
  const questionIdURL = props.match.params.qid;

  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [showLoadderFlag, setshowLoadderFlag] = useState(false);
  const [addQuestionData, setAddQuestionData] = useState({
    id: "",
    surveyId: surveyIdURL,
    description: "",
    questionType: "",
    question: "",
    isMandatory: false,
    surveyResponseChoices: [
      {
        optionId: "",
        option: "",
        isDelete: false,
      },
    ],
  });
  const [showFlags, setShowFlags] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);
  const [selectedQId, setSelectedQId] = useState(props.match.params.qid);
  const [choiceFlag, setChoiceFlag] = useState({
    questionId: props.match.params.qid,
    isPositiveConfirmity: true,
    isPositiveConfirmityRedFlag: false,
    positiveConformityMultiChoice: [
      {
        options: [
          {
            optionId: "",
            option: "",
          },
        ],
      },
    ],
    redFlagForMultipleChoice: [
      {
        options: [
          {
            optionId: "",
            option: "",
          },
        ],
      },
    ],
  });
  const [oldData, setOldData] = useState();

  const PurpleSwitch = withStyles({
    switchBase: {
      color: "red",
      "&$checked": {
        color: "green",
      },
      "&$checked + $track": {
        backgroundColor: "green",
      },
    },
    checked: {},
    track: {},
  })(Switch);

  useEffect(() => {
    if (selectedQId != 0) {
      questionaireApiCall
        .GetMultipleChoicQuestionById(selectedQId)
        .then((res) => {
          setOldData(res);
          let getData = res;
          if (getData.surveyResponseChoices.length == 0) {
            getData.surveyResponseChoices = [
              {
                optionId: "",
                option: "",
                isDelete: false,
              },
            ];
          }
          setAddQuestionData(getData);

          let newMultiChoiceFlag = {
            questionId: res.id,
            isPositiveConfirmity: res.isPositiveConfirmity,
            isPositiveConfirmityRedFlag: res.isPositiveConfirmityRedFlag,
            positiveConformityMultiChoice:
              res.positiveConformityMultiChoice.length > 0
                ? res.positiveConformityMultiChoice
                : [
                  {
                    options: [],
                  },
                ],
            redFlagForMultipleChoice:
              res.redFlagForMultipleChoice.length > 0
                ? res.redFlagForMultipleChoice
                : [
                  {
                    options: [],
                  },
                ],
          };
          setChoiceFlag(newMultiChoiceFlag);
          setshowLoadder(false);
          setShowFlags(true);
          setReloadPage(false);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    }
  }, [reloadPage]);

  const handleChange = (e) => {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    setAddQuestionData((addQuestionData) => ({
      ...addQuestionData,
      [name]: value,
    }));
  };

  const handleChangeSwitch = (e) => {
    const { name, value } = e.target;
    setAddQuestionData((addQuestionData) => ({
      ...addQuestionData,
      [name]: e.target.checked,
    }));
  };

  const handleInputChangeChoices = (e, index) => {
    const { name, value } = e.target;
    const list = {
      ...addQuestionData,
      surveyResponseChoices: [
        ...addQuestionData.surveyResponseChoices.map((con, conIndex) =>
          conIndex == index ? { ...con, [name]: value } : con
        ),
      ],
    };
    setAddQuestionData(list);
  };

  const handleRemoveClickChoices = (index, getCurrentOption) => {
    if (getCurrentOption.optionId == "") {
      const list = { ...addQuestionData };
      list.surveyResponseChoices.splice(index, 1);
      setAddQuestionData(list);
    } else {
      var newArray;
      if (oldData) {
        const allPositiveOptions = [
          ...new Set(
            [].concat(
              ...oldData.positiveConformityMultiChoice.map((o) => o.options)
            )
          ),
        ];
        const allRedflagOptions = [
          ...new Set(
            [].concat(...oldData.redFlagForMultipleChoice.map((o) => o.options))
          ),
        ];
        newArray = [...new Set([...allPositiveOptions, ...allRedflagOptions])];
        newArray = newArray.filter(
          (v, i, a) => a.findIndex((t) => t.optionId === v.optionId) === i
        );
      } else {
        newArray = [];
      }

      var checkIfExists = newArray.find(
        (op) => op.optionId == getCurrentOption.optionId
      );

      if (!checkIfExists) {
        const list = {
          ...addQuestionData,
          surveyResponseChoices: [
            ...addQuestionData.surveyResponseChoices.map((con, conIndex) =>
              conIndex == index ? { ...con, ["isDelete"]: true } : con
            ),
          ],
        };
        setAddQuestionData(list);
      } else {
        settoasterErrorMessageType("object");
        setStateSnackbar(true);
        setToasterMessage("This option can't be removed.");
        settoasterServerity("error");
      }
    }
  };

  const handleAddClickChoices = (index, j) => {
    const list = { ...addQuestionData };
    const thisChoices = list.surveyResponseChoices;
    list.surveyResponseChoices = [
      ...thisChoices,
      {
        optionId: "",
        option: "",
        isDelete: false,
      },
    ];
    setAddQuestionData(list);
  };

  const navigateToQuestionType = () => {
    setTimeout(() => {
      // props.setGotoAddQuestion(false);
      props.history.push(`/questionaires/view-questions/${props.surveyIdURL}`);
    }, 1000);
  };

  function submitQuestionForm(e) {
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    setshowLoadder(true);
    const finalObject = {
      ...props.questionTypeForm,
      ...addQuestionData,
    };
    if (finalObject.id != 0) {
      questionaireApiCall
        .UpdateMultiChoiceQuestion(finalObject)
        .then((res) => {
          setisAlertBoxOpened(false);
          setStateSnackbar(true);
          setToasterMessage("Question details updated.");
          settoasterServerity("success");
          setTimeout(() => {
            setReloadPage(true);
            setshowLoadder(false);
            props.history.push(
              `/questionaires/add-questions/${props.surveyIdURL}/${finalObject.id}?type=MultiChoice`
            );
          }, 10000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      questionaireApiCall
        .AddMultiChoiceQuestion(finalObject)
        .then((res) => {
          setisAlertBoxOpened(false);
          setStateSnackbar(true);
          setToasterMessage("Added new question.");
          settoasterServerity("success");
          setTimeout(() => {
            setReloadPage(true);
            setshowLoadder(false);
            props.history.push(
              `/questionaires/add-questions/${props.surveyIdURL}/${res.id}?type=MultiChoice`
            );
          }, 10000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    }
  }

  const handleChangeFlagR = (getSelectedVal, index) => {
    const list = {
      ...choiceFlag,
      redFlagForMultipleChoice: [
        ...choiceFlag.redFlagForMultipleChoice.map((con, conIndex) =>
          conIndex == index
            ? {
              options: getSelectedVal,
            }
            : con
        ),
      ],
    };
    setChoiceFlag(list);
  };

  const handleChangeFlagP = (getSelectedVal, index) => {
    const list = {
      ...choiceFlag,
      positiveConformityMultiChoice: [
        ...choiceFlag.positiveConformityMultiChoice.map((con, conIndex) =>
          conIndex == index
            ? {
              options: getSelectedVal,
            }
            : con
        ),
      ],
    };
    setChoiceFlag(list);
  };

  const handleChangeRedFlagSwitch = (e) => {
    const { name, value } = e.target;
    setChoiceFlag((choiceFlag) => ({
      ...choiceFlag,
      [name]: e.target.checked,
    }));
  };

  const handleAddClickRedFlag = (index, j) => {
    const list = { ...choiceFlag };
    const thisRedFlagSingleChoice = list.redFlagForMultipleChoice;
    list.redFlagForMultipleChoice = [
      ...thisRedFlagSingleChoice,
      {
        options: [],
      },
    ];
    setChoiceFlag(list);
  };

  const handleRemoveClickRedFlag = (j) => {
    const list = { ...choiceFlag };
    list.redFlagForMultipleChoice.splice(j, 1);
    setChoiceFlag(list);
  };

  const handleAddClickPositiveFlag = (index, j) => {
    const list = { ...choiceFlag };
    const thisPositiveFlagSingleChoice = list.positiveConformityMultiChoice;
    list.positiveConformityMultiChoice = [
      ...thisPositiveFlagSingleChoice,
      {
        options: [],
      },
    ];
    setChoiceFlag(list);
  };

  const handleRemoveClickPositiveFlag = (j) => {
    const list = { ...choiceFlag };
    list.positiveConformityMultiChoice.splice(j, 1);
    setChoiceFlag(list);
  };

  function submitQuestionFormFlags(e) {
    setshowLoadderFlag(true);
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    if (!choiceFlag.isPositiveConfirmityRedFlag) {
      choiceFlag.redFlagForMultipleChoice = [];
    }
    questionaireApiCall
      .UpdateMultiChoiceFlags(choiceFlag)
      .then((res) => {
        setStateSnackbar(true);
        setToasterMessage("Added new question.");
        settoasterServerity("success");
        setTimeout(() => {
          props.history.push(
            `/questionaires/view-questions/${props.surveyIdURL}`
          );
          setshowLoadderFlag(false);
        }, 10000);
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
        setshowLoadderFlag(false);
      });
  }

  function DisplayRemove(props) {
    var surveyResponseChoices = props.allChoices;
    var index = props.index;
    var choice = props.choice;

    var filteredChoices = surveyResponseChoices.filter((c) => {
      return !c.isDelete;
    });

    return (
      filteredChoices.length !== 1 && (
        <Tooltip title="Remove">
          <CancelIcon
            className={`delete-row-icon`}
            onClick={() => handleRemoveClickChoices(index, choice)}
          ></CancelIcon>
        </Tooltip>
      )
    );
  }

  function DisplayAdd(props) {
    var surveyResponseChoices = props.allChoices;
    var index = props.index;
    var filteredChoices = surveyResponseChoices.filter((c) => {
      return !c.isDelete;
    });
    var lastItem = filteredChoices[filteredChoices.length - 1];
    var a = filteredChoices.indexOf(lastItem);

    return (
      filteredChoices.length && (
        <Tooltip title="Add">
          <AddCircleIcon
            className={`add-row-icon`}
            onClick={handleAddClickChoices}
          ></AddCircleIcon>
        </Tooltip>
      )
    );
  }

  return (
    <>
      <ValidatorForm onSubmit={submitQuestionForm}>
        <Card className="question-card">
          <CardContent>
            <Typography gutterBottom variant="h6" component="h6">
              Question Details
            </Typography>
            <Grid item xs={12} sm={12}>
              <Grid spacing={3} container className="question-details">
                <Grid item container sm={12}>
                  <Grid item sm={2}>
                    <label className="required">Question</label>
                  </Grid>
                  <Grid item sm={6}>
                    <TextValidator
                      variant="outlined"
                      validators={["required", "matchRegexp:^.{0,200}$"]}
                      errorMessages={[
                        "Please enter question",
                        "Maximum 200 characters",
                      ]}
                      fullWidth
                      id="question"
                      placeholder="Enter Question"
                      name="question"
                      value={addQuestionData.question}
                      onChange={handleChange}
                      autoFocus
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                </Grid>
                <Grid item sm={12} container>
                  <Grid item sm={2}>
                    <label>Description</label>
                  </Grid>
                  <Grid item sm={6}>
                    <TextValidator
                      variant="outlined"
                      fullWidth
                      id="description"
                      placeholder="Enter Description"
                      validators={["matchRegexp:^.{0,200}$"]}
                      errorMessages={["Maximum 200 characters"]}
                      name="description"
                      multiline
                      rows={2}
                      value={addQuestionData.description}
                      onChange={handleChange}
                      className="global-input global-input-multiline"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                </Grid>
                <Grid item container xs={12}>
                  <Grid item xs={2}>
                    <label>Mandatory?</label>
                    <TooltipComponent
                      isMarginBottom={false}
                      tooltipMessage={`Questions for which "Is Mandatory" is ON is mandatory to be answered. Questions for which "Is Mandatory" is OFF can be skipped.`}
                    ></TooltipComponent>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <PurpleSwitch
                          checked={addQuestionData.isMandatory}
                          name="isMandatory"
                          onChange={handleChangeSwitch}
                        />
                      }
                      label={addQuestionData.isMandatory ? "Yes" : "No"}
                    />
                  </Grid>
                </Grid>
                <Grid item container sm={12} className="flag-card-dynamic">
                  <Grid item sm={2}>
                    <label className="required">Answers</label>
                  </Grid>
                  <Grid item sm={10}>
                    {addQuestionData.surveyResponseChoices &&
                      addQuestionData.surveyResponseChoices.length > 0
                      ? addQuestionData.surveyResponseChoices.map((x, i) => {
                        return !x.isDelete ? (
                          <Grid
                            container
                            spacing={1}
                            item
                            xs={12}
                            className="dynamic-rows-bottom dynamic-rows-bottom-choice"
                            key={`choice-container${i}`}
                          >
                            <Grid item xs={6}>
                              <TextValidator
                                variant="outlined"
                                validators={["required"]}
                                errorMessages={["Please enter answer"]}
                                fullWidth
                                id={`option${i}`}
                                placeholder="Enter answer"
                                name="option"
                                value={x.option}
                                onChange={(e) =>
                                  handleInputChangeChoices(e, i)
                                }
                                className="global-input"
                                InputLabelProps={{ shrink: false }}
                              />
                            </Grid>
                            <Grid item xs={2} className="row-icons-container">
                              <DisplayRemove
                                allChoices={
                                  addQuestionData.surveyResponseChoices
                                }
                                index={i}
                                choice={x}
                              ></DisplayRemove>
                              <DisplayAdd
                                allChoices={
                                  addQuestionData.surveyResponseChoices
                                }
                                index={i}
                                choice={x}
                              ></DisplayAdd>
                              {/* {addQuestionData.surveyResponseChoices
                                  .length !== 1 && (
                                  <Tooltip title="Remove">
                                    <CancelIcon
                                      className={`delete-row-icon`}
                                      onClick={() =>
                                        handleRemoveClickChoices(i)
                                      }
                                    ></CancelIcon>
                                  </Tooltip>
                                )}
                                {addQuestionData.surveyResponseChoices.length -
                                  1 ===
                                  i &&
                                  addQuestionData.surveyResponseChoices.length <
                                    10 && (
                                    <Tooltip title="Add">
                                      <AddCircleIcon
                                        className={`add-row-icon`}
                                        onClick={handleAddClickChoices}
                                      ></AddCircleIcon>
                                    </Tooltip>
                                  )} */}
                            </Grid>
                          </Grid>
                        ) : (
                          ""
                        );
                      })
                      : ""}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions className="action-container">
            <Button
              size="small"
              type="button"
              onClick={navigateToQuestionType}
              className="global-cancel-btn"
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              className="global-submit-btn"
              disabled={showLoadder}
            >
              {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
            </Button>
          </CardActions>
        </Card>
      </ValidatorForm>
      {showFlags ? (
        <ValidatorForm
          onSubmit={submitQuestionFormFlags}
          className="flag-container"
        >
          <Card className="question-card question-card-choice-flag flag-card">
            <CardContent className="scrollable-card scrollable-card-choices">
              <Grid
                item
                container
                xs={12}
                spacing={1}
                className="flag-container"
              >
                <Grid item xs={12} sm={12}>
                  <Card className="flag-card flag-card-dynamic flag-card-dynamic-choices">
                    <CardContent>
                      <Grid item container xs={12}>
                        <Grid item xs={2}>
                          <label className="required">Red Flag</label>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <PurpleSwitch
                                checked={choiceFlag.isPositiveConfirmityRedFlag}
                                name="isPositiveConfirmityRedFlag"
                                onChange={handleChangeRedFlagSwitch}
                              />
                            }
                            label={
                              choiceFlag.isPositiveConfirmityRedFlag
                                ? "Yes"
                                : "No"
                            }
                          />
                        </Grid>
                      </Grid>
                      {choiceFlag.isPositiveConfirmityRedFlag ? (
                        <Grid
                          item
                          container
                          xs={12}
                          className="red-flag-question"
                        >
                          <Grid item xs={2}>
                            <label
                              className={
                                choiceFlag.isPositiveConfirmityRedFlag
                                  ? "required"
                                  : ""
                              }
                            >
                              Red Flag Answer
                            </label>
                          </Grid>
                          <Grid item xs={10}>
                            {choiceFlag.redFlagForMultipleChoice &&
                              choiceFlag.redFlagForMultipleChoice.length > 0
                              ? choiceFlag.redFlagForMultipleChoice.map(
                                (x, i) => {
                                  return (
                                    <Grid
                                      item
                                      container
                                      xs={12}
                                      spacing={1}
                                      key={`redflag-container${i}`}
                                      className="dynamic-flag-container"
                                    >
                                      <Grid item xs={5}>
                                        <FormControl
                                          variant="outlined"
                                          fullWidth
                                        >
                                          <Autocomplete
                                            id="tags-outlined"
                                            multiple
                                            options={
                                              addQuestionData.surveyResponseChoices &&
                                                addQuestionData
                                                  .surveyResponseChoices
                                                  .length > 0
                                                ? addQuestionData.surveyResponseChoices.filter(
                                                  (opt) => {
                                                    return (
                                                      opt.optionId != ""
                                                    );
                                                  }
                                                )
                                                : []
                                            }
                                            getOptionLabel={(opt) =>
                                              opt.option
                                            }
                                            defaultValue={x.options}
                                            value={x.options}
                                            onChange={(e, v) =>
                                              handleChangeFlagR(v, i)
                                            }
                                            filterSelectedOptions
                                            className="global-input autocomplete-select"
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                inputProps={{
                                                  ...params.inputProps,
                                                  required:
                                                    x.options.length === 0 &&
                                                    choiceFlag.isPositiveConfirmityRedFlag,
                                                }}
                                                variant="outlined"
                                                placeholder="Select answer"
                                              />
                                            )}
                                          />
                                        </FormControl>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={2}
                                        className="row-icons-container"
                                      >
                                        {choiceFlag.redFlagForMultipleChoice
                                          .length !== 1 && (
                                            <Tooltip title="Remove">
                                              <CancelIcon
                                                className={`delete-row-icon`}
                                                onClick={() =>
                                                  handleRemoveClickRedFlag(i)
                                                }
                                              ></CancelIcon>
                                            </Tooltip>
                                          )}
                                        {choiceFlag.redFlagForMultipleChoice
                                          .length -
                                          1 ===
                                          i && (
                                            <Tooltip title="Add">
                                              <AddCircleIcon
                                                className={`add-row-icon`}
                                                onClick={handleAddClickRedFlag}
                                              ></AddCircleIcon>
                                            </Tooltip>
                                          )}
                                      </Grid>
                                    </Grid>
                                  );
                                }
                              )
                              : ""}
                          </Grid>
                        </Grid>
                      ) : (
                        ""
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Card className="flag-card flag-card-dynamic flag-card-dynamic-choices">
                    <CardContent>
                      <Grid item container xs={12}>
                        <Grid item xs={2}>
                          <label className="required">
                            Positive Conformity
                          </label>
                        </Grid>
                        <Grid item xs={10}>
                          {choiceFlag.positiveConformityMultiChoice &&
                            choiceFlag.positiveConformityMultiChoice.length > 0
                            ? choiceFlag.positiveConformityMultiChoice.map(
                              (x, i) => {
                                return (
                                  <Grid
                                    item
                                    container
                                    xs={12}
                                    spacing={1}
                                    key={`redflag-container${i}`}
                                    className="dynamic-flag-container"
                                  >
                                    <Grid item xs={5}>
                                      <FormControl
                                        variant="outlined"
                                        fullWidth
                                      >
                                        <Autocomplete
                                          id="tags-outlined"
                                          multiple
                                          options={
                                            addQuestionData.surveyResponseChoices &&
                                              addQuestionData
                                                .surveyResponseChoices.length >
                                              0
                                              ? addQuestionData.surveyResponseChoices.filter(
                                                (opt) => {
                                                  return opt.optionId != "";
                                                }
                                              )
                                              : []
                                          }
                                          getOptionLabel={(opt) => opt.option}
                                          defaultValue={x.options}
                                          value={x.options}
                                          onChange={(e, v) =>
                                            handleChangeFlagP(v, i)
                                          }
                                          filterSelectedOptions
                                          className="global-input autocomplete-select"
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              inputProps={{
                                                ...params.inputProps,
                                                required:
                                                  x.options.length === 0,
                                              }}
                                              variant="outlined"
                                              placeholder="Select answer"
                                            />
                                          )}
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={2}
                                      className="row-icons-container"
                                    >
                                      {choiceFlag
                                        .positiveConformityMultiChoice
                                        .length !== 1 && (
                                          <Tooltip title="Remove">
                                            <CancelIcon
                                              className={`delete-row-icon`}
                                              onClick={() =>
                                                handleRemoveClickPositiveFlag(i)
                                              }
                                            ></CancelIcon>
                                          </Tooltip>
                                        )}
                                      {choiceFlag
                                        .positiveConformityMultiChoice
                                        .length -
                                        1 ===
                                        i && (
                                          <Tooltip title="Add">
                                            <AddCircleIcon
                                              className={`add-row-icon`}
                                              onClick={
                                                handleAddClickPositiveFlag
                                              }
                                            ></AddCircleIcon>
                                          </Tooltip>
                                        )}
                                    </Grid>
                                  </Grid>
                                );
                              }
                            )
                            : ""}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions className="action-container">
              <Button
                variant="contained"
                type="submit"
                className="global-submit-btn"
                disabled={showLoadderFlag}
              >
                {showLoadderFlag ? <ButtonLoadderComponent /> : "Submit"}
              </Button>
            </CardActions>
          </Card>
        </ValidatorForm>
      ) : (
        ""
      )}

      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
    </>
  );
}

export default withRouter(MultiSelectQuestion);
