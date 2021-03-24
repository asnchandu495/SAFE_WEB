import React, { useState, useEffect } from "react";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import CheckIcon from "@material-ui/icons/Check";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import QuestionTypeBollean from "./flagConcepts/booleanFlag";
import QuestionTypeDate from "./flagConcepts/dateFlag";
import QuestionTypeMultiSelect from "./flagConcepts/multiSelectFlag";
import QuestionTypeNumber from "./flagConcepts/numberFlag";
import QuestionTypeSingleSelect from "./flagConcepts/singleSelectFlag";
import QuestionTypeTime from "./flagConcepts/timeFlag";

function AddQuestionDetails(props) {
  const [showLoadder, setshowLoadder] = useState(false);
  const [addQuestion, setAddQuestion] = useState({
    surveyId: "",
    question: "",
    description: "",
    isMandatory: false,
    surveyResponseChoices: "",
  });
  const [booleanFlag, setBooleanFlag] = useState({
    positiveRedFlagResponse: "",
    redFlagResponse: "",
    isPositiveConfirmity: true,
    isPositiveConfirmityRedFlag: false,
  });
  const [datetimeFlag, setDatetimeFlag] = useState({
    positiveConformityForDate: {
      expressionType: "",
      forAnswer: "",
      forRangeEnd: "",
    },
    redFlagForDate: {
      expressionType: "",
      forAnswer: "",
      forRangeEnd: "",
    },
    isPositiveConfirmity: true,
    isPositiveConfirmityRedFlag: false,
  });
  const [timeFlag, setTimeFlag] = useState({
    positiveConformityForTime: {
      expressionType: "",
      forAnswer: "",
      forRangeEnd: "",
    },
    redFlagForTime: {
      expressionType: "",
      forAnswer: "",
      forRangeEnd: "",
    },
    isPositiveConfirmity: true,
    isPositiveConfirmityRedFlag: false,
  });
  const [numericFlag, setNumericFlag] = useState({
    positiveConformityForNumber: {
      expressionType: "",
      forAnswer: "",
      forRangeEnd: "",
    },
    redFlagForNumber: {
      expressionType: "",
      forAnswer: "",
      forRangeEnd: "",
    },
    isPositiveConfirmity: true,
    isPositiveConfirmityRedFlag: false,
  });
  const [singleChoiceFlag, setSingleChoiceFlag] = useState({
    questionId: "",
    isPositiveConfirmity: true,
    isPositiveConfirmityRedFlag: true,
    positiveConformitySingleChoice: [],
    redFlagForSingleChoice: [],
  });
  const [surveyChoices, setSurveyChoices] = useState([]);

  useEffect(() => {}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddQuestion((addQuestion) => ({
      ...addQuestion,
      [name]: value,
    }));
  };

  const navigateToQuestionType = () => {
    setTimeout(() => {
      props.setGotoAddQuestion(false);
    }, 1000);
  };

  function submitQuestionForm(e) {
    e.preventDefault();
    console.log(addQuestion);
  }

  function saveChoices() {
    console.log(addQuestion.surveyResponseChoices);
    let array = addQuestion.surveyResponseChoices.split(",");
    setSurveyChoices(array);
  }

  function RenderFlagComponent(props) {
    switch (props.currentQuestionType) {
      case "Boolean":
        return (
          <Grid item xs={12} sm={12} className="question-flags">
            <QuestionTypeBollean
              questionTypeForm={props.questionTypeForm}
              setAddQuestion={setAddQuestion}
              addQuestion={addQuestion}
              setBooleanFlag={setBooleanFlag}
              booleanFlag={booleanFlag}
            ></QuestionTypeBollean>
          </Grid>
        );
      case "FreeText":
        return <></>;
      case "DateTime":
        return (
          <Grid item xs={12} sm={12} className="question-flags">
            <QuestionTypeDate
              questionTypeForm={props.questionTypeForm}
              setAddQuestion={setAddQuestion}
              addQuestion={addQuestion}
              setDatetimeFlag={setDatetimeFlag}
              datetimeFlag={datetimeFlag}
            ></QuestionTypeDate>
          </Grid>
        );
      case "Time":
        return (
          <Grid item xs={12} sm={12} className="question-flags">
            <QuestionTypeTime
              questionTypeForm={props.questionTypeForm}
              setAddQuestion={setAddQuestion}
              addQuestion={addQuestion}
              setTimeFlag={setTimeFlag}
              timeFlag={timeFlag}
            ></QuestionTypeTime>
          </Grid>
        );
      case "Numeric":
        return (
          <Grid item xs={12} sm={12} className="question-flags">
            <QuestionTypeNumber
              questionTypeForm={props.questionTypeForm}
              setAddQuestion={setAddQuestion}
              addQuestion={addQuestion}
              setNumericFlag={setNumericFlag}
              numericFlag={numericFlag}
            ></QuestionTypeNumber>
          </Grid>
        );
      case "SingleChoice":
        return (
          <Grid item xs={12} sm={12} className="question-flags">
            <QuestionTypeSingleSelect
              questionTypeForm={props.questionTypeForm}
              setAddQuestion={setAddQuestion}
              addQuestion={addQuestion}
              setSingleChoiceFlag={setSingleChoiceFlag}
              singleChoiceFlag={singleChoiceFlag}
              surveyChoices={surveyChoices}
            ></QuestionTypeSingleSelect>
          </Grid>
        );
      case "MultiChoice":
        return (
          <Grid item xs={12} sm={12} className="question-flags">
            <QuestionTypeMultiSelect
              questionTypeForm={props.questionTypeForm}
              setAddQuestion={setAddQuestion}
              addQuestion={addQuestion}
              setSingleChoiceFlag={setSingleChoiceFlag}
              singleChoiceFlag={singleChoiceFlag}
              surveyChoices={surveyChoices}
            ></QuestionTypeMultiSelect>
          </Grid>
        );
      default:
        return <h4>Not found</h4>;
    }
  }

  return (
    <ValidatorForm onSubmit={submitQuestionForm}>
      <Card className="question-card">
        <CardContent className="scrollable-card">
          <Typography gutterBottom variant="h6" component="h6">
            Question details
          </Typography>
          <Grid item xs={12} sm={12}>
            <Grid spacing={3} container className="question-details">
              <Grid item container sm={12}>
                <Grid item sm={3}>
                  <label className="required">Question</label>
                </Grid>
                <Grid item sm={6}>
                  <TextValidator
                    variant="outlined"
                    validators={[
                      "required",
                      "matchRegexp:^[a-zA-Z ]*$",
                      "matchRegexp:^.{0,50}$",
                    ]}
                    errorMessages={[
                      "Please enter question",
                      "Only alphabets are allowed",
                      "Maximum 50 characters",
                    ]}
                    fullWidth
                    id="question"
                    placeholder="Enter Question"
                    name="question"
                    value={addQuestion.question}
                    onChange={handleChange}
                    autoFocus
                    className="global-input"
                    InputLabelProps={{ shrink: false }}
                  />
                </Grid>
              </Grid>
              <Grid item sm={12} container>
                <Grid item sm={3}>
                  <label>Description</label>
                </Grid>
                <Grid item sm={6}>
                  <TextValidator
                    variant="outlined"
                    fullWidth
                    id="description"
                    placeholder="Enter Description"
                    validators={["matchRegexp:^.{0,150}$"]}
                    errorMessages={["Maximum 150 characters"]}
                    name="description"
                    multiline
                    rows={2}
                    value={addQuestion.description}
                    onChange={handleChange}
                    className="global-input global-input-multiline"
                    InputLabelProps={{ shrink: false }}
                  />
                </Grid>
              </Grid>
              {props.questionTypeForm.questionType == "SingleChoice" ||
              props.questionTypeForm.questionType == "MultiChoice" ? (
                <Grid item sm={12} container>
                  <Grid item sm={3}>
                    <label>Answers</label>
                  </Grid>
                  <Grid item sm={8}>
                    <Grid item sm={12} container>
                      <Grid item sm={10}>
                        <TextValidator
                          variant="outlined"
                          fullWidth
                          id="surveyResponseChoices"
                          placeholder="Your answers. Comma separated"
                          name="surveyResponseChoices"
                          value={addQuestion.surveyResponseChoices}
                          onChange={handleChange}
                          className="global-input"
                          InputLabelProps={{ shrink: false }}
                        />
                      </Grid>
                      <Grid item sm={2}>
                        <Tooltip title="Save">
                          <Button
                            variant="contained"
                            color="default"
                            startIcon={<CheckIcon />}
                            className={`square-icon-save`}
                            onClick={saveChoices}
                          ></Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
            <RenderFlagComponent
              currentQuestionType={props.questionTypeForm.questionType}
            ></RenderFlagComponent>
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
      </Card>
    </ValidatorForm>
  );
}

export default AddQuestionDetails;
