import React, { useState, useEffect } from "react";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import PropTypes from "prop-types";
import { Link as LinkTo, withRouter } from "react-router-dom";
import ToasterMessageComponent from "../../common/toaster";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import ComponentLoadderComponent from "../../common/loadder/componentloadder";
import questionaireService from "../../../services/questionaireService";
import TooltipComponent from "../../common/tooltip";
import SurveyQuestionUpdate from "../../common/surveyQuestionUpdateConfirmation";

function BooleanQuestion(props) {
  const questionaireApiCall = new questionaireService();

  const surveyIdURL = props.match.params.id;
  const questionIdURL = props.match.params.qid;

  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [addQuestionData, setAddQuestionData] = useState({
    id: "",
    surveyId: surveyIdURL,
    description: "",
    questionType: "",
    question: "",
    negativeResponse: "",
    positiveResponse: "",
    isPositiveConformity: true,
    isPositiveConformityRedFlag: false,
    isMandatory: false,
  });
  const [answersToSelect, setAnswersToSelect] = useState([
    { id: "TRUE", name: "TRUE" },
    { id: "FALSE", name: "FALSE" },
  ]);
  const [questionData, setQuestionData] = useState();
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState(
    "Editing of this yes/no question might have impact on conditional jump (if there) , order of execution and questionnaire evaluation, please revisit these areas"
  );

  const PurpleSwitch = withStyles({
    switchBase: {
      color: "red",
      "&$checked": {
        color: "green",
      },
      "&$checked + $track": {
        backgroundColor: "green",
      },
    },
    checked: {},
    track: {},
  })(Switch);

  useEffect(() => {
    if (questionIdURL != 0) {
      let getData = props.selectedQuestionDetails;
      setAddQuestionData(getData);
    }
  }, []);
  /**
   * Handle Change
   * Data binding of the form fields
  
   * @param  {} e
   */
  const handleChange = (e) => {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    setAddQuestionData((addQuestionData) => ({
      ...addQuestionData,
      [name]: value,
    }));
  };
  /**
   * Handle Change switch
   * Data binding of the form fields
   * To decide whether to keep feild as mandatory or not
   * @param  {} e
   */
  const handleChangeSwitch = (e) => {
    const { name, value } = e.target;
    setAddQuestionData((addQuestionData) => ({
      ...addQuestionData,
      [name]: e.target.checked,
    }));
  };
  /**
   * Method on click of cancel to redirect to view questionnaire component
   */
  const navigateToQuestionType = () => {
    setTimeout(() => {
      // props.setGotoAddQuestion(false);
      props.history.push(`/questionaires/view-questions/${props.surveyIdURL}`);
    }, 1000);
  };
  /**
   * Method on click of submit to set the state and call the api
   */
  function submitQuestionForm(e) {
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    setshowLoadder(true);
    const finalObject = {
      ...props.questionTypeForm,
      ...addQuestionData,
    };
    if (finalObject.id != 0) {
      if (
        !props.surveyDetails.isSaveasDraft &&
        !props.surveyDetails.isAssignedToUserGroupisAssignedToUserGroup
      ) {
        setOpenConfirmationModal(true);
        setQuestionData(finalObject);
      } else {
        questionaireApiCall
          .UpdateBoolenQuestion(finalObject)
          .then((res) => {
            setisAlertBoxOpened(false);
            setStateSnackbar(true);
            setToasterMessage("Question Details Updated.");
            settoasterServerity("success");
            setTimeout(() => {
              props.history.push(
                `/questionaires/view-questions/${props.surveyIdURL}`
              );
              setshowLoadder(false);
            }, 10000);
          })
          .catch((err) => {
            setToasterMessage(err.data.errors);
            settoasterServerity("error");
            setStateSnackbar(true);
            setshowLoadder(false);
          });
      }
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
          }, 10000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    }
  }

  return (
    <>
      <ValidatorForm onSubmit={submitQuestionForm}>
        <Card className="question-card">
          <CardContent className="scrollable-card">
            <Typography gutterBottom variant="h6" component="h6">
              Question Details
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
                      validators={["required", "matchRegexp:^.{0,200}$"]}
                      errorMessages={[
                        "Please enter question",
                        "Maximum 200 characters",
                      ]}
                      fullWidth
                      id="question"
                      placeholder="Enter Question"
                      name="question"
                      value={addQuestionData.question}
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
                      value={addQuestionData.description}
                      onChange={handleChange}
                      className="global-input global-input-multiline"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                </Grid>
                <Grid item container xs={12}>
                  <Grid item xs={2}>
                    <label>Is Mandatory?</label>
                    <TooltipComponent
                      isMarginBottom={true}
                      tooltipMessage={`Questions for which "Is Mandatory" is ON is mandatory to be answered. Questions for which "Is Mandatory" is OFF can be skipped.`}
                    ></TooltipComponent>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <PurpleSwitch
                          checked={addQuestionData.isMandatory}
                          name="isMandatory"
                          onChange={handleChangeSwitch}
                        />
                      }
                      label={addQuestionData.isMandatory ? "Yes" : "No"}
                    />
                  </Grid>
                </Grid>
                <Grid item container xs={12}>
                  <Grid item xs={2}>
                    <label className="required">Red Flag</label>
                    <TooltipComponent
                      isMarginBottom={true}
                      tooltipMessage={`If user's reponse to the question matches the "Red Flag" answer, logic defined to determine COVID state for  red flag answers will override the logic defined to determine COVID state using positive conformity score`}
                    ></TooltipComponent>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <PurpleSwitch
                          checked={addQuestionData.isPositiveConformityRedFlag}
                          name="isPositiveConformityRedFlag"
                          onChange={handleChangeSwitch}
                        />
                      }
                      label={
                        addQuestionData.isPositiveConformityRedFlag
                          ? "Yes"
                          : "No"
                      }
                    />
                  </Grid>
                </Grid>
                {addQuestionData.isPositiveConformityRedFlag ? (
                  <Grid
                    item
                    container
                    xs={12}
                    className="flag-card flag-card-dynamic"
                  >
                    <Grid item xs={2}>
                      <label
                        className={
                          addQuestionData.isPositiveConformityRedFlag
                            ? "required"
                            : ""
                        }
                      >
                        {" "}
                        Red Flag Answer
                      </label>
                    </Grid>
                    <Grid item xs={5}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel
                          id="demo-simple-select-outlined-label"
                          shrink={true}
                          className="select-label"
                        >
                          {addQuestionData.positiveResponse != ""
                            ? ""
                            : "Red Flag Answer"}
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={addQuestionData.positiveResponse}
                          name="positiveResponse"
                          onChange={handleChange}
                          placeholder="Answer"
                          InputLabelProps={{
                            shrink: false,
                          }}
                          className="global-input single-select"
                          required={addQuestionData.isPositiveConformityRedFlag}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {answersToSelect.map((ans) => {
                            return (
                              <MenuItem
                                value={ans.id}
                                key={`atypered_${ans.id}`}
                              >
                                {ans.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )}
                <Grid
                  item
                  container
                  xs={12}
                  className="flag-card flag-card-dynamic"
                >
                  <Grid item xs={2}>
                    <label className="required">Positive Conformity</label>
                    <TooltipComponent
                      isMarginBottom={true}
                      tooltipMessage={` If user's response to question matches "Positive Comformity" answer, the score defined for "POsitive Comformity answers" will be added to user's evaluation result. In absence of "Red Flag" answers , user's "Total Positive Comformity Score" will be used to determine COVID state of user.
                      `}
                    ></TooltipComponent>
                  </Grid>
                  <Grid item xs={5}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        id="demo-simple-select-outlined-label"
                        shrink={false}
                        className="select-label"
                      >
                        {addQuestionData.negativeResponse != ""
                          ? ""
                          : "Positive Conformity Answer"}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={addQuestionData.negativeResponse}
                        name="negativeResponse"
                        onChange={handleChange}
                        placeholder="Answer"
                        InputLabelProps={{
                          shrink: false,
                        }}
                        className="global-input single-select"
                        required
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {answersToSelect.map((ans) => {
                          return (
                            <MenuItem
                              value={ans.id}
                              key={`atypepositive_${ans.id}`}
                            >
                              {ans.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
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
              Cancel
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
      />
      <SurveyQuestionUpdate
        openConfirmationModal={openConfirmationModal}
        setOpenConfirmationModal={setOpenConfirmationModal}
        setStateSnackbar={setStateSnackbar}
        setToasterMessage={setToasterMessage}
        settoasterServerity={settoasterServerity}
        questionData={questionData}
        warningMessage={warningMessage}
        setshowLoadder={setshowLoadder}
        surveyIdURL={props.surveyIdURL}
        setisAlertBoxOpened={setisAlertBoxOpened}
        sendQuestionType="Boolean"
      ></SurveyQuestionUpdate>
    </>
  );
}

export default withRouter(BooleanQuestion);
