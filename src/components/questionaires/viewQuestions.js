import React, { useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link as LinkTo } from "react-router-dom";
import { ValidatorForm } from "react-material-ui-form-validator";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import ListofQuestions from "./listofQuestions";
import QuestionType from "./selectQuestionType";
import QuestionDetails from "./questionDetails";
import FreetextDetails from "./selectedQuestionDetails/freetextDetails";
import BooleanDetails from "./selectedQuestionDetails/booleanDetails";
import DateDetails from "./selectedQuestionDetails/dateDetails";
import TimeDetails from "./selectedQuestionDetails/timeDetails";
import NumericDetails from "./selectedQuestionDetails/numericDetails";
import SingleChoiceDetails from "./selectedQuestionDetails/singlechoiceDetails";
import MultiChoiceDetails from "./selectedQuestionDetails/multichoiceDetails";
import questionaireService from "../../services/questionaireService";

function ViewQuestions(props) {
  const questionaireId = props.match.params.id;
  const questionaireApiCall = new questionaireService();
  const [questionTypes, setQuestionTypes] = useState([
    { id: "001", name: "Yes / No" },
    { id: "002", name: "Number" },
    { id: "003", name: "Date" },
    { id: "004", name: "Time" },
    { id: "005", name: "Short text" },
    { id: "006", name: "Single select" },
    { id: "007", name: "Multi select" },
  ]);
  const [answerTypes, setAnswerTypes] = useState([
    { id: "001", name: "=" },
    { id: "002", name: ">" },
    { id: "003", name: ">=" },
    { id: "004", name: "<" },
    { id: "005", name: "<=" },
    { id: "006", name: "Range" },
  ]);
  const [questionTypeForm, setQuestionTypeForm] = useState({
    questionType: "",
  });
  const [ViewQuestionaireDetails, setViewQuestionaireDetails] = useState([]);
  const [addQuestionBoolean, setAddQuestionBoolean] = useState({
    id: "",
    questionType: "",
    question: "",
    description: "",
    positiveRedFlagResponse: "",
    redFlagResponse: "",
    isPositiveConfirmity: true,
    isPositiveConfirmityRedFlag: false,
    isMandatory: false,
  });
  const [selectedQuestionDetails, setSelectedQuestionDetails] = useState();
  // const [selectedfreetextDetails, setSelectedfreetextDetails] = useState();

  useEffect(() => {
    questionaireApiCall
      .getSurveyById(questionaireId)
      .then((questionaireInfo) => {
        setViewQuestionaireDetails(questionaireInfo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function gotoAddQuestion() {
    props.history.push(`/questionaires/add-questions/${questionaireId}/0`);
  }

  function RenderFlagComponent(props) {
    switch (props.currentQuestionsType) {
      case "Boolean":
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align">
              <BooleanDetails
                selectedQuestionDetails={selectedQuestionDetails}
              ></BooleanDetails>
            </Grid>
          </Grid>
        );

      case "FreeText":
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align">
              <FreetextDetails
                selectedQuestionDetails={selectedQuestionDetails}
              ></FreetextDetails>{" "}
            </Grid>
          </Grid>
        );

      case "Date":
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align">
              <DateDetails
                selectedQuestionDetails={selectedQuestionDetails}
              ></DateDetails>{" "}
            </Grid>
          </Grid>
        );

      case "Time":
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align">
              <TimeDetails
                selectedQuestionDetails={selectedQuestionDetails}
              ></TimeDetails>{" "}
            </Grid>
          </Grid>
        );

      case "Numeric":
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align">
              <NumericDetails
                selectedQuestionDetails={selectedQuestionDetails}
              ></NumericDetails>{" "}
            </Grid>
          </Grid>
        );

      case "SingleChoice":
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align">
              <SingleChoiceDetails
                selectedQuestionDetails={selectedQuestionDetails}
              ></SingleChoiceDetails>{" "}
            </Grid>
          </Grid>
        );

      case "MultiChoice":
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align">
              <MultiChoiceDetails
                selectedQuestionDetails={selectedQuestionDetails}
              ></MultiChoiceDetails>{" "}
            </Grid>
          </Grid>
        );

      default:
        return <h4>Not found</h4>;
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
          href="#"
          to={`/questionaires/allquestionaires`}
          className="inactive"
        >
          Questionaire
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="inactive">
          {ViewQuestionaireDetails.name}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Questions
        </LinkTo>
      </Breadcrumbs>
      <Paper className="main-paper main-paper-add-question">
        <Grid container spacing={0}>
          <Grid item xs={12} sm={3} className="list-questions-container">
            <Paper className="list-questions">
              <ListofQuestions
                setSelectedQuestionDetails={setSelectedQuestionDetails}
                // setSelectedfreetextDetails={setSelectedfreetextDetails}
              ></ListofQuestions>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Paper className="add-new-question">
              <ValidatorForm className={`global-form`}>
                {/* <Grid container spacing={0}> */}
                {/* <Grid item xs={11} sm={11} className="center-align"> */}
                <RenderFlagComponent
                  currentQuestionsType={
                    selectedQuestionDetails
                      ? selectedQuestionDetails.questionType
                      : ""
                  }
                ></RenderFlagComponent>

                {/* <QuestionDetails
                      selectedQuestionDetails={selectedQuestionDetails}
                    ></QuestionDetails>
                    <FreetextDetails
                      selectedfreetextDetails={selectedfreetextDetails}
                    ></FreetextDetails> */}
                {/* </Grid> */}
                {/* </Grid> */}
              </ValidatorForm>
              <SpeedDial
                ariaLabel="SpeedDial example"
                hidden={false}
                icon={<SpeedDialIcon />}
                direction={`up`}
                className="add-question-speeddial"
                onClick={gotoAddQuestion}
              ></SpeedDial>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default ViewQuestions;
