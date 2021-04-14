import React, { useState, useEffect } from "react";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import QuestionTypeBollean from "./flagConcepts/booleanFlag";
import QuestionTypeDate from "./flagConcepts/dateFlag";
import QuestionTypeNumber from "./flagConcepts/numberFlag";
import QuestionTypeTime from "./flagConcepts/timeFlag";
import PropTypes from "prop-types";
import { Link as LinkTo, withRouter } from "react-router-dom";
import questionaireService from "../../services/questionaireService";
import ToasterMessageComponent from "../common/toaster";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import AddChoiceQuestionDetails from "./addChoiceQuestionDetails";

function AddQuestionDetails(props) {
  const questionaireApiCall = new questionaireService();
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [showLoadder, setshowLoadder] = useState(false);
  const [addQuestion, setAddQuestion] = useState({
    id: "",
    surveyId: props.surveyIdURL,
    question: "",
    description: "",
    isMandatory: true,
  });
  const [booleanFlag, setBooleanFlag] = useState({
    negativeResponse: "",
    positiveResponse: "",
    isPositiveConfirmity: true,
    isPositiveConfirmityRedFlag: false,
  });
  const [datetimeFlag, setDatetimeFlag] = useState({
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
  });
  const [timeFlag, setTimeFlag] = useState({
    positiveConformityForTime: [
      {
        id: "",
        expressionType: "",
        forAnswer: moment().toISOString(),
        forRangeEnd: moment().toISOString(),
      },
    ],
    redFlagForTime: [
      {
        id: "",
        expressionType: "",
        forAnswer: moment().toISOString(),
        forRangeEnd: moment().toISOString(),
      },
    ],
    isPositiveConfirmity: true,
    isPositiveConfirmityRedFlag: false,
  });
  const [numericFlag, setNumericFlag] = useState({
    positiveConformityForNumber: [
      {
        id: "",
        numericExpressionType: "",
        forAnswer: 0,
        forRangeEnd: 0,
      },
    ],
    redFlagForNumber: [
      {
        id: "",
        numericExpressionType: "",
        forAnswer: 0,
        forRangeEnd: 0,
      },
    ],
    isPositiveConfirmity: true,
    isPositiveConfirmityRedFlag: false,
  });

  const PurpleSwitch = withStyles({
    switchBase: {
      color: "#be1d56",
      "&$checked": {
        color: "#26235d",
      },
      "&$checked + $track": {
        backgroundColor: "#26235d",
      },
    },
    checked: {},
    track: {},
  })(Switch);

  useEffect(() => {
    if (props.selectedQuestionDetails) {
      setAddQuestion({
        id: props.selectedQuestionDetails.id,
        surveyId: props.selectedQuestionDetails.surveyId,
        question: props.selectedQuestionDetails.question,
        description: props.selectedQuestionDetails.description,
        isMandatory: props.selectedQuestionDetails.isMandatory,
      });

      if (props.selectedQuestionDetails.questionType == "Boolean") {
        setBooleanFlag({
          positiveResponse: props.selectedQuestionDetails.positiveResponse,
          negativeResponse: props.selectedQuestionDetails.negativeResponse,
          isPositiveConformity:
            props.selectedQuestionDetails.isPositiveConformity,
          isPositiveConformityRedFlag:
            props.selectedQuestionDetails.isPositiveConformityRedFlag,
        });
      } else if (props.selectedQuestionDetails.questionType == "Date") {
        setDatetimeFlag({
          positiveConformityForDate:
            props.selectedQuestionDetails.positiveConformityForDate,
          redFlagForDate: props.selectedQuestionDetails.redFlagForDate,
          isPositiveConformity:
            props.selectedQuestionDetails.isPositiveConformity,
          isPositiveConformityRedFlag:
            props.selectedQuestionDetails.isPositiveConformityRedFlag,
        });
      } else if (props.selectedQuestionDetails.questionType == "Time") {
        console.log(props.selectedQuestionDetails);
        setTimeFlag({
          positiveConformityForTime:
            props.selectedQuestionDetails.positiveConformityForTime,
          redFlagForTime: props.selectedQuestionDetails.redFlagForTime,
          isPositiveConformity:
            props.selectedQuestionDetails.isPositiveConformity,
          isPositiveConfirmityRedFlag:
            props.selectedQuestionDetails.isPositiveConfirmityRedFlag,
        });
      } else if (props.selectedQuestionDetails.questionType == "Numeric") {
        setNumericFlag({
          positiveConformityForNumber:
            props.selectedQuestionDetails.positiveConformityForNumber,
          redFlagForNumber: props.selectedQuestionDetails.redFlagForNumber,
          isPositiveConformity:
            props.selectedQuestionDetails.isPositiveConformity,
          isPositiveConformityRedFlag:
            props.selectedQuestionDetails.isPositiveConformityRedFlag,
        });
      } else {
        console.log("not found");
      }
    }
  }, []);

  const handleChange = (e) => {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    setAddQuestion((addQuestion) => ({
      ...addQuestion,
      [name]: value,
    }));
  };

  const handleChangeSwitch = (e) => {
    const { name, value } = e.target;
    setAddQuestion((booleanFlag) => ({
      ...addQuestion,
      [name]: e.target.checked,
    }));
  };

  const navigateToQuestionType = () => {
    setTimeout(() => {
      props.setGotoAddQuestion(false);
    }, 1000);
  };

  function submitQuestionForm(e) {
    e.preventDefault();
    setshowLoadder(true);
    if (props.questionTypeForm.questionType == "FreeText") {
      const finalObject = {
        ...addQuestion,
        ...props.questionTypeForm,
      };
      if (finalObject.id != 0) {
        questionaireApiCall
          .UpdateFreeTextQuestion(finalObject)
          .then((res) => {
            setisAlertBoxOpened(false);
            setStateSnackbar(true);
            setToasterMessage("Question details updated");
            settoasterServerity("success");
            setTimeout(() => {
              props.history.push(
                `/questionaires/view-questions/${props.surveyIdURL}`
              );
              setshowLoadder(false);
            }, 6000);
          })
          .catch((err) => {
            setToasterMessage(err.data.errors);
            settoasterServerity("error");
            setStateSnackbar(true);
            setshowLoadder(false);
          });
      } else {
        questionaireApiCall
          .AddFreeTextQuestion(finalObject)
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
            }, 6000);
          })
          .catch((err) => {
            setToasterMessage(err.data.errors);
            settoasterServerity("error");
            setStateSnackbar(true);
            setshowLoadder(false);
          });
      }
    } else if (props.questionTypeForm.questionType == "Date") {
      const finalObject = {
        ...addQuestion,
        ...props.questionTypeForm,
        ...datetimeFlag,
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
            }, 6000);
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
            }, 6000);
          })
          .catch((err) => {
            setToasterMessage(err.data.errors);
            settoasterServerity("error");
            setStateSnackbar(true);
            setshowLoadder(false);
          });
      }
    } else if (props.questionTypeForm.questionType == "Time") {
      const finalObject = {
        ...addQuestion,
        ...props.questionTypeForm,
        ...timeFlag,
      };
      if (finalObject.id != 0) {
        questionaireApiCall
          .UpdateTimeQuestion(finalObject)
          .then((res) => {
            setisAlertBoxOpened(false);
            setStateSnackbar(true);
            setToasterMessage("Question is updated.");
            settoasterServerity("success");
            setTimeout(() => {
              props.history.push(
                `/questionaires/view-questions/${props.surveyIdURL}`
              );
              setshowLoadder(false);
            }, 6000);
          })
          .catch((err) => {
            setToasterMessage(err.data.errors);
            settoasterServerity("error");
            setStateSnackbar(true);
            setshowLoadder(false);
          });
      } else {
        questionaireApiCall
          .AddTimeQuestion(finalObject)
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
            }, 6000);
          })
          .catch((err) => {
            setToasterMessage(err.data.errors);
            settoasterServerity("error");
            setStateSnackbar(true);
            setshowLoadder(false);
          });
      }
    } else if (props.questionTypeForm.questionType == "Numeric") {
      const finalObject = {
        ...addQuestion,
        ...props.questionTypeForm,
        ...numericFlag,
      };
      if (finalObject.id != 0) {
        questionaireApiCall
          .UpdateNumericQuestion(finalObject)
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
            }, 6000);
          })
          .catch((err) => {
            setToasterMessage(err.data.errors);
            settoasterServerity("error");
            setStateSnackbar(true);
            setshowLoadder(false);
          });
      } else {
        questionaireApiCall
          .AddNumericQuestion(finalObject)
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
            }, 6000);
          })
          .catch((err) => {
            setToasterMessage(err.data.errors);
            settoasterServerity("error");
            setStateSnackbar(true);
            setshowLoadder(false);
          });
      }
    } else {
      if (props.questionTypeForm.questionType == "Boolean") {
        const finalObject = {
          ...addQuestion,
          ...props.questionTypeForm,
          ...booleanFlag,
        };
        if (finalObject.id != 0) {
          questionaireApiCall
            .UpdateBoolenQuestion(finalObject)
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
              }, 6000);
            })
            .catch((err) => {
              setToasterMessage(err.data.errors);
              settoasterServerity("error");
              setStateSnackbar(true);
              setshowLoadder(false);
            });
        } else {
          questionaireApiCall
            .AddBoolenQuestion(finalObject)
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
              }, 6000);
            })
            .catch((err) => {
              setToasterMessage(err.data.errors);
              settoasterServerity("error");
              setStateSnackbar(true);
              setshowLoadder(false);
            });
        }
      } else {
        console.log("fdsf");
      }
    }
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
      case "Date":
        return (
          <Grid item xs={12} sm={12} className="question-flags">
            <QuestionTypeDate
              questionTypeForm={props.questionTypeForm}
              setAddQuestion={setAddQuestion}
              addQuestion={addQuestion}
              setDatetimeFlag={setDatetimeFlag}
              datetimeFlag={datetimeFlag}
              answerTypes={props.answerTypes}
              loadGlobalSettingsData={props.loadGlobalSettingsData}
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
              answerTypes={props.answerTypes}
              loadGlobalSettingsData={props.loadGlobalSettingsData}
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
              answerTypes={props.answerTypes}
            ></QuestionTypeNumber>
          </Grid>
        );
      default:
        return <h4>Not found</h4>;
    }
  }

  return (
    <>
      {props.questionTypeForm.questionType == "SingleChoice" ||
      props.questionTypeForm.questionType == "MultiChoice" ? (
        <AddChoiceQuestionDetails
          questionTypeForm={props.questionTypeForm}
          surveyIdURL={props.surveyIdURL}
          questionIdURL={props.questionIdURL}
          setGotoAddQuestion={props.setGotoAddQuestion}
          answerTypes={props.answerTypes}
        ></AddChoiceQuestionDetails>
      ) : (
        <ValidatorForm onSubmit={submitQuestionForm}>
          <Card className="question-card">
            <CardContent className="scrollable-card">
              <Typography gutterBottom variant="h6" component="h6">
                Question details
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
                        validators={[
                          "required",
                          // "matchRegexp:^[a-zA-Z ]*$",
                          "matchRegexp:^.{0,200}$",
                        ]}
                        errorMessages={[
                          "Please enter question",
                          // "Only alphabets are allowed",
                          "Maximum 200 characters",
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
                        value={addQuestion.description}
                        onChange={handleChange}
                        className="global-input global-input-multiline"
                        InputLabelProps={{ shrink: false }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item container xs={12}>
                    <Grid item xs={2}>
                      <label>Is mandatory?</label>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <PurpleSwitch
                            checked={addQuestion.isMandatory}
                            name="isMandatory"
                            onChange={handleChangeSwitch}
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <RenderFlagComponent
                  currentQuestionType={props.questionTypeForm.questionType}
                  answerTypes={props.answerTypes}
                  loadGlobalSettingsData={props.loadGlobalSettingsData}
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
      )}
      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />{" "}
    </>
  );
}

export default withRouter(AddQuestionDetails);
