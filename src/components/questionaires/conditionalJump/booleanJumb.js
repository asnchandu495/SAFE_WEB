import React, { useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Grid from "@material-ui/core/Grid";
import { Link as LinkTo, withRouter } from "react-router-dom";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import questionaireService from "../../../services/questionaireService";
import ToasterMessageComponent from "../../common/toaster";
import ComponentLoadderComponent from "../../common/loadder/componentloadder";

function BooleanJump(props) {
  const surveyId = props.match.params.id;
  const questionId = props.match.params.qid;
  const questionaireApiCall = new questionaireService();

  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [showLoadder, setshowLoadder] = useState(false);
  const [conditionalJump, setConditionalJump] = useState({
    id: "",
    surveyQuestionId: questionId,
    positiveResponseQuestionId: "",
    negativeResponseQuestionId: "",
  });
  const [surveyDetails, setsurveyDetails] = useState();
  const [selectedQuestionDetails, setselectedQuestionDetails] = useState();
  const [selectedSurveyQuestions, setSelectedSurveyQuestions] = useState([]);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [reloadPage, setReloadPage] = useState("false");

  useEffect(() => {
    Promise.all([
      questionaireApiCall.GetAllQuestionsBySurveyId(surveyId),
      questionaireApiCall.GetBooleanQuestionById(questionId),
      questionaireApiCall.getSurveyById(surveyId),
      questionaireApiCall.GetBooleanConditionQuestionById(questionId),
    ])
      .then(
        ([
          res,
          getBooleanDetails,
          getsurveyDetails,
          getBooleanConditionDetails,
        ]) => {
          let filteredQuestions = res.filter((r) => {
            return r.id != questionId;
          });
          setSelectedSurveyQuestions(filteredQuestions);
          setselectedQuestionDetails(getBooleanDetails);
          setsurveyDetails(getsurveyDetails);
          if (getBooleanConditionDetails) {
            setConditionalJump(getBooleanConditionDetails);
          }
          setReloadPage("false");
          setcomponentLoadder(false);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  }, [reloadPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConditionalJump((conditionalJump) => ({
      ...conditionalJump,
      [name]: value,
    }));
  };

  function submitForm(e) {
    e.preventDefault();
    setshowLoadder(true);
    if (conditionalJump.id != "") {
      questionaireApiCall
        .updateBooleanConditionalJump(conditionalJump)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Conditional jump is updated.");
          settoasterServerity("success");
          setTimeout(function () {
            setshowLoadder(false);
            setReloadPage("true");
          }, 5000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      questionaireApiCall
        .addBooleanConditionalJump(conditionalJump)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Conditional jump is added.");
          settoasterServerity("success");
          setTimeout(function () {
            setshowLoadder(false);
            setReloadPage("true");
          }, 5000);
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
        <LinkTo
          color="textPrimary"
          href="#"
          className="inactive"
          to={`/questionaires/view-questions/` + surveyId}
        >
          {surveyDetails ? surveyDetails.name : ""}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Conditional Jumb
        </LinkTo>
      </Breadcrumbs>
      <div className="main-paper-add-question">
        <div className="add-new-question">
          {!componentLoadder ? (
            <Card className="question-card auto-height-card">
              <ValidatorForm className={`global-form`} onSubmit={submitForm}>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h6">
                    Conditional jump
                  </Typography>
                  <Grid
                    container
                    xs={12}
                    sm={12}
                    className="jump-form-content"
                    spacing={1}
                  >
                    <Grid item container xs={12}>
                      <Grid item xs={2}>
                        <label className="required">Select question</label>
                      </Grid>
                      <Grid container xs={8} spacing={2}>
                        <Grid item container xs={12}>
                          <Grid
                            item
                            xs={4}
                            className="center-align-w-padding-v"
                          >
                            If answer is YES
                          </Grid>
                          <Grid item xs={8}>
                            <FormControl variant="outlined" fullWidth>
                              <InputLabel
                                id="demo-simple-select-outlined-label"
                                shrink={false}
                                className="select-label"
                              >
                                {conditionalJump.positiveResponseQuestionId ==
                                ""
                                  ? "Select question"
                                  : ""}
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={
                                  conditionalJump.positiveResponseQuestionId
                                }
                                name="positiveResponseQuestionId"
                                onChange={handleChange}
                                placeholder="Select question"
                                InputLabelProps={{
                                  shrink: false,
                                }}
                                className="global-input single-select"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {selectedSurveyQuestions.map((ans) => {
                                  return (
                                    <MenuItem
                                      value={ans.id}
                                      key={`atypered_${ans.id}`}
                                    >
                                      {ans.question}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid item container xs={12}>
                          <Grid
                            item
                            xs={4}
                            className="center-align-w-padding-v"
                          >
                            If answer is NO
                          </Grid>
                          <Grid item xs={8}>
                            <FormControl variant="outlined" fullWidth>
                              <InputLabel
                                id="demo-simple-select-outlined-label"
                                shrink={false}
                                className="select-label"
                              >
                                {conditionalJump.negativeResponseQuestionId ==
                                ""
                                  ? "Select question"
                                  : ""}
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={
                                  conditionalJump.negativeResponseQuestionId
                                }
                                name="negativeResponseQuestionId"
                                onChange={handleChange}
                                placeholder="Select question"
                                InputLabelProps={{
                                  shrink: false,
                                }}
                                className="global-input single-select"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {selectedSurveyQuestions.map((ans) => {
                                  return (
                                    <MenuItem
                                      value={ans.id}
                                      key={`atypered_${ans.id}`}
                                    >
                                      {ans.question}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions className="action-container">
                  <Button
                    size="small"
                    type="button"
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
              </ValidatorForm>
            </Card>
          ) : (
            <ComponentLoadderComponent />
          )}
        </div>
      </div>
      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
    </div>
  );
}

export default BooleanJump;
