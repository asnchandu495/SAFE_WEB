import React, { useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link as LinkTo } from "react-router-dom";
import ListofQuestions from "./listofQuestions";
import QuestionType from "./selectQuestionType";
import AddQuestionDetails from "./addQuestionDetails";
import questionaireService from "../../services/questionaireService";
import ComponentLoadderComponent from "../common/loadder/componentloadder";

function AddQuestion(props) {
  const questionaireApiCall = new questionaireService();

  const questionaireId = props.match.params.id;
  const editquestionaireId = props.match.params.qid;
  const [questionTypes, setQuestionTypes] = useState([]);

  const [componentLoadder, setComponentLoadder] = useState(true);
  const [ViewQuestionaireDetails, setViewQuestionaireDetails] = useState([]);
  const [gotoAddQuestion, setGotoAddQuestion] = useState(false);
  const [questionTypeForm, setQuestionTypeForm] = useState({
    questionType: "",
  });

  useEffect(() => {
    if (editquestionaireId == 1) {
      console.log("edit");
      const editbooleanId = props.match.params.id;
      questionaireApiCall
        .GetFreeTextQuestion(editbooleanId)
        .then((booleanres) => {
          console.log("editbyid");
          setQuestionTypeForm(booleanres);
          // setQuestionTypes(booleanres);
          setComponentLoadder(false);
          // setGotoAddQuestion(booleanres);
          console.log("ressss");
          console.log(booleanres);
        })
        .catch((err) => {
          console.log("error");
        });
    } else {
      Promise.all([
        questionaireApiCall.GetALLTypes(),
        questionaireApiCall.getSurveyById(questionaireId),

        // questionaireApiCall.GetFreeTextQuestion();
        //questionaireApiCall.UpdateFreeTextQuestion()
      ])
        .then(([res, questionaireInfo]) => {
          setQuestionTypes(res);
          setComponentLoadder(false);
          setViewQuestionaireDetails(questionaireInfo);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

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
                            // questionTypeForm={ViewQuestionaireDetails.questionType}
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

export default AddQuestion;
