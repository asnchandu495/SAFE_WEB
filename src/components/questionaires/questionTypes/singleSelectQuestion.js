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

function SingleSelectQuestion(props) {
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
    positiveConformitySingleChoice: [
      {
        optionId: "",
        option: "",
      },
    ],
    redFlagForSingleChoice: [
      {
        optionId: "",
        option: "",
      },
    ],
  });
  const [oldData, setOldData] = useState();

  const PurpleSwitch = withStyles({
    switchBase: {
      color: "#be1d56",
      "&$checked": {
        color: "#26235d",
      },
      "&$checked + $track": {
        backgroundColor: "#26235d",
      },
    },
    checked: {},
    track: {},
  })(Switch);

  useEffect(() => {
    if (selectedQId != 0) {
      questionaireApiCall
        .GetSingleChoiceQuestion(selectedQId)
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

          let newSingleChoiceFlag = {
            questionId: res.id,
            isPositiveConfirmity: res.isPositiveConfirmity,
            isPositiveConfirmityRedFlag: res.isPositiveConfirmityRedFlag,
            positiveConformitySingleChoice:
              res.positiveConformitySingleChoice.length > 0
                ? res.positiveConformitySingleChoice
                : [
                    {
                      optionId: "",
                      option: "",
                    },
                  ],
            redFlagForSingleChoice:
              res.redFlagForSingleChoice.length > 0
                ? res.redFlagForSingleChoice
                : [
                    {
                      optionId: "",
                      option: "",
                    },
                  ],
          };
          setChoiceFlag(newSingleChoiceFlag);
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
        newArray = [
          ...new Set([
            ...oldData.positiveConformitySingleChoice,
            ...oldData.redFlagForSingleChoice,
          ]),
        ];
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
        .UpdateSingleChoiceQuestion(finalObject)
        .then((res) => {
          setisAlertBoxOpened(false);
          setStateSnackbar(true);
          setToasterMessage("Question details updated.");
          settoasterServerity("success");
          setTimeout(() => {
            setReloadPage(true);
            setshowLoadder(false);
            props.history.push(
              `/questionaires/add-questions/${props.surveyIdURL}/${finalObject.id}?type=SingleChoice`
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
        .AddSingleChoiceQuestion(finalObject)
        .then((res) => {
          setisAlertBoxOpened(false);
          setStateSnackbar(true);
          setToasterMessage("Added new question.");
          settoasterServerity("success");
          setTimeout(() => {
            setReloadPage(true);
            setshowLoadder(false);
            props.history.push(
              `/questionaires/add-questions/${props.surveyIdURL}/${res.id}?type=SingleChoice`
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
      redFlagForSingleChoice: [
        ...choiceFlag.redFlagForSingleChoice.map((con, conIndex) =>
          conIndex == index
            ? {
                ...con,
                ["option"]: getSelectedVal.option,
                ["optionId"]: getSelectedVal.optionId,
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
      positiveConformitySingleChoice: [
        ...choiceFlag.positiveConformitySingleChoice.map((con, conIndex) =>
          conIndex == index
            ? {
                ...con,
                ["option"]: getSelectedVal.option,
                ["optionId"]: getSelectedVal.optionId,
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
    const thisRedFlagSingleChoice = list.redFlagForSingleChoice;
    list.redFlagForSingleChoice = [
      ...thisRedFlagSingleChoice,
      {
        optionId: "",
        option: "",
      },
    ];
    setChoiceFlag(list);
  };

  const handleRemoveClickRedFlag = (j) => {
    const list = { ...choiceFlag };
    list.redFlagForSingleChoice.splice(j, 1);
    setChoiceFlag(list);
  };

  const handleAddClickPositiveFlag = (index, j) => {
    const list = { ...choiceFlag };
    const thisPositiveFlagSingleChoice = list.positiveConformitySingleChoice;
    list.positiveConformitySingleChoice = [
      ...thisPositiveFlagSingleChoice,
      {
        optionId: "",
        option: "",
      },
    ];
    setChoiceFlag(list);
  };

  const handleRemoveClickPositiveFlag = (j) => {
    const list = { ...choiceFlag };
    list.positiveConformitySingleChoice.splice(j, 1);
    setChoiceFlag(list);
  };

  function submitQuestionFormFlags(e) {
    setshowLoadderFlag(true);
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    if (!choiceFlag.isPositiveConfirmityRedFlag) {
      choiceFlag.redFlagForSingleChoice = [];
    }
    questionaireApiCall
      .UpdateSingleChoiceFlags(choiceFlag)
      .then((res) => {
        setshowLoadderFlag(false);
        setStateSnackbar(true);
        setToasterMessage("Added new question.");
        settoasterServerity("success");
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
      <Tooltip title="Add">
        <AddCircleIcon
          className={`add-row-icon`}
          onClick={handleAddClickChoices}
        ></AddCircleIcon>
      </Tooltip>
    );
  }

  return (
    <>
      <ValidatorForm onSubmit={submitQuestionForm}>
        <Card className="question-card">
          <CardContent>
            <Typography gutterBottom variant="h6" component="h6">
              Question details
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
                    <label>Is mandatory?</label>
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
                                        handleRemoveClickChoices(i, x)
                                      }
                                    ></CancelIcon>
                                  </Tooltip>
                                )} */}
                                {/* {addQuestionData.surveyResponseChoices.length -
                                  1 ===
                                  i && (
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
                            {choiceFlag.redFlagForSingleChoice &&
                            choiceFlag.redFlagForSingleChoice.length > 0
                              ? choiceFlag.redFlagForSingleChoice.map(
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
                                              defaultValue={x}
                                              onChange={(e, v) =>
                                                handleChangeFlagR(v, i)
                                              }
                                              filterSelectedOptions
                                              className="global-input autocomplete-select"
                                              renderInput={(params) => (
                                                <TextField
                                                  required={
                                                    choiceFlag.isPositiveConfirmityRedFlag
                                                  }
                                                  {...params}
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
                                          {choiceFlag.redFlagForSingleChoice
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
                                          {choiceFlag.redFlagForSingleChoice
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
                          {choiceFlag.positiveConformitySingleChoice &&
                          choiceFlag.positiveConformitySingleChoice.length > 0
                            ? choiceFlag.positiveConformitySingleChoice.map(
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
                                            defaultValue={x}
                                            onChange={(e, v) =>
                                              handleChangeFlagP(v, i)
                                            }
                                            filterSelectedOptions
                                            className="global-input autocomplete-select"
                                            renderInput={(params) => (
                                              <TextField
                                                required
                                                {...params}
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
                                          .positiveConformitySingleChoice
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
                                          .positiveConformitySingleChoice
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

export default withRouter(SingleSelectQuestion);
