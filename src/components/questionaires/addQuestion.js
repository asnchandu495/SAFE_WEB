import React, { useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link as LinkTo } from "react-router-dom";
import { ValidatorForm } from "react-material-ui-form-validator";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import ListofQuestions from "./listofQuestions";
import QuestionType from "./selectQuestionType";
import AddQuestionDetails from "./addQuestionDetails";

function AddQuestion(props) {
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
  const [gotoAddQuestion, setGotoAddQuestion] = useState(false);
  const [questionTypeForm, setQuestionTypeForm] = useState({
    questionType: "",
  });

  const [addQuestion, setAddQuestion] = useState({
    id: "",
    questionName: "",
    questionDescription: "",
    questionOptions: "",
    isRedFlagEnaled: false,
    redFlagAnswerType: "",
    positiveFlagAnswerType: "",
  });

  useEffect(() => {}, []);

  const navigateToQuestionType = () => {
    setTimeout(() => {
      setGotoAddQuestion(false);
    }, 2000);
  };

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
          Add questions
        </LinkTo>
      </Breadcrumbs>
      <Paper className="main-paper main-paper-add-question">
        <Grid container spacing={0}>
          <Grid item xs={12} sm={3}>
            <Paper className="list-questions">
              <ListofQuestions></ListofQuestions>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Paper className="add-new-question">
              <ValidatorForm className={`global-form`}>
                <Grid container spacing={0}>
                  {!gotoAddQuestion ? (
                    <Grid item xs={12} sm={12} className="center-align">
                      <QuestionType
                        questionTypes={questionTypes}
                        gotoAddQuestion={gotoAddQuestion}
                        setGotoAddQuestion={setGotoAddQuestion}
                        addQuestion={addQuestion}
                        setAddQuestion={setAddQuestion}
                        setQuestionTypeForm={setQuestionTypeForm}
                        questionTypeForm={questionTypeForm}
                      ></QuestionType>
                    </Grid>
                  ) : (
                    <Grid item xs={12} sm={12} className="center-align">
                      <Grid item xs={11} sm={11}>
                        <Card className="question-card">
                          <AddQuestionDetails
                            gotoAddQuestion={gotoAddQuestion}
                            setGotoAddQuestion={setGotoAddQuestion}
                            addQuestion={addQuestion}
                            setAddQuestion={setAddQuestion}
                            answerTypes={answerTypes}
                            setAnswerTypes={setAnswerTypes}
                            setQuestionTypeForm={setQuestionTypeForm}
                            questionTypeForm={questionTypeForm}
                          ></AddQuestionDetails>
                          <CardActions className="action-container">
                            <Button
                              size="small"
                              color="primary"
                              type="button"
                              onClick={navigateToQuestionType}
                            >
                              Back
                            </Button>
                            <Button size="small" color="primary">
                              Save
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </ValidatorForm>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default AddQuestion;
