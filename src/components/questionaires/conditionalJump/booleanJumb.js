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
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import questionaireService from "../../../services/questionaireService";

function BooleanJump(props) {
  const surveyId = props.match.params.id;
  const questionId = props.match.params.qid;
  const questionaireApiCall = new questionaireService();

  const [showLoadder, setshowLoadder] = useState(false);
  const [conditionalJump, setConditionalJump] = useState({
    surveyQuestionId: questionId,
    isConditionalJump: false,
    // booleanConditionalQuestions: [
    //   {
    //     id: "",
    //     answer: "",
    //     goToSurveyQuestionId: "string",
    //   },
    // ],
    positiveResponseQuestionId: { id: "", question: "" },
    negativeResponseQuestionId: { id: "", question: "" },
  });
  const [answersToSelect, setAnswersToSelect] = useState([
    { id: "TRUE", name: "TRUE" },
    { id: "FALSE", name: "FALSE" },
  ]);
  const [selectedSurveyQuestions, setSelectedSurveyQuestions] = useState([]);

  useEffect(() => {
    questionaireApiCall
      .GetAllQuestionsBySurveyId(surveyId)
      .then((res) => {
        setSelectedSurveyQuestions(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

  const handleChangeRedFlagSwitch = (e) => {
    const { name, value } = e.target;
    setConditionalJump((conditionalJump) => ({
      ...conditionalJump,
      [name]: e.target.checked,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConditionalJump((conditionalJump) => ({
      ...conditionalJump,
      [name]: value,
    }));
  };

  const handleChangePositiveQuestion = (getSelectedVal, index) => {
    setConditionalJump((conditionalJump) => ({
      ...conditionalJump,
      ["positiveResponseQuestionId"]: getSelectedVal,
    }));
  };

  const handleChangeNegativeQuestion = (getSelectedVal, index) => {
    setConditionalJump((conditionalJump) => ({
      ...conditionalJump,
      ["negativeResponseQuestionId"]: getSelectedVal,
    }));
  };

  function submitForm(e) {
    e.preventDefault();
    console.log(conditionalJump);
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
          Selected question name
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Conditional Jumb
        </LinkTo>
      </Breadcrumbs>
      <div className="main-paper-add-question">
        <div className="add-new-question">
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
                    <Grid item xs={4}>
                      <label className="required">Conditional switch</label>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <PurpleSwitch
                            checked={conditionalJump.isConditionalJump}
                            name="isConditionalJump"
                            onChange={handleChangeRedFlagSwitch}
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid item container xs={12}>
                    <Grid item xs={4}>
                      <label className="required">Select question</label>
                    </Grid>
                    <Grid container xs={8} spacing={2}>
                      <Grid item container xs={12}>
                        {/* <Grid item xs={4}>
                          <FormControl variant="outlined" fullWidth>
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={conditionalJump.positiveResponseQuestionId}
                              name="positiveResponseQuestionId"
                              onChange={handleChange}
                              placeholder="Answer type"
                              InputLabelProps={{
                                shrink: false,
                              }}
                              className="global-input single-select"
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
                        </Grid> */}
                        <Grid item xs={4} className="center-align-w-padding-v">
                          If answer is YES
                        </Grid>
                        <Grid item xs={8}>
                          <FormControl variant="outlined" fullWidth>
                            <Autocomplete
                              id="tags-outlined"
                              options={
                                selectedSurveyQuestions &&
                                selectedSurveyQuestions.length > 0
                                  ? selectedSurveyQuestions
                                  : []
                              }
                              getOptionLabel={(opt) => opt.question}
                              defaultValue={
                                conditionalJump.positiveResponseQuestionId
                              }
                              onChange={(e, v) =>
                                handleChangePositiveQuestion(v)
                              }
                              filterSelectedOptions
                              className="global-input autocomplete-select"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder="Select answer"
                                />
                              )}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid item container xs={12}>
                        <Grid item xs={4} className="center-align-w-padding-v">
                          If answer is NO
                        </Grid>
                        <Grid item xs={8}>
                          <FormControl variant="outlined" fullWidth>
                            <Autocomplete
                              id="tags-outlined"
                              options={
                                selectedSurveyQuestions &&
                                selectedSurveyQuestions.length > 0
                                  ? selectedSurveyQuestions
                                  : []
                              }
                              getOptionLabel={(opt) => opt.question}
                              defaultValue={
                                conditionalJump.negativeResponseQuestionId
                              }
                              onChange={(e, v) =>
                                handleChangeNegativeQuestion(v)
                              }
                              filterSelectedOptions
                              className="global-input autocomplete-select"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder="Select answer"
                                />
                              )}
                            />
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
        </div>
      </div>
    </div>
  );
}

export default BooleanJump;
