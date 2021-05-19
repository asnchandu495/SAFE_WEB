import React, { useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Grid from "@material-ui/core/Grid";
import { Link as LinkTo, withRouter } from "react-router-dom";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import questionaireService from "../../../services/questionaireService";
import ToasterMessageComponent from "../../common/toaster";
import ComponentLoadderComponent from "../../common/loadder/componentloadder";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as globalSettingAction from "../../../Redux/Action/globalSettingAction";

function TimeJump(props) {
  const surveyId = props.match.params.id;
  const questionId = props.match.params.qid;
  const questionaireApiCall = new questionaireService();

  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [showLoadder, setshowLoadder] = useState(false);
  const [conditionalJump, setConditionalJump] = useState({
    id: "",
    surveyQuestionId: questionId,
    timeConditionalQuestions: [
      {
        id: "",
        numericConditionalOrderId: "",
        numericExpressionType: "",
        forAnswer: moment().toISOString(),
        forRangeEnd: moment().toISOString(),
        goToSurveyQuestionId: "",
      },
    ],
    elseGoToQuestionId: "",
    goToNormalSequence: false,
  });

  const [surveyDetails, setsurveyDetails] = useState();
  const [selectedQuestionDetails, setselectedQuestionDetails] = useState();
  const [selectedSurveyQuestions, setSelectedSurveyQuestions] = useState([]);
  const [allAnswerExpressions, setAllAnswerExpressions] = useState([]);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [reloadPage, setReloadPage] = useState("false");

  const GreenCheckbox = withStyles({
    root: {
      color: "#3f51b5",
      "&$checked": {
        color: "#de1b54",
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  useEffect(() => {
    Promise.all([
      questionaireApiCall.getAllExpressions(),
      questionaireApiCall.GetAllQuestionsBySurveyId(surveyId),
      questionaireApiCall.GetTimeQuestionById(questionId),
      questionaireApiCall.getSurveyById(surveyId),
      questionaireApiCall.GetTimeQuestionBooleanById(questionId),
    ])
      .then(
        ([
          allExpressions,
          allSurveyQuestions,
          getTimeDetails,
          getsurveyDetails,
          getTimeBooleanDetails,
        ]) => {
          props.loadGlobalSettingWithoutAPICall();
          setAllAnswerExpressions(allExpressions);
          let filteredQuestions = allSurveyQuestions.filter((r) => {
            return r.id != questionId;
          });
          setSelectedSurveyQuestions(filteredQuestions);
          setselectedQuestionDetails(getTimeDetails);
          setsurveyDetails(getsurveyDetails);
          if (getTimeBooleanDetails) {
            setConditionalJump(getTimeBooleanDetails);
          }
          setReloadPage("false");
          setcomponentLoadder(false);
        }
      )
      .catch((error) => {
        console.log(error);
      });
  }, [reloadPage]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name == "goToNormalSequence") {
      setConditionalJump((conditionalJump) => ({
        ...conditionalJump,
        [name]: checked,
      }));
    } else {
      setConditionalJump((conditionalJump) => ({
        ...conditionalJump,
        [name]: value,
      }));
    }
  };

  const handleChangeLogicAnswer = (date, key, e, index) => {
    if (key != null) {
      const list = {
        ...conditionalJump,
        timeConditionalQuestions: [
          ...conditionalJump.timeConditionalQuestions.map((con, conIndex) =>
            conIndex == index ? { ...con, [key]: date } : con
          ),
        ],
      };
      setConditionalJump(list);
    } else {
      const { name, value } = e.target;
      const list = {
        ...conditionalJump,
        timeConditionalQuestions: [
          ...conditionalJump.timeConditionalQuestions.map((con, conIndex) =>
            conIndex == index ? { ...con, [name]: value } : con
          ),
        ],
      };
      setConditionalJump(list);
    }
  };

  const handleAddClickLogicAnswer = (index, j) => {
    const list = { ...conditionalJump };
    const thisconditionalJumpAnswers = list.timeConditionalQuestions;
    list.timeConditionalQuestions = [
      ...thisconditionalJumpAnswers,
      {
        id: "",
        numericConditionalOrderId: "",
        numericExpressionType: "",
        forAnswer: moment().toISOString(),
        forRangeEnd: moment().toISOString(),
        goToSurveyQuestionId: "",
      },
    ];
    setConditionalJump(list);
  };

  const handleRemoveClickLogicAnswer = (j) => {
    const list = { ...conditionalJump };
    list.timeConditionalQuestions.splice(j, 1);
    setConditionalJump(list);
  };

  function submitForm(e) {
    e.preventDefault();
    setshowLoadder(true);
    if (conditionalJump.id != "") {
      questionaireApiCall
        .updateTimeConditionalJump(conditionalJump)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Conditional jump is updated.");
          settoasterServerity("success");
          setTimeout(function () {
            setshowLoadder(false);
            props.history.push("/questionaires/view-questions/" + surveyId);
            setReloadPage("true");
          }, 5000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      questionaireApiCall
        .addTimeConditionalJump(conditionalJump)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Conditional jump is added.");
          settoasterServerity("success");
          setTimeout(function () {
            setshowLoadder(false);
            props.history.push("/questionaires/view-questions/" + surveyId);
            setReloadPage("true");
          }, 5000);
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
    <div className="innerpage-container">
      <Breadcrumbs aria-label="breadcrumb" className="global-breadcrumb">
        <LinkTo
          color="inherit"
          href="#"
          to={`/home/dashboard`}
          className="inactive"
        >
          Home
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href={"/questionaires/allquestionaires"}
          to={`/questionaires/allquestionaires`}
          className="inactive"
        >
          Questionnaires
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          className="inactive"
          to={`/questionaires/view-questions/` + surveyId}
        >
          {surveyDetails ? surveyDetails.name : ""}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Conditional Jump
        </LinkTo>
      </Breadcrumbs>
      <div className="main-paper-add-question">
        <div className="add-new-question">
          {!componentLoadder ? (
            <Card className="question-card auto-height-card flag-card-dynamic">
              <ValidatorForm className={`global-form`} onSubmit={submitForm}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h6">
                      Conditional jump
                    </Typography>
                    <Grid
                      container
                      xs={12}
                      sm={12}
                      className="jump-form-content"
                      spacing={1}
                    >
                      <Grid item container xs={12}>
                        <Grid item xs={2}>
                          <label className="required">Config logic</label>
                        </Grid>
                        <Grid container sm={10} spacing={2}>
                          {conditionalJump.timeConditionalQuestions.length > 0
                            ? conditionalJump.timeConditionalQuestions.map(
                                (x, i) => {
                                  return (
                                    <Grid
                                      spacing={1}
                                      container
                                      sm={12}
                                      key={`answer-logic-container${i}`}
                                      className="answer-logic-container"
                                    >
                                      <Grid
                                        item
                                        xs={2}
                                        className="center-align-w-padding-v"
                                      >
                                        <FormControl
                                          variant="outlined"
                                          fullWidth
                                        >
                                          <InputLabel
                                            id={`demo-simple-select-outlined-label${i}`}
                                            shrink={false}
                                            className="select-label"
                                          >
                                            {x.numericExpressionType &&
                                            x.numericExpressionType != ""
                                              ? ""
                                              : "Expression type"}
                                          </InputLabel>
                                          <Select
                                            required
                                            labelId={`demo-simple-select-outlined-label${i}`}
                                            id={`demo-simple-select-outlined${i}`}
                                            value={
                                              x.numericExpressionType
                                                ? x.numericExpressionType
                                                : ""
                                            }
                                            name="numericExpressionType"
                                            onChange={(e) =>
                                              handleChangeLogicAnswer(
                                                null,
                                                null,
                                                e,
                                                i
                                              )
                                            }
                                            placeholder="Select expression"
                                            InputLabelProps={{
                                              shrink: false,
                                            }}
                                            className="global-input single-select"
                                          >
                                            <MenuItem value="">
                                              <em>None</em>
                                            </MenuItem>
                                            {allAnswerExpressions.map(
                                              (aType) => {
                                                return (
                                                  <MenuItem
                                                    value={aType.id}
                                                    key={`atypered_${aType.id}`}
                                                  >
                                                    {aType.name}
                                                  </MenuItem>
                                                );
                                              }
                                            )}
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={2}
                                        className="date-time-pickers"
                                      >
                                        <KeyboardTimePicker
                                          format={
                                            props.loadGlobalSettingsData
                                              ? props.loadGlobalSettingsData
                                                  .timeFormat != null
                                                ? props.loadGlobalSettingsData
                                                    .timeFormat
                                                : "hh:mm"
                                              : "hh:mm"
                                          }
                                          ampm={
                                            props.loadGlobalSettingsData
                                              ? props.loadGlobalSettingsData
                                                  .timeFormat != null
                                                ? props.loadGlobalSettingsData.timeFormat.includes(
                                                    "HH"
                                                  )
                                                  ? false
                                                  : true
                                                : true
                                              : true
                                          }
                                          fullWidth
                                          id={`forAnswerR${i}`}
                                          placeholder="Your answer"
                                          name="forAnswer"
                                          label={
                                            conditionalJump
                                              .timeConditionalQuestions[i]
                                              .numericExpressionType == "RANGE"
                                              ? "From"
                                              : "Answer"
                                          }
                                          value={x.forAnswer}
                                          onChange={(date, event, e) =>
                                            handleChangeLogicAnswer(
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
                                        />
                                      </Grid>
                                      {conditionalJump.timeConditionalQuestions[
                                        i
                                      ].numericExpressionType == "RANGE" ? (
                                        <>
                                          <Grid
                                            item
                                            xs={2}
                                            className="date-time-pickers"
                                          >
                                            <KeyboardTimePicker
                                              format={
                                                props.loadGlobalSettingsData
                                                  ? props.loadGlobalSettingsData
                                                      .timeFormat != null
                                                    ? props
                                                        .loadGlobalSettingsData
                                                        .timeFormat
                                                    : "hh:mm"
                                                  : "hh:mm"
                                              }
                                              ampm={
                                                props.loadGlobalSettingsData
                                                  ? props.loadGlobalSettingsData
                                                      .timeFormat != null
                                                    ? props.loadGlobalSettingsData.timeFormat.includes(
                                                        "HH"
                                                      )
                                                      ? false
                                                      : true
                                                    : true
                                                  : true
                                              }
                                              fullWidth
                                              id={`forRangeEndR${i}`}
                                              placeholder="Your answer"
                                              name="forRangeEnd"
                                              label="To"
                                              value={x.forRangeEnd}
                                              onChange={(date, event, e) =>
                                                handleChangeLogicAnswer(
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
                                        <></>
                                      )}
                                      <Grid item xs={5}>
                                        <FormControl
                                          variant="outlined"
                                          fullWidth
                                        >
                                          <InputLabel
                                            id="demo-simple-select-outlined-label"
                                            shrink={false}
                                            className="select-label"
                                          >
                                            {x.goToSurveyQuestionId == ""
                                              ? "Select question"
                                              : ""}
                                          </InputLabel>
                                          <Select
                                            required
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={x.goToSurveyQuestionId}
                                            name="goToSurveyQuestionId"
                                            onChange={(e) =>
                                              handleChangeLogicAnswer(
                                                null,
                                                null,
                                                e,
                                                i
                                              )
                                            }
                                            placeholder="Select question"
                                            InputLabelProps={{
                                              shrink: false,
                                            }}
                                            className="global-input single-select"
                                          >
                                            <MenuItem value="">
                                              <em>None</em>
                                            </MenuItem>
                                            {selectedSurveyQuestions.map(
                                              (ans) => {
                                                return (
                                                  <MenuItem
                                                    value={ans.id}
                                                    key={`atypered_${ans.id}`}
                                                  >
                                                    {ans.question}
                                                  </MenuItem>
                                                );
                                              }
                                            )}
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={1}
                                        className="row-icons-container"
                                      >
                                        {conditionalJump
                                          .timeConditionalQuestions.length !==
                                          1 && (
                                          <Tooltip title="Remove">
                                            <CancelIcon
                                              className={`delete-row-icon`}
                                              onClick={() =>
                                                handleRemoveClickLogicAnswer(i)
                                              }
                                            ></CancelIcon>
                                          </Tooltip>
                                        )}
                                        {conditionalJump
                                          .timeConditionalQuestions.length -
                                          1 ===
                                          i && (
                                          <Tooltip title="Add">
                                            <AddCircleIcon
                                              className={`add-row-icon`}
                                              onClick={
                                                handleAddClickLogicAnswer
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
                      <Grid item container xs={12}>
                        <Grid item xs={2}>
                          <label className="">Default</label>
                        </Grid>
                        <Grid container xs={8} spacing={2}>
                          <Grid item container xs={12} spacing={1}>
                            <Grid item xs={3} className="checkbox-grid">
                              <FormControlLabel
                                control={
                                  <GreenCheckbox
                                    checked={conditionalJump.goToNormalSequence}
                                    onChange={handleChange}
                                    name="goToNormalSequence"
                                  />
                                }
                                label="Goto normal sequence"
                              />
                            </Grid>
                            {conditionalJump.goToNormalSequence ? (
                              <Grid item xs={6}>
                                <FormControl variant="outlined" fullWidth>
                                  <InputLabel
                                    id="demo-simple-select-outlined-label"
                                    shrink={false}
                                    className="select-label"
                                  >
                                    {conditionalJump.elseGoToQuestionId == ""
                                      ? "Select question"
                                      : ""}
                                  </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={conditionalJump.elseGoToQuestionId}
                                    name="elseGoToQuestionId"
                                    onChange={handleChange}
                                    placeholder="Select question"
                                    InputLabelProps={{
                                      shrink: false,
                                    }}
                                    className="global-input single-select"
                                  >
                                    <MenuItem value="">
                                      <em>None</em>
                                    </MenuItem>
                                    {selectedSurveyQuestions.map((ans) => {
                                      return (
                                        <MenuItem
                                          value={ans.id}
                                          key={`atypered_${ans.id}`}
                                        >
                                          {ans.question}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                              </Grid>
                            ) : (
                              ""
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </MuiPickersUtilsProvider>
                <CardActions className="action-container">
                  <Button
                    size="small"
                    type="button"
                    className="global-cancel-btn"
                    variant="contained"
                  >
                    Back
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
              </ValidatorForm>
            </Card>
          ) : (
            <ComponentLoadderComponent />
          )}
        </div>
      </div>
      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
    </div>
  );
}

TimeJump.propTypes = {
  loadGlobalSettingWithoutAPICall: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    loadGlobalSettingsData: state.loadGlobalSettingsData,
  };
}

const mapDispatchToProps = {
  loadGlobalSettingWithoutAPICall:
    globalSettingAction.loadGlobalSettingWithoutAPICall,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeJump);
