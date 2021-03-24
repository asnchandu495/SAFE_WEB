import React, { useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link as LinkTo } from "react-router-dom";
import ListofQuestions from "./listofQuestions";
import QuestionType from "./selectQuestionType";
import AddQuestionDetails from "./addQuestionDetails";
import questionaireService from "../../services/questionaireService";

function AddQuestion(props) {
  const questionaireApiCall = new questionaireService();
  const [questionTypes, setQuestionTypes] = useState([
    // {
    //   inputType: "Boolean",
    // },
    // {
    //   inputType: "DateTime",
    // },
    // {
    //   inputType: "FreeText",
    // },
    // {
    //   inputType: "MultiChoice",
    // },
    // {
    //   inputType: "Numeric",
    // },
    // {
    //   inputType: "SingleChoice",
    // },
    // {
    //   inputType: "Time",
    // },
  ]);
  const [gotoAddQuestion, setGotoAddQuestion] = useState(false);
  const [questionTypeForm, setQuestionTypeForm] = useState({
    questionType: "",
  });

  useEffect(() => {
    questionaireApiCall
      .GetALLTypes()
      .then((res) => {
        setQuestionTypes(res);
        console.log(res);
      })
      .catch((res) => {
        console.log(res);
      });
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
          href="#"
          to={`questionaires/allquestionaires`}
          className="inactive"
        >
          Questionaires
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="inactive">
          Selected questionaire name
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Add question
        </LinkTo>
      </Breadcrumbs>
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
    </div>
  );
}

export default AddQuestion;
