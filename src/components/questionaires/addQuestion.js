import React, { useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link as LinkTo, withRouter } from "react-router-dom";
import ListofQuestions from "./listofQuestions";
import QuestionType from "./selectQuestionType";
import AddQuestionDetails from "./addQuestionDetails";
import questionaireService from "../../services/questionaireService";
import ComponentLoadderComponent from "../common/loadder/componentloadder";

function AddQuestion(props) {
  const questionaireApiCall = new questionaireService();

  const query = new URLSearchParams(props.location.search);
  const editQuestionType = query.get("type");

  const surveyIdURL = props.match.params.id;
  const questionIdURL = props.match.params.qid;
  const [questionTypes, setQuestionTypes] = useState([]);

  const [componentLoadder, setComponentLoadder] = useState(true);
  const [ViewQuestionaireDetails, setViewQuestionaireDetails] = useState([]);
  const [gotoAddQuestion, setGotoAddQuestion] = useState(false);
  const [questionTypeForm, setQuestionTypeForm] = useState({
    questionType: "",
  });
  const [selectedQuestionDetails, setSelectedQuestionDetails] = useState();

  useEffect(() => {
    Promise.all([questionaireApiCall.GetALLTypes()])
      .then(([res]) => {
        if (questionIdURL != 0) {
          setQuestionTypes(res);
          callQuestionDetailsAPI(questionIdURL, editQuestionType);
        } else {
          setQuestionTypes(res);
          setComponentLoadder(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [surveyIdURL, questionIdURL]);

  function callQuestionDetailsAPI(getQuesId, editQuestionType) {
    switch (editQuestionType) {
      case "Boolean":
        questionaireApiCall
          .GetBooleanQuestionById(getQuesId)
          .then((booleanQuestionResponse) => {
            setSelectedQuestionDetails(booleanQuestionResponse);
            setQuestionTypeForm({
              questionType: booleanQuestionResponse.questionType,
            });
            setComponentLoadder(false);
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "FreeText":
        questionaireApiCall
          .GetFreeTextQuestion(getQuesId)
          .then((freetextQuestionResponse) => {
            setSelectedQuestionDetails(freetextQuestionResponse);
            setQuestionTypeForm({
              questionType: freetextQuestionResponse.questionType,
            });
            setComponentLoadder(false);
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "Date":
        questionaireApiCall
          .GetDateTimeById(getQuesId)
          .then((freetextQuestionResponse) => {
            setSelectedQuestionDetails(freetextQuestionResponse);
            setQuestionTypeForm({
              questionType: freetextQuestionResponse.questionType,
            });
            setComponentLoadder(false);
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "Time":
        questionaireApiCall
          .GetTimeQuestionById(getQuesId)
          .then((freetextQuestionResponse) => {
            setSelectedQuestionDetails(freetextQuestionResponse);
            setQuestionTypeForm({
              questionType: freetextQuestionResponse.questionType,
            });
            setComponentLoadder(false);
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "Numeric":
        questionaireApiCall
          .GetNumeicQuestionById(getQuesId)
          .then((freetextQuestionResponse) => {
            setSelectedQuestionDetails(freetextQuestionResponse);
            setQuestionTypeForm({
              questionType: freetextQuestionResponse.questionType,
            });
            setComponentLoadder(false);
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
          Questionaires
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="inactive">
          {ViewQuestionaireDetails ? ViewQuestionaireDetails.name : ""}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Add question
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <>
          <Paper className="main-paper main-paper-add-question">
            <Grid container spacing={0}>
              <Grid item xs={12} sm={12}>
                <Paper className="add-new-question">
                  <div className={`global-form`}>
                    <Grid container spacing={0}>
                      {!gotoAddQuestion ? (
                        <Grid item xs={12} sm={12} className="center-align">
                          <QuestionType
                            questionTypes={questionTypes}
                            gotoAddQuestion={gotoAddQuestion}
                            setGotoAddQuestion={setGotoAddQuestion}
                            setQuestionTypeForm={setQuestionTypeForm}
                            questionTypeForm={questionTypeForm}
                            surveyIdURL={surveyIdURL}
                            questionIdURL={questionIdURL}
                            selectedQuestionDetails={selectedQuestionDetails}
                          ></QuestionType>
                        </Grid>
                      ) : (
                        <Grid item xs={12} sm={12} className="center-align">
                          <Grid item xs={12} sm={12}>
                            <AddQuestionDetails
                              gotoAddQuestion={gotoAddQuestion}
                              setGotoAddQuestion={setGotoAddQuestion}
                              setQuestionTypeForm={setQuestionTypeForm}
                              questionTypeForm={questionTypeForm}
                              surveyIdURL={surveyIdURL}
                              questionIdURL={questionIdURL}
                              selectedQuestionDetails={selectedQuestionDetails}
                            ></AddQuestionDetails>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </>
      ) : (
        <ComponentLoadderComponent />
      )}
    </div>
  );
}

export default withRouter(AddQuestion);
