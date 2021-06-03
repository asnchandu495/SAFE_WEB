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
import AlertBoxComponent from "../common/alert";
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
  }
}

function PublishQuestionnaire(props) {
  const questionnaireId = props.match.params.id;
  const [componentLoadder, setComponentLoadder] = useState(true);
  const questionaireApiCall = new questionaireService();
  const [showLoadder, setshowLoadder] = useState(false);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
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
    answer: false,
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
    answer: "",
    surveyQuestionId: "",
  });
  const [dateAnswer, setDateAnswer] = useState({
    answer: "",
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

  useEffect(() => {
    Promise.all([
      questionaireApiCall.getSurveyById(questionnaireId),
      questionaireApiCall.getFirstQuestion(questionnaireId),
    ])
      .then(([questionaireInfo, firstQuestion]) => {
        setViewQuestionaireDetails(questionaireInfo);
        setCurrentQuestion(firstQuestion.question);
        setComponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handlePublish() {
    setshowLoadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    var publishData = formData;
    questionaireApiCall
      .PublishQuestionnaire(publishData)
      .then((result) => {
        setisAlertBoxOpened(false);
        setshowLoadder(false);
        setStateSnackbar(true);
        setToasterMessage("Questionnaire is Published");
        settoasterServerity("success");
        setTimeout(() => {
          props.history.push("/questionaires/allquestionaires");
          setshowLoadder(false);
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
        setToasterMessage(err.data.errors);

        settoasterServerity("error");
        setStateSnackbar(true);
        setshowLoadder(false);
      });
  }

  function submitCurrentQuestion(e) {
    e.preventDefault();
    console.log(currentQuestion);
    console.log(multiselectAnswer);
    switch (currentQuestion.questionType) {
      case "Boolean":
        break;
      case "FreeText":
        break;
      case "Date":
        break;
      case "Time":
        break;
      case "Numeric":
        let sendData = numberAnswer;
        sendData.answer = parseFloat(numberAnswer.answer);
        sendData.surveyQuestionId = currentQuestion.id;
        questionaireApiCall
          .submitNumericAnswer(sendData)
          .then((response) => {
            if (response.question) {
              setCurrentQuestion(response.question);
            } else {
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
            if (response.question) {
              setCurrentQuestion(response.question);
            } else {
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
            console.log(response);
            if (response.question) {
              setCurrentQuestion(response.question);
            } else {
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

  return (
    <div className="innerpage-container">
      <AlertBoxComponent />
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
        <LinkTo color="textPrimary" href="#" className="inactive">
          {ViewQuestionaireDetails.name}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Review Questionnaire
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <Paper className="main-paper main-paper-add-question">
          {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Publish
          </Button> */}
          <Paper className="add-new-question">
            <ValidatorForm
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
                    ></LoadQuestion>
                  </div>
                </CardContent>
                <CardActions className="action-container">
                  <Button
                    type="submit"
                    onClick={submitCurrentQuestion}
                    size="small"
                    color="primary"
                  >
                    Submit
                  </Button>
                </CardActions>
              </Card>
            </ValidatorForm>
          </Paper>

          <Dialog
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
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
              <div className={`form-buttons-container`}>
                <Button
                  variant="contained"
                  onClick={handlePublish}
                  color="primary"
                  className="global-submit-btn"
                  disabled={showLoadder}
                >
                  {" "}
                  {showLoadder ? <ButtonLoadderComponent /> : "Yes"}
                </Button>
              </div>
              <div className={`form-buttons-container`}>
                <Button
                  variant="contained"
                  onClick={handleClose}
                  color="secondary"
                  className="global-danger-btn"
                >
                  No
                </Button>
              </div>
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

export default PublishQuestionnaire;
