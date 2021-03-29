import React, { useState, useEffect } from "react";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import QuestionTypeMultiSelect from "./flagConcepts/multiSelectFlag";
import QuestionTypeSingleSelect from "./flagConcepts/singleSelectFlag";
import questionaireService from "../../services/questionaireService";
import ToasterMessageComponent from "../common/toaster";

function AddChoiceQuestionDetails(props) {
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
  const [addQuestionWithChoices, setAddQuestionWithChoices] = useState({
    id: "",
    surveyId: props.surveyIdURL,
    question: "",
    description: "",
    isMandatory: true,
    surveyResponseChoices: [
      {
        option: "",
      },
    ],
  });
  const [singleChoiceFlag, setSingleChoiceFlag] = useState({
    questionId: "",
    isPositiveConfirmity: true,
    isPositiveConfirmityRedFlag: true,
    positiveConformitySingleChoice: [],
    redFlagForSingleChoice: [],
  });

  useEffect(() => {}, []);

  const handleChange = (e) => {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    setAddQuestionWithChoices((addQuestionWithChoices) => ({
      ...addQuestionWithChoices,
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
    setshowLoadder(true);
    if (props.questionTypeForm.questionType == "SingleChoice") {
      const finalObject = {
        ...addQuestionWithChoices,
        ...props.questionTypeForm,
      };
      questionaireApiCall
        .AddSingleChoiceQuestion(finalObject)
        .then((res) => {
          setshowLoadder(false);
          setisAlertBoxOpened(false);
          setStateSnackbar(true);
          setToasterMessage("Added new question.");
          settoasterServerity("success");
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else if (props.questionTypeForm.questionType == "MultiChoice") {
      const finalObject = {
        ...addQuestionWithChoices,
        ...props.questionTypeForm,
      };
      questionaireApiCall
        .AddMultiChoiceQuestion(finalObject)
        .then((res) => {
          setshowLoadder(false);
          setisAlertBoxOpened(false);
          setStateSnackbar(true);
          setToasterMessage("Added new question.");
          settoasterServerity("success");
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      console.log("fdsf");
    }
  }

  function RenderFlagComponent(props) {
    switch (props.currentQuestionType) {
      case "SingleChoice":
        return (
          <Grid item xs={12} sm={12} className="question-flags">
            <QuestionTypeSingleSelect
              questionTypeForm={props.questionTypeForm}
              setAddQuestionWithChoices={setAddQuestionWithChoices}
              addQuestionWithChoices={addQuestionWithChoices}
              setSingleChoiceFlag={setSingleChoiceFlag}
              singleChoiceFlag={singleChoiceFlag}
            ></QuestionTypeSingleSelect>
          </Grid>
        );
      case "MultiChoice":
        return (
          <Grid item xs={12} sm={12} className="question-flags">
            <QuestionTypeMultiSelect
              questionTypeForm={props.questionTypeForm}
              setAddQuestionWithChoices={setAddQuestionWithChoices}
              addQuestionWithChoices={addQuestionWithChoices}
              setSingleChoiceFlag={setSingleChoiceFlag}
              singleChoiceFlag={singleChoiceFlag}
            ></QuestionTypeMultiSelect>
          </Grid>
        );
      default:
        return <h4>Not found</h4>;
    }
  }

  const handleInputChangeChoices = (e, index) => {
    const { name, value } = e.target;
    const list = {
      ...addQuestionWithChoices,
      surveyResponseChoices: [
        ...addQuestionWithChoices.surveyResponseChoices.map((con, conIndex) =>
          conIndex == index ? { ...con, [name]: value } : con
        ),
      ],
    };
    setAddQuestionWithChoices(list);
  };

  const handleRemoveClickChoices = (j) => {
    const list = { ...addQuestionWithChoices };
    list.surveyResponseChoices.splice(j, 1);
    setAddQuestionWithChoices(list);
  };

  const handleAddClickChoices = (index, j) => {
    const list = { ...addQuestionWithChoices };
    const thisChoices = list.surveyResponseChoices;
    list.surveyResponseChoices = [
      ...thisChoices,
      {
        option: "",
      },
    ];
    setAddQuestionWithChoices(list);
  };

  return (
    <>
      <ValidatorForm onSubmit={submitQuestionForm}>
        <Card className="question-card">
          <CardContent className="scrollable-card scrollable-card-choices">
            <Typography gutterBottom variant="h6" component="h6">
              Question details
            </Typography>
            <Grid item xs={12} sm={12}>
              <Grid spacing={3} container className="question-details">
                <Grid item container sm={12}>
                  <Grid item sm={2}>
                    <label className="required">Question</label>
                  </Grid>
                  <Grid item sm={10}>
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
                      value={addQuestionWithChoices.question}
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
                  <Grid item sm={10}>
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
                      value={addQuestionWithChoices.description}
                      onChange={handleChange}
                      className="global-input global-input-multiline"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                </Grid>
                <Grid item container sm={12} className="flag-card-dynamic">
                  <Grid item sm={2}>
                    <label className="required">Answers</label>
                  </Grid>
                  <Grid item sm={10}>
                    {addQuestionWithChoices.surveyResponseChoices &&
                    addQuestionWithChoices.surveyResponseChoices.length > 0
                      ? addQuestionWithChoices.surveyResponseChoices.map(
                          (x, i) => {
                            return (
                              <Grid
                                container
                                spacing={1}
                                item
                                xs={12}
                                className="dynamic-rows-bottom"
                                key={`choice-container${i}`}
                              >
                                <Grid item xs={6}>
                                  <TextValidator
                                    variant="outlined"
                                    validators={["required"]}
                                    errorMessages={["Please enter answer"]}
                                    fullWidth
                                    id={`option${i}`}
                                    placeholder="Enter answer"
                                    name="option"
                                    value={x.option}
                                    onChange={(e) =>
                                      handleInputChangeChoices(e, i)
                                    }
                                    className="global-input"
                                    InputLabelProps={{ shrink: false }}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  className="row-icons-container"
                                >
                                  {addQuestionWithChoices.surveyResponseChoices
                                    .length !== 1 && (
                                    <Tooltip title="Remove">
                                      <CancelIcon
                                        className={`delete-row-icon`}
                                        onClick={() =>
                                          handleRemoveClickChoices(i)
                                        }
                                      ></CancelIcon>
                                    </Tooltip>
                                  )}
                                  {addQuestionWithChoices.surveyResponseChoices
                                    .length -
                                    1 ===
                                    i && (
                                    <Tooltip title="Add">
                                      <AddCircleIcon
                                        className={`add-row-icon`}
                                        onClick={handleAddClickChoices}
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
              </Grid>
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
      <ValidatorForm onSubmit={submitQuestionForm}>
        <Card className="question-card">
          <CardContent className="scrollable-card scrollable-card-choices">
            <Typography gutterBottom variant="h6" component="h6">
              Question details
            </Typography>
            <Grid item xs={12} sm={12}>
              <Grid spacing={3} container className="question-details">
                <Grid item container sm={12}>
                  <Grid item sm={2}>
                    <label className="required">Question</label>
                  </Grid>
                  <Grid item sm={10}>
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
                      value={addQuestionWithChoices.question}
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
                  <Grid item sm={10}>
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
                      value={addQuestionWithChoices.description}
                      onChange={handleChange}
                      className="global-input global-input-multiline"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                </Grid>
                <Grid item container sm={12} className="flag-card-dynamic">
                  <Grid item sm={2}>
                    <label className="required">Answers</label>
                  </Grid>
                  <Grid item sm={10}>
                    {addQuestionWithChoices.surveyResponseChoices &&
                    addQuestionWithChoices.surveyResponseChoices.length > 0
                      ? addQuestionWithChoices.surveyResponseChoices.map(
                          (x, i) => {
                            return (
                              <Grid
                                container
                                spacing={1}
                                item
                                xs={12}
                                className="dynamic-rows-bottom"
                                key={`choice-container${i}`}
                              >
                                <Grid item xs={6}>
                                  <TextValidator
                                    variant="outlined"
                                    validators={["required"]}
                                    errorMessages={["Please enter answer"]}
                                    fullWidth
                                    id={`option${i}`}
                                    placeholder="Enter answer"
                                    name="option"
                                    value={x.option}
                                    onChange={(e) =>
                                      handleInputChangeChoices(e, i)
                                    }
                                    className="global-input"
                                    InputLabelProps={{ shrink: false }}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  className="row-icons-container"
                                >
                                  {addQuestionWithChoices.surveyResponseChoices
                                    .length !== 1 && (
                                    <Tooltip title="Remove">
                                      <CancelIcon
                                        className={`delete-row-icon`}
                                        onClick={() =>
                                          handleRemoveClickChoices(i)
                                        }
                                      ></CancelIcon>
                                    </Tooltip>
                                  )}
                                  {addQuestionWithChoices.surveyResponseChoices
                                    .length -
                                    1 ===
                                    i && (
                                    <Tooltip title="Add">
                                      <AddCircleIcon
                                        className={`add-row-icon`}
                                        onClick={handleAddClickChoices}
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
              </Grid>
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

export default AddChoiceQuestionDetails;