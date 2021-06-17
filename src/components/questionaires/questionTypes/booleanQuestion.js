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

  const handleChange = (e) => {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    setAddQuestionData((addQuestionData) => ({
      ...addQuestionData,
      [name]: value,
    }));
  };

  const handleChangeSwitch = (e) => {
    const { name, value } = e.target;
    setAddQuestionData((addQuestionData) => ({
      ...addQuestionData,
      [name]: e.target.checked,
    }));
  };

  const navigateToQuestionType = () => {
    setTimeout(() => {
      // props.setGotoAddQuestion(false);
      props.history.push(`/questionaires/view-questions/${props.surveyIdURL}`);
    }, 1000);
  };

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
          }, 10000);
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
                        Red Flag Answer
                      </label>
                    </Grid>
                    <Grid item xs={5}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel
                          id="demo-simple-select-outlined-label"
                          shrink={false}
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
    </>
  );
}

export default withRouter(BooleanQuestion);
