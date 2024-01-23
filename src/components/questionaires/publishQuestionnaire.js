import React, { Fragment, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { connect } from "react-redux";
import * as TeamAction from "../../Redux/Action/teamAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import Autocomplete from "@material-ui/lab/Autocomplete";
import questionaireService from "../../services/questionaireService";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import ShorttextQuestion from "./preview/shorttextQuestion";
import NumberQuestion from "./preview/numberQuestion";
import TimeQuestion from "./preview/timeQuestion";
import DateQuestion from "./preview/dateQuestion";
import SingleselectQuestion from "./preview/singleselectQuestion";
import MultiselectQuestion from "./preview/multiselectQuestion";
import BooleanQuestion from "./preview/booleanQuestion";
import moment from "moment";
import * as globalSettingAction from "../../Redux/Action/globalSettingAction";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

function LoadQuestion(props) {
  switch (props.currentQuestion.questionType) {
    case "Numeric":
      return (
        <NumberQuestion
          currentQuestion={props.currentQuestion}
          numberAnswer={props.numberAnswer}
          setNumberAnswer={props.setNumberAnswer}
        ></NumberQuestion>
      );
    case "SingleChoice":
      return (
        <SingleselectQuestion
          currentQuestion={props.currentQuestion}
          singleselectAnswer={props.singleselectAnswer}
          setSingleselectAnswer={props.setSingleselectAnswer}
        ></SingleselectQuestion>
      );
    case "MultiChoice":
      return (
        <MultiselectQuestion
          currentQuestion={props.currentQuestion}
          multiselectAnswer={props.multiselectAnswer}
          setMultiselectAnswer={props.setMultiselectAnswer}
        ></MultiselectQuestion>
      );
    case "Boolean":
      return (
        <BooleanQuestion
          currentQuestion={props.currentQuestion}
          booleanAnswer={props.booleanAnswer}
          setBooleanAnswer={props.setBooleanAnswer}
        ></BooleanQuestion>
      );
    case "Date":
      return (
        <DateQuestion
          currentQuestion={props.currentQuestion}
          dateAnswer={props.dateAnswer}
          setDateAnswer={props.setDateAnswer}
        ></DateQuestion>
      );
    case "FreeText":
      return (
        <ShorttextQuestion
          currentQuestion={props.currentQuestion}
          shorttextAnswer={props.shorttextAnswer}
          setShorttextAnswer={props.setShorttextAnswer}
        ></ShorttextQuestion>
      );
    case "Time":
      return (
        <TimeQuestion
          currentQuestion={props.currentQuestion}
          timeAnswer={props.timeAnswer}
          setTimeAnswer={props.setTimeAnswer}
          loadGlobalSettingsData={props.loadGlobalSettingsData}
        ></TimeQuestion>
      );
  }
}

function PublishQuestionnaire(props) {
  const questionnaireId = props.match.params.id;
  const [componentLoadder, setComponentLoadder] = useState(true);
  const questionaireApiCall = new questionaireService();
  const [showLoadder, setshowLoadder] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [ViewQuestionaireDetails, setViewQuestionaireDetails] = useState([]);
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  const [formData, SetformData] = useState({
    id: questionnaireId,
    isSaveAsDraft: false,
  });
  const [booleanAnswer, setBooleanAnswer] = useState({
    answer: "",
    surveyQuestionId: "",
  });
  const [shorttextAnswer, setShorttextAnswer] = useState({
    answer: "",
    surveyQuestionId: "",
  });
  const [numberAnswer, setNumberAnswer] = useState({
    answer: 0,
    surveyQuestionId: "",
  });
  const [timeAnswer, setTimeAnswer] = useState({
    answer: moment().toISOString(),
    surveyQuestionId: "",
  });
  const [dateAnswer, setDateAnswer] = useState({
    answer: moment().toISOString(),
    surveyQuestionId: "",
  });
  const [singleselectAnswer, setSingleselectAnswer] = useState({
    answerChoiceId: "",
    surveyQuestionId: "",
  });
  const [multiselectAnswer, setMultiselectAnswer] = useState({
    answers: [],
    surveyQuestionId: "",
  });
  const [isQuestionEnd, setIsQuestionEnd] = useState(false);
  const [isQuestionSubmit, setIsQuestionSubmit] = useState(false);
  const [isQuestionPublish, setIsQuestionPublish] = useState(false);
  const [isEmptyFirstQuestion, setIsEmptyFirstQuestion] = useState(false);

  useEffect(() => {
    Promise.all([
      questionaireApiCall.getSurveyById(questionnaireId),
      questionaireApiCall.getFirstQuestion(questionnaireId),
    ])
      .then(([questionaireInfo, firstQuestion]) => {
        props.loadGlobalSettingWithoutAPICall();
        setViewQuestionaireDetails(questionaireInfo);
        console.log(firstQuestion);
        setCurrentQuestion(firstQuestion.question);
        if (!firstQuestion.question) {
          setIsEmptyFirstQuestion(true);
        }
        setComponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
//Method on click of publish
  function handlePublish() {
    setIsQuestionPublish(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    var publishData = formData;
    questionaireApiCall
      .PublishQuestionnaire(publishData)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Questionnaire is Published");
        settoasterServerity("success");
        setTimeout(() => {
          props.history.push("/questionaires/allquestionaires");
          setIsQuestionPublish(false);
        }, 6000);
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
        setIsQuestionPublish(false);
      });
  }
//Method to submit a current question
  function submitCurrentQuestion(e) {
    e.preventDefault();
    setIsQuestionSubmit(true);
    switch (currentQuestion.questionType) {
      case "Numeric":
        let sendData = numberAnswer;
        sendData.answer = parseFloat(numberAnswer.answer);
        sendData.surveyQuestionId = currentQuestion.id;
        questionaireApiCall
          .submitNumericAnswer(sendData)
          .then((response) => {
            setIsQuestionSubmit(false);
            if (response.question) {
              setCurrentQuestion(response.question);
            } else {
              setIsQuestionEnd(true);
            }
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "FreeText":
        let sendDataShorttext = shorttextAnswer;
        sendDataShorttext.surveyQuestionId = currentQuestion.id;
        questionaireApiCall
          .submitShorttextAnswer(sendDataShorttext)
          .then((response) => {
            setIsQuestionSubmit(false);
            if (response.question) {
              setCurrentQuestion(response.question);
            } else {
              setIsQuestionEnd(true);
            }
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "Date":
        let sendDataDate = dateAnswer;
        sendDataDate.surveyQuestionId = currentQuestion.id;
        questionaireApiCall
          .submitDateAnswer(sendDataDate)
          .then((response) => {
            setIsQuestionSubmit(false);
            if (response.question) {
              setCurrentQuestion(response.question);
            } else {
              setIsQuestionEnd(true);
            }
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "Time":
        let sendDataTime = timeAnswer;
        sendDataTime.surveyQuestionId = currentQuestion.id;
        questionaireApiCall
          .submitTimeAnswer(sendDataTime)
          .then((response) => {
            setIsQuestionSubmit(false);
            if (response.question) {
              setCurrentQuestion(response.question);
            } else {
              setIsQuestionEnd(true);
            }
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "Boolean":
        let sendDataBoolean = booleanAnswer;
        sendDataBoolean.surveyQuestionId = currentQuestion.id;
        sendDataBoolean.answer =
          sendDataBoolean.answer == "true" ? true : false;
        questionaireApiCall
          .submitBooleanAnswer(sendDataBoolean)
          .then((response) => {
            setIsQuestionSubmit(false);
            if (response.question) {
              setCurrentQuestion(response.question);
            } else {
              setIsQuestionEnd(true);
            }
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "SingleChoice":
        let sendDataSingleselect = singleselectAnswer;
        sendDataSingleselect.surveyQuestionId = currentQuestion.id;
        questionaireApiCall
          .submitSingleselectAnswer(sendDataSingleselect)
          .then((response) => {
            setIsQuestionSubmit(false);
            if (response.question) {
              setCurrentQuestion(response.question);
            } else {
              setIsQuestionEnd(true);
            }
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "MultiChoice":
        let sendDataMultiselect = multiselectAnswer;
        sendDataMultiselect.surveyQuestionId = currentQuestion.id;
        let newOptions = [];
        sendDataMultiselect.answers.map((ans) => {
          newOptions.push({ surveyReplyChoiceId: ans.optionId });
        });
        sendDataMultiselect.answers = newOptions;
        questionaireApiCall
          .submitMultiselectAnswer(sendDataMultiselect)
          .then((response) => {
            setIsQuestionSubmit(false);
            if (response.question) {
              setCurrentQuestion(response.question);
            } else {
              setIsQuestionEnd(true);
            }
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      default:
        return <h4>Not found</h4>;
    }
  }

  function handleClickGoBack() {
    props.history.push("/questionaires/allquestionaires");
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
          href="#"
          to={`/questionaires/allquestionaires`}
          className="inactive"
        >
          List
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/questionaires/view-questions/` + questionnaireId}
          className="inactive"
        >
          {ViewQuestionaireDetails.name}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Review Questionnaire
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <Paper className="main-paper main-paper-add-question">
          <Paper className="add-new-question">
            {isEmptyFirstQuestion ? <div className="no-questions-pub global-form">
              <p>Please configure questions, order of execution and evaluation criteria to publish the questionnaire .
              </p>
              <div className={`form-buttons-container`}>
                <Button
                  variant="contained"
                  type="reset"
                  onClick={handleClickGoBack}
                  className="global-cancel-btn"
                >
                  Cancel
                </Button>
              </div>
            </div> : <ValidatorForm
              className={`global-form`}
              onSubmit={submitCurrentQuestion}
            >
              <Card className="question-type-card">
                <CardContent>
                  <div className="card-form">
                    <LoadQuestion
                      currentQuestion={currentQuestion}
                      numberAnswer={numberAnswer}
                      setNumberAnswer={setNumberAnswer}
                      singleselectAnswer={singleselectAnswer}
                      setSingleselectAnswer={setSingleselectAnswer}
                      multiselectAnswer={multiselectAnswer}
                      setMultiselectAnswer={setMultiselectAnswer}
                      booleanAnswer={booleanAnswer}
                      setBooleanAnswer={setBooleanAnswer}
                      dateAnswer={dateAnswer}
                      setDateAnswer={setDateAnswer}
                      shorttextAnswer={shorttextAnswer}
                      setShorttextAnswer={setShorttextAnswer}
                      timeAnswer={timeAnswer}
                      setTimeAnswer={setTimeAnswer}
                      loadGlobalSettingsData={props.loadGlobalSettingsData}
                    ></LoadQuestion>
                  </div>
                </CardContent>
                <CardActions className="action-container">
                  <Button
                    variant="contained"
                    type="reset"
                    onClick={handleClickGoBack}
                    className="global-cancel-btn"
                  >
                    Cancel
                  </Button>
                  {isQuestionEnd ? (
                    <Button
                      type="button"
                      onClick={handleClickOpen}
                      className="global-submit-btn"
                      disabled={isQuestionPublish}
                    >
                      {isQuestionSubmit ? (
                        <ButtonLoadderComponent />
                      ) : (
                        "Publish"
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      onClick={submitCurrentQuestion}
                      className="global-submit-btn"
                      disabled={isQuestionSubmit}
                    >
                      {isQuestionSubmit ? <ButtonLoadderComponent /> : "Submit"}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </ValidatorForm>}

          </Paper>

          <Dialog
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            className="global-dialog confirmation-dialog global-form"
            open={open}
          >
            <DialogTitle id="form-dialog-title" onClose={handleClose}>
              Publish
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                Are you sure you want to publish this changes?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handlePublish}
                className="yes-button"
                disabled={isQuestionPublish}
              >
                {" "}
                {isQuestionPublish ? <ButtonLoadderComponent /> : "Yes"}
              </Button>
              <Button onClick={handleClose} className="no-button">
                No
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      ) : (
        <ComponentLoadderComponent />
      )}
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

PublishQuestionnaire.propTypes = {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishQuestionnaire);
