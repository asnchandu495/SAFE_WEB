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
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import questionaireService from "../../../services/questionaireService";
import ToasterMessageComponent from "../../common/toaster";
import ComponentLoadderComponent from "../../common/loadder/componentloadder";

function MultipleJump(props) {
  const surveyId = props.match.params.id;
  const questionId = props.match.params.qid;
  const questionaireApiCall = new questionaireService();

  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [showLoadder, setshowLoadder] = useState(false);
  const [conditionalJump, setConditionalJump] = useState({
    id: "",
    surveyQuestionId: questionId,
    multiChoiceConditionalQuestions: [
      {
        id: "",
        multiChoiceConditionalOrderId: "",
        answerChoices: [],
        goToSurveyQuestionId: "",
        isEndQuestion: false
      },
    ],
    elseGoToQuestionId: "",
    goToNormalSequence: false,
  });

  const [cancelconditionalJump, setcancelConditionalJump] = useState({
    id: "",
    surveyQuestionId: questionId,
    multiChoiceConditionalQuestions: [
      {
        id: "",
        multiChoiceConditionalOrderId: "",
        answerChoices: [],
        goToSurveyQuestionId: "",
        isEndQuestion: false
      },
    ],
    elseGoToQuestionId: "",
    goToNormalSequence: false,
  });
  const [surveyDetails, setsurveyDetails] = useState();
  const [selectedSurveyQuestions, setSelectedSurveyQuestions] = useState([]);
  const [allAnswerExpressions, setAllAnswerExpressions] = useState([]);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [selectedQuestionDetails, setselectedQuestionDetails] = useState();
  const [answerChoices, setAnswerChoices] = useState([]);
  const [reloadPage, setReloadPage] = useState("false");

  const GreenCheckbox = withStyles({
    root: {
      color: "#3f51b5",
      "&$checked": {
        color: "#de1b54",
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  useEffect(() => {
    Promise.all([
      questionaireApiCall.getAllExpressions(),
      questionaireApiCall.GetAllQuestionsBySurveyId(surveyId),
      questionaireApiCall.GetMultipleChoicQuestionById(questionId),
      questionaireApiCall.getSurveyById(surveyId),
      questionaireApiCall.GetMultipleChoicQuestionBooleanById(questionId),
    ])
      .then(
        ([
          allExpressions,
          allSurveyQuestions,
          choiceQuestionDetails,
          getsurveyDetails,
          choiceQuestionMultipleDetails,
        ]) => {
          setAllAnswerExpressions(allExpressions);
          let filteredQuestions = allSurveyQuestions.filter((r) => {
            return r.id != questionId;
          });
          setSelectedSurveyQuestions(filteredQuestions);
          setselectedQuestionDetails(choiceQuestionDetails);
          setAnswerChoices(choiceQuestionDetails.surveyResponseChoices);
          setsurveyDetails(getsurveyDetails);
          if (choiceQuestionMultipleDetails) {
            let getMultichoiceConditionalQuestions =
              choiceQuestionMultipleDetails.multiChoiceConditionalQuestions;
            let newChoicesArray = [];
            getMultichoiceConditionalQuestions.forEach((element) => {
              let selectedAnswerChoice = element.answerChoices;
              let newAnswerChoices = [];
              selectedAnswerChoice.forEach((ch) => {
                let selectedMainChoiceInfo =
                  choiceQuestionDetails.surveyResponseChoices.find(
                    (cho) => cho.optionId == ch.option
                  );
                newAnswerChoices.push({
                  option: selectedMainChoiceInfo.option,
                  optionId: ch.option,
                });
              });
              newChoicesArray.push({
                id: "",
                multiChoiceConditionalOrderId:
                  element.multiChoiceConditionalOrderId,
                answerChoices: newAnswerChoices,
                goToSurveyQuestionId: element.goToSurveyQuestionId,
              });
            });
            choiceQuestionMultipleDetails.multiChoiceConditionalQuestions =
              newChoicesArray;
            setConditionalJump(choiceQuestionMultipleDetails);
            setcancelConditionalJump(choiceQuestionMultipleDetails);
            setReloadPage("false");
            setcomponentLoadder(false);
          } else {
            setReloadPage("false");
            setcomponentLoadder(false);
          }
        }
      )
      .catch((error) => {
        console.log(error);
      });
  }, [reloadPage]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name == "goToNormalSequence") {
      setConditionalJump((conditionalJump) => ({
        ...conditionalJump,
        [name]: checked,
      }));
    } else {
      setConditionalJump((conditionalJump) => ({
        ...conditionalJump,
        [name]: value,
      }));
    }
  };

  const handleChangeLogicAnswer = (e, index) => {
    const { name, value } = e.target;
    if (name == 'goToSurveyQuestionId') {
      let thisQuestion = selectedSurveyQuestions.find(que => que.id == value);
      const list = {
        ...conditionalJump,
        multiChoiceConditionalQuestions: [
          ...conditionalJump.multiChoiceConditionalQuestions.map(
            (con, conIndex) =>
              conIndex == index ? { ...con, [name]: value, ["isEndQuestion"]: thisQuestion.isEndQuestion } : con
          ),
        ],
      };
      setConditionalJump(list);
    } else {
      const list = {
        ...conditionalJump,
        multiChoiceConditionalQuestions: [
          ...conditionalJump.multiChoiceConditionalQuestions.map(
            (con, conIndex) =>
              conIndex == index ? { ...con, [name]: value } : con
          ),
        ],
      };
      setConditionalJump(list);
    }

  };

  const handleAddClickLogicAnswer = (index, j) => {
    const list = { ...conditionalJump };
    const thisconditionalJumpAnswers = list.multiChoiceConditionalQuestions;
    list.multiChoiceConditionalQuestions = [
      ...thisconditionalJumpAnswers,
      {
        id: "",
        multiChoiceConditionalOrderId: "",
        answerChoices: [],
        goToSurveyQuestionId: "",
        isEndQuestion: false
      },
    ];
    setConditionalJump(list);
  };

  const handleRemoveClickLogicAnswer = (j) => {
    const list = { ...conditionalJump };
    list.multiChoiceConditionalQuestions.splice(j, 1);
    setConditionalJump(list);
  };

  const handleChangeMultiSelectChoices = (getSelectedVal, index) => {
    const list = {
      ...conditionalJump,
      multiChoiceConditionalQuestions: [
        ...conditionalJump.multiChoiceConditionalQuestions.map(
          (con, conIndex) =>
            conIndex == index
              ? {
                answerChoices: getSelectedVal,
                ["goToSurveyQuestionId"]: con.goToSurveyQuestionId,
                ["isEndQuestion"]: con.isEndQuestion,
                ["id"]: con.id,
                ["multiChoiceConditionalOrderId"]:
                  con.multiChoiceConditionalOrderId,
              }
              : con
        ),
      ],
    };
    setConditionalJump(list);
  };
  function handleCancel() {
    // setConditionalJump(cancelconditionalJump);
    setTimeout(() => {
      props.history.push(`/questionaires/view-questions/${surveyId}`);
    }, 1000);
  }
  function submitForm(e) {
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    let newConditionalJumpData = conditionalJump;
    let getSelectedChoicesArray =
      newConditionalJumpData.multiChoiceConditionalQuestions;
    let newChoicesArray = [];
    getSelectedChoicesArray.forEach((element) => {
      let selectedAnswerChoice = element.answerChoices;
      let newAnswerChoices = [];
      selectedAnswerChoice.forEach((ch) => {
        newAnswerChoices.push({
          surveyQuestionId: questionId,
          option: ch.optionId,
        });
      });
      newChoicesArray.push({
        id: element.id,
        multiChoiceConditionalOrderId: element.multiChoiceConditionalOrderId,
        answerChoices: newAnswerChoices,
        goToSurveyQuestionId: element.goToSurveyQuestionId,
        isEndQuestion: element.isEndQuestion
      });
    });
    newConditionalJumpData.multiChoiceConditionalQuestions = newChoicesArray;
    setshowLoadder(true);
    if (conditionalJump.id != "") {
      questionaireApiCall
        .updateMultiChoiceConditionalJump(newConditionalJumpData)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Conditional jump is updated.");
          settoasterServerity("success");

          setTimeout(function () {
            setshowLoadder(false);
            props.history.push("/questionaires/view-questions/" + surveyId);
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
        .addMultiChoiceConditionalJump(newConditionalJumpData)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Conditional jump is added.");
          settoasterServerity("success");
          setTimeout(function () {
            setshowLoadder(false);
            props.history.push("/questionaires/view-questions/" + surveyId);
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
          Questionnaires
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/questionaires/view-questions/` + surveyId}
          className="inactive"
        >
          {surveyDetails ? surveyDetails.name : ""}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Conditional Jump
        </LinkTo>
      </Breadcrumbs>
      <div className="main-paper-add-question">
        <div className="add-new-question">
          {!componentLoadder ? (
            <Card className="question-card auto-height-card flag-card-dynamic">
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
                    <Grid item container xs={12} className="logic-ques-name">
                      <Grid item xs={2}>
                        <label className="">Question Name </label>
                      </Grid>
                      <Grid container xs={8} spacing={2}>
                        <Grid item container xs={12}>
                          <Grid
                            item
                            xs={4}
                            className="center-align-w-padding-v"
                          >
                            {selectedQuestionDetails.question}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item container xs={12}>
                      <Grid item xs={2}>
                        <label className="required">Config logic</label>
                      </Grid>
                      <Grid container sm={10} spacing={2}>
                        {conditionalJump.multiChoiceConditionalQuestions
                          .length > 0
                          ? conditionalJump.multiChoiceConditionalQuestions.map(
                            (x, i) => {
                              return (
                                <Grid
                                  spacing={1}
                                  container
                                  sm={12}
                                  key={`answer-logic-container${i}`}
                                  className="answer-logic-container"
                                >
                                  <Grid item xs={5}>
                                    <FormControl variant="outlined" fullWidth>
                                      <Autocomplete
                                        id={`tags-outlinedP${i}`}
                                        multiple
                                        options={
                                          answerChoices &&
                                            answerChoices.length > 0
                                            ? answerChoices
                                            : []
                                        }
                                        getOptionLabel={(opt) => opt.option}
                                        defaultValue={x.answerChoices}
                                        onChange={(e, v) =>
                                          handleChangeMultiSelectChoices(v, i)
                                        }
                                        filterSelectedOptions
                                        className="global-input autocomplete-select"
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            variant="outlined"
                                            inputProps={{
                                              ...params.inputProps,
                                              required:
                                                x.answerChoices.length === 0,
                                            }}
                                            placeholder="Select answer"
                                          />
                                        )}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <FormControl variant="outlined" fullWidth>
                                      <InputLabel
                                        id="demo-simple-select-outlined-label"
                                        shrink={false}
                                        className="select-label"
                                      >
                                        {x.goToSurveyQuestionId == ""
                                          ? "Select question"
                                          : ""}
                                      </InputLabel>
                                      <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={x.goToSurveyQuestionId}
                                        name="goToSurveyQuestionId"
                                        onChange={(e) =>
                                          handleChangeLogicAnswer(e, i)
                                        }
                                        placeholder="Select question"
                                        InputLabelProps={{
                                          shrink: false,
                                        }}
                                        className="global-input single-select"
                                        required
                                      >
                                        <MenuItem value="">
                                          <em>None</em>
                                        </MenuItem>
                                        {selectedSurveyQuestions.map(
                                          (ans) => {
                                            return (
                                              <MenuItem
                                                value={ans.id}
                                                key={`atypered_${ans.id}`}
                                              >
                                                {ans.question}
                                              </MenuItem>
                                            );
                                          }
                                        )}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={1}
                                    className="row-icons-container"
                                  >
                                    {conditionalJump
                                      .multiChoiceConditionalQuestions
                                      .length !== 1 && (
                                        <Tooltip title="Remove">
                                          <CancelIcon
                                            className={`delete-row-icon`}
                                            onClick={() =>
                                              handleRemoveClickLogicAnswer(i)
                                            }
                                          ></CancelIcon>
                                        </Tooltip>
                                      )}
                                    {conditionalJump
                                      .multiChoiceConditionalQuestions
                                      .length -
                                      1 ===
                                      i && (
                                        <Tooltip title="Add">
                                          <AddCircleIcon
                                            className={`add-row-icon`}
                                            onClick={handleAddClickLogicAnswer}
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
                    <Grid item container xs={12}>
                      <Grid item xs={2}>
                        <label
                          className={
                            conditionalJump.goToNormalSequence ? "required" : ""
                          }
                        >
                          Default
                        </label>
                      </Grid>
                      <Grid container xs={8} spacing={2}>
                        <Grid item container xs={12} spacing={1}>
                          <Grid item xs={5} className="checkbox-grid">
                            <FormControlLabel
                              control={
                                <GreenCheckbox
                                  checked={conditionalJump.goToNormalSequence}
                                  onChange={handleChange}
                                  name="goToNormalSequence"
                                />
                              }
                              label="Goto normal sequence"
                            />
                          </Grid>
                          {conditionalJump.goToNormalSequence ? (
                            <Grid item xs={6}>
                              <FormControl variant="outlined" fullWidth>
                                <InputLabel
                                  id="demo-simple-select-outlined-label"
                                  shrink={false}
                                  className="select-label"
                                >
                                  {conditionalJump.elseGoToQuestionId == ""
                                    ? "Select question"
                                    : ""}
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-outlined-label"
                                  id="demo-simple-select-outlined"
                                  value={conditionalJump.elseGoToQuestionId}
                                  name="elseGoToQuestionId"
                                  onChange={handleChange}
                                  placeholder="Select questiohn"
                                  InputLabelProps={{
                                    shrink: false,
                                  }}
                                  className="global-input single-select"
                                // required={conditionalJump.goToNormalSequence}
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
                          ) : (
                            ""
                          )}
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
                    onClick={handleCancel}
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

export default MultipleJump;
