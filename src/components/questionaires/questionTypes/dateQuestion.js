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
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import ComponentLoadderComponent from "../../common/loadder/componentloadder";
import questionaireService from "../../../services/questionaireService";

function DateQuestion(props) {
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
  const [addQuestionData, setAddQuestionData] = useState({
    id: "",
    surveyId: surveyIdURL,
    description: "",
    questionType: "",
    question: "",
    positiveConformityForDate: [
      {
        id: "",
        expressionType: "",
        forAnswer: moment().toISOString(),
        forRangeEnd: moment().toISOString(),
      },
    ],
    redFlagForDate: [
      {
        id: "",
        expressionType: "",
        forAnswer: moment().toISOString(),
        forRangeEnd: moment().toISOString(),
      },
    ],
    isPositiveConfirmity: true,
    isPositiveConfirmityRedFlag: false,
    isMandatory: false,
  });

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
    if (questionIdURL != 0) {
      let getData = props.selectedQuestionDetails;
      if (getData.redFlagForDate.length == 0) {
        getData.redFlagForDate = [
          {
            id: "",
            expressionType: "",
            forAnswer: moment().toISOString(),
            forRangeEnd: moment().toISOString(),
          },
        ];
      }
      if (getData.positiveConformityForDate.length == 0) {
        getData.positiveConformityForDate = [
          {
            id: "",
            expressionType: "",
            forAnswer: moment().toISOString(),
            forRangeEnd: moment().toISOString(),
          },
        ];
      }
      setAddQuestionData(getData);
    }
  }, []);

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

  const navigateToQuestionType = () => {
    setTimeout(() => {
      // props.setGotoAddQuestion(false);
      props.history.push(`/questionaires/view-questions/${props.surveyIdURL}`);
    }, 1000);
  };

  const handleChangeFlagR = (date, key, e, index) => {
    if (key != null) {
      const list = {
        ...addQuestionData,
        redFlagForDate: [
          ...addQuestionData.redFlagForDate.map((con, conIndex) =>
            conIndex == index ? { ...con, [key]: date } : con
          ),
        ],
      };
      setAddQuestionData(list);
    } else {
      const { name, value } = e.target;
      const list = {
        ...addQuestionData,
        redFlagForDate: [
          ...addQuestionData.redFlagForDate.map((con, conIndex) =>
            conIndex == index ? { ...con, [name]: value } : con
          ),
        ],
      };
      setAddQuestionData(list);
    }
  };

  const handleChangeFlagP = (date, key, e, index) => {
    if (key != null) {
      const list = {
        ...addQuestionData,
        positiveConformityForDate: [
          ...addQuestionData.positiveConformityForDate.map((con, conIndex) =>
            conIndex == index ? { ...con, [key]: date } : con
          ),
        ],
      };
      setAddQuestionData(list);
    } else {
      const { name, value } = e.target;
      const list = {
        ...addQuestionData,
        positiveConformityForDate: [
          ...addQuestionData.positiveConformityForDate.map((con, conIndex) =>
            conIndex == index ? { ...con, [name]: value } : con
          ),
        ],
      };
      setAddQuestionData(list);
    }
  };

  const handleAddClickRedFlag = (index, j) => {
    const list = { ...addQuestionData };
    const thisRedFlagDate = list.redFlagForDate;
    list.redFlagForDate = [
      ...thisRedFlagDate,
      {
        id: "",
        expressionType: "",
        forAnswer: moment().toISOString(),
        forRangeEnd: moment().toISOString(),
      },
    ];
    setAddQuestionData(list);
  };

  const handleRemoveClickRedFlag = (j) => {
    const list = { ...addQuestionData };
    list.redFlagForDate.splice(j, 1);
    setAddQuestionData(list);
  };

  const handleAddClickPositiveFlag = (index, j) => {
    const list = { ...addQuestionData };
    const thisPositiveFlagDate = list.positiveConformityForDate;
    list.positiveConformityForDate = [
      ...thisPositiveFlagDate,
      {
        id: "",
        expressionType: "",
        forAnswer: moment().toISOString(),
        forRangeEnd: moment().toISOString(),
      },
    ];
    setAddQuestionData(list);
  };

  const handleRemoveClickPositiveFlag = (j) => {
    const list = { ...addQuestionData };
    list.positiveConformityForDate.splice(j, 1);
    setAddQuestionData(list);
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
        .UpdateDateQuestion(finalObject)
        .then((res) => {
          setisAlertBoxOpened(false);
          setStateSnackbar(true);
          setToasterMessage("Question details updated.");
          settoasterServerity("success");
          setTimeout(() => {
            props.history.push(
              `/questionaires/view-questions/${props.surveyIdURL}`
            );
            setshowLoadder(false);
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
        .AddDateQuestion(finalObject)
        .then((res) => {
          setisAlertBoxOpened(false);
          setStateSnackbar(true);
          setToasterMessage("Added new question.");
          settoasterServerity("success");
          setTimeout(() => {
            props.history.push(
              `/questionaires/view-questions/${props.surveyIdURL}`
            );
            setshowLoadder(false);
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

  return (
    <>
      <ValidatorForm onSubmit={submitQuestionForm}>
        <Card className="question-card">
          <CardContent className="scrollable-card">
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
                    <label>Is Mandatory?</label>
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
                <Grid item container xs={12}>
                  <Grid item xs={2}>
                    <label className="required">Red Flag</label>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <PurpleSwitch
                          checked={addQuestionData.isPositiveConfirmityRedFlag}
                          name="isPositiveConfirmityRedFlag"
                          onChange={handleChangeSwitch}
                        />
                      }
                      label={
                        addQuestionData.isPositiveConfirmityRedFlag
                          ? "Yes"
                          : "No"
                      }
                    />
                  </Grid>
                </Grid>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  {addQuestionData.isPositiveConfirmityRedFlag ? (
                    <Grid
                      item
                      container
                      xs={12}
                      className="flag-card flag-card-dynamic"
                    >
                      <Grid item xs={2}>
                        <label
                          className={
                            addQuestionData.isPositiveConfirmityRedFlag
                              ? "required"
                              : ""
                          }
                        >
                          Red Flag Answer
                        </label>
                      </Grid>
                      <Grid item xs={10}>
                        {addQuestionData.redFlagForDate &&
                        addQuestionData.redFlagForDate.length > 0
                          ? addQuestionData.redFlagForDate.map((x, i) => {
                              return (
                                <Grid
                                  item
                                  container
                                  xs={12}
                                  spacing={1}
                                  key={`redflag-container${i}`}
                                  className="dynamic-flag-container"
                                >
                                  <Grid
                                    item
                                    xs={2}
                                    key={`redflag-containerSelect${i}`}
                                  >
                                    <FormControl variant="outlined" fullWidth>
                                      <InputLabel
                                        id={`demo-simple-select-outlined-label${i}`}
                                        shrink={false}
                                        className="select-label"
                                      >
                                        {x.expressionType &&
                                        x.expressionType != ""
                                          ? ""
                                          : "Answer type"}
                                      </InputLabel>
                                      <Select
                                        labelId={`demo-simple-select-outlined-label${i}`}
                                        id={`demo-simple-select-outlined${i}`}
                                        value={
                                          x.expressionType
                                            ? x.expressionType
                                            : ""
                                        }
                                        name="expressionType"
                                        onChange={(e) =>
                                          handleChangeFlagR(null, null, e, i)
                                        }
                                        placeholder="Answer type"
                                        InputLabelProps={{
                                          shrink: false,
                                        }}
                                        className="global-input single-select"
                                        required={
                                          addQuestionData.isPositiveConfirmityRedFlag
                                        }
                                      >
                                        <MenuItem value="">
                                          <em>None</em>
                                        </MenuItem>
                                        {props.answerTypes.map((aType) => {
                                          return (
                                            <MenuItem
                                              value={aType.id}
                                              key={`atypered_${aType.id}`}
                                            >
                                              {aType.name}
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={3}
                                    className="date-time-pickers"
                                  >
                                    <KeyboardDatePicker
                                      format={"dd/MM/yyyy"}
                                      fullWidth
                                      id={`forAnswerR${i}`}
                                      placeholder="Answer"
                                      name="forAnswer"
                                      value={x.forAnswer}
                                      onChange={(date, event, e) =>
                                        handleChangeFlagR(
                                          date,
                                          "forAnswer",
                                          null,
                                          i
                                        )
                                      }
                                      className="global-input"
                                      KeyboardButtonProps={{
                                        "aria-label": "change date",
                                      }}
                                      label={
                                        addQuestionData.redFlagForDate[i]
                                          .expressionType == "RANGE"
                                          ? "From"
                                          : "Answer"
                                      }
                                    />
                                  </Grid>
                                  {addQuestionData.redFlagForDate[i]
                                    .expressionType == "RANGE" ? (
                                    <>
                                      <Grid
                                        item
                                        xs={3}
                                        className="date-time-pickers"
                                      >
                                        <KeyboardDatePicker
                                          format={"dd/MM/yyyy"}
                                          fullWidth
                                          id={`forRangeEndR${i}`}
                                          placeholder="Answer"
                                          name="forRangeEnd"
                                          value={x.forRangeEnd}
                                          label="To"
                                          onChange={(date, event, e) =>
                                            handleChangeFlagR(
                                              date,
                                              "forRangeEnd",
                                              null,
                                              i
                                            )
                                          }
                                          className="global-input"
                                          KeyboardButtonProps={{
                                            "aria-label": "change date",
                                          }}
                                        />
                                      </Grid>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  <Grid
                                    item
                                    xs={2}
                                    className="row-icons-container"
                                    key={`redflag-containerIcons${i}`}
                                  >
                                    {addQuestionData.redFlagForDate.length !==
                                      1 && (
                                      <Tooltip title="Remove">
                                        <CancelIcon
                                          className={`delete-row-icon`}
                                          onClick={() =>
                                            handleRemoveClickRedFlag(i)
                                          }
                                        ></CancelIcon>
                                      </Tooltip>
                                    )}
                                    {addQuestionData.redFlagForDate.length -
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
                            })
                          : ""}
                      </Grid>
                    </Grid>
                  ) : (
                    ""
                  )}
                  <Grid
                    item
                    container
                    xs={12}
                    className="flag-card flag-card-dynamic"
                  >
                    <Grid item xs={2}>
                      <label className="required">Positive Conformity</label>
                    </Grid>
                    <Grid item xs={10}>
                      {addQuestionData.positiveConformityForDate &&
                      addQuestionData.positiveConformityForDate.length > 0
                        ? addQuestionData.positiveConformityForDate.map(
                            (x, i) => {
                              return (
                                <Grid
                                  item
                                  container
                                  xs={12}
                                  spacing={1}
                                  key={`positiveflag-container${i}`}
                                  className="dynamic-flag-container"
                                >
                                  <Grid
                                    item
                                    xs={2}
                                    key={`positiveflag-containerSelect${i}`}
                                  >
                                    <FormControl variant="outlined" fullWidth>
                                      <InputLabel
                                        id={`demo-simple-select-outlined-label${i}`}
                                        shrink={false}
                                        className="select-label"
                                      >
                                        {x.expressionType &&
                                        x.expressionType != ""
                                          ? ""
                                          : "Answer type"}
                                      </InputLabel>
                                      <Select
                                        required
                                        labelId={`demo-simple-select-outlined-label${i}`}
                                        id={`demo-simple-select-outlined${i}`}
                                        value={
                                          x.expressionType
                                            ? x.expressionType
                                            : ""
                                        }
                                        name="expressionType"
                                        onChange={(e) =>
                                          handleChangeFlagP(null, null, e, i)
                                        }
                                        placeholder="Answer type"
                                        InputLabelProps={{
                                          shrink: false,
                                        }}
                                        className="global-input single-select"
                                      >
                                        <MenuItem value="">
                                          <em>None</em>
                                        </MenuItem>
                                        {props.answerTypes.map((aType) => {
                                          return (
                                            <MenuItem
                                              value={aType.id}
                                              key={`atypered_${aType.id}`}
                                            >
                                              {aType.name}
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={3}
                                    className="date-time-pickers"
                                  >
                                    <KeyboardDatePicker
                                      format={"dd/MM/yyyy"}
                                      fullWidth
                                      id={`forAnswerR${i}`}
                                      placeholder="Your answer"
                                      name="forAnswer"
                                      value={x.forAnswer}
                                      onChange={(date, event, e) =>
                                        handleChangeFlagP(
                                          date,
                                          "forAnswer",
                                          null,
                                          i
                                        )
                                      }
                                      className="global-input"
                                      label={
                                        addQuestionData
                                          .positiveConformityForDate[i]
                                          .expressionType == "RANGE"
                                          ? "From"
                                          : "Answer"
                                      }
                                      KeyboardButtonProps={{
                                        "aria-label": "change date",
                                      }}
                                    />
                                  </Grid>
                                  {addQuestionData.positiveConformityForDate[i]
                                    .expressionType == "RANGE" ? (
                                    <>
                                      <Grid
                                        item
                                        xs={3}
                                        className="date-time-pickers"
                                      >
                                        <KeyboardDatePicker
                                          format={"dd/MM/yyyy"}
                                          fullWidth
                                          id={`forRangeEndR${i}`}
                                          placeholder="Your answer"
                                          name="forRangeEnd"
                                          value={x.forRangeEnd}
                                          onChange={(date, event, e) =>
                                            handleChangeFlagP(
                                              date,
                                              "forRangeEnd",
                                              null,
                                              i
                                            )
                                          }
                                          className="global-input"
                                          label="To"
                                          KeyboardButtonProps={{
                                            "aria-label": "change date",
                                          }}
                                        />
                                      </Grid>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  <Grid
                                    item
                                    xs={2}
                                    className="row-icons-container"
                                    key={`positiveflag-containerIcons${i}`}
                                  >
                                    {addQuestionData.positiveConformityForDate
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
                                    {addQuestionData.positiveConformityForDate
                                      .length -
                                      1 ===
                                      i && (
                                      <Tooltip title="Add">
                                        <AddCircleIcon
                                          className={`add-row-icon`}
                                          onClick={handleAddClickPositiveFlag}
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
                </MuiPickersUtilsProvider>
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

export default withRouter(DateQuestion);
