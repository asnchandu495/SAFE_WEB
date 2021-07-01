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

function NumericQuestion(props) {
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
    isMandatory: false,
  });

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
      if (getData.redFlagForNumber.length == 0) {
        getData.redFlagForNumber = [
          {
            id: "",
            numericExpressionType: "",
            forAnswer: 0,
            forRangeEnd: 0,
          },
        ];
      }
      if (getData.positiveConformityForNumber.length == 0) {
        getData.positiveConformityForNumber = [
          {
            id: "",
            numericExpressionType: "",
            forAnswer: 0,
            forRangeEnd: 0,
          },
        ];
      }
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

  const handleChangeFlagR = (e, index) => {
    const { name, value } = e.target;
    const list = {
      ...addQuestionData,
      redFlagForNumber: [
        ...addQuestionData.redFlagForNumber.map((con, conIndex) =>
          conIndex == index ? { ...con, [name]: value } : con
        ),
      ],
    };
    setAddQuestionData(list);
  };

  const handleChangeFlagP = (e, index) => {
    const { name, value } = e.target;
    const list = {
      ...addQuestionData,
      positiveConformityForNumber: [
        ...addQuestionData.positiveConformityForNumber.map((con, conIndex) =>
          conIndex == index ? { ...con, [name]: value } : con
        ),
      ],
    };
    setAddQuestionData(list);
  };

  const handleAddClickRedFlag = (index, j) => {
    const list = { ...addQuestionData };
    const thisRedFlagNumber = list.redFlagForNumber;
    list.redFlagForNumber = [
      ...thisRedFlagNumber,
      {
        id: "",
        numericExpressionType: "",
        forAnswer: 0,
        forRangeEnd: 0,
      },
    ];
    setAddQuestionData(list);
  };

  const handleRemoveClickRedFlag = (j) => {
    const list = { ...addQuestionData };
    list.redFlagForNumber.splice(j, 1);
    setAddQuestionData(list);
  };

  const handleAddClickPositiveFlag = (index, j) => {
    const list = { ...addQuestionData };
    const thisPositiveFlagNumber = list.positiveConformityForNumber;
    list.positiveConformityForNumber = [
      ...thisPositiveFlagNumber,
      {
        id: "",
        numericExpressionType: "",
        forAnswer: 0,
        forRangeEnd: 0,
      },
    ];
    setAddQuestionData(list);
  };

  const handleRemoveClickPositiveFlag = (j) => {
    const list = { ...addQuestionData };
    list.positiveConformityForNumber.splice(j, 1);
    setAddQuestionData(list);
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

    let getPositiveConformityForNumber =
      finalObject.positiveConformityForNumber;

    let newPositiveConformityForNumber = [];
    getPositiveConformityForNumber.forEach((ch) => {
      let newForAnswer = 0;
      let chkTypeForAns = ch.forAnswer - Math.floor(ch.forAnswer) !== 0;
      if (chkTypeForAns) {
        newForAnswer = parseFloat(ch.forAnswer);
      } else {
        newForAnswer = parseInt(ch.forAnswer);
      }

      let newForRangeEnd = 0;
      let chkTypeForEndAns = ch.forRangeEnd - Math.floor(ch.forRangeEnd) !== 0;
      if (chkTypeForEndAns) {
        newForRangeEnd = parseFloat(ch.forRangeEnd);
      } else {
        newForRangeEnd = parseInt(ch.forRangeEnd);
      }

      newPositiveConformityForNumber.push({
        id: ch.id,
        numericExpressionType: ch.numericExpressionType,
        forAnswer: newForAnswer,
        forRangeEnd: newForRangeEnd,
      });
    });

    let getRedFlagForNumber = finalObject.redFlagForNumber;

    let newRedFlagForNumber = [];
    if (getRedFlagForNumber.length > 0) {
      getRedFlagForNumber.forEach((ch) => {
        let newForAnswer = 0;
        let chkTypeForAns = ch.forAnswer - Math.floor(ch.forAnswer) !== 0;
        if (chkTypeForAns) {
          newForAnswer = parseFloat(ch.forAnswer);
        } else {
          newForAnswer = parseInt(ch.forAnswer);
        }

        let newForRangeEnd = 0;
        let chkTypeForEndAns =
          ch.forRangeEnd - Math.floor(ch.forRangeEnd) !== 0;
        if (chkTypeForEndAns) {
          newForRangeEnd = parseFloat(ch.forRangeEnd);
        } else {
          newForRangeEnd = parseInt(ch.forRangeEnd);
        }

        newRedFlagForNumber.push({
          id: ch.id,
          numericExpressionType: ch.numericExpressionType,
          forAnswer: newForAnswer,
          forRangeEnd: newForRangeEnd,
        });
      });
    }

    finalObject.positiveConformityForNumber = newPositiveConformityForNumber;
    finalObject.redFlagForNumber = newRedFlagForNumber;

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
                          checked={addQuestionData.isPositiveConfirmityRedFlag}
                          name="isPositiveConfirmityRedFlag"
                          onChange={handleChangeSwitch}
                        />
                      }
                      label={
                        addQuestionData.isPositiveConfirmityRedFlag
                          ? "Yes"
                          : "No"
                      }
                    />
                  </Grid>
                </Grid>
                {addQuestionData.isPositiveConfirmityRedFlag ? (
                  <Grid
                    item
                    container
                    xs={12}
                    className="flag-card flag-card-dynamic"
                  >
                    <Grid item xs={2}>
                      <label
                        className={
                          addQuestionData.isPositiveConfirmityRedFlag
                            ? "required"
                            : ""
                        }
                      >
                        Red Flag Answer
                      </label>
                    </Grid>
                    <Grid item xs={10}>
                      {addQuestionData.redFlagForNumber &&
                      addQuestionData.redFlagForNumber.length > 0
                        ? addQuestionData.redFlagForNumber.map((x, i) => {
                            return (
                              <Grid
                                item
                                container
                                xs={12}
                                spacing={1}
                                key={`redflag-container${i}`}
                                className="dynamic-flag-container"
                              >
                                <Grid
                                  item
                                  xs={2}
                                  key={`redflag-containerSelect${i}`}
                                >
                                  <FormControl variant="outlined" fullWidth>
                                    <InputLabel
                                      id={`demo-simple-select-outlined-label${i}`}
                                      shrink={false}
                                      className="select-label"
                                    >
                                      {x.numericExpressionType &&
                                      x.numericExpressionType != ""
                                        ? ""
                                        : "Answer type"}
                                    </InputLabel>
                                    <Select
                                      labelId={`demo-simple-select-outlined-label${i}`}
                                      id={`demo-simple-select-outlined${i}`}
                                      value={
                                        x.numericExpressionType
                                          ? x.numericExpressionType
                                          : ""
                                      }
                                      name="numericExpressionType"
                                      onChange={(e) => handleChangeFlagR(e, i)}
                                      placeholder="Answer type"
                                      InputLabelProps={{
                                        shrink: false,
                                      }}
                                      className="global-input single-select"
                                      required={
                                        addQuestionData.isPositiveConfirmityRedFlag
                                      }
                                    >
                                      <MenuItem value="">
                                        <em>None</em>
                                      </MenuItem>
                                      {props.answerTypes.map((aType) => {
                                        return (
                                          <MenuItem
                                            value={aType.id}
                                            key={`atypered_${aType.id}`}
                                          >
                                            {aType.name}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid
                                  item
                                  xs={3}
                                  key={`redflag-containerF${i}`}
                                >
                                  <TextValidator
                                    variant="outlined"
                                    fullWidth
                                    id={`forAnswerR${i}`}
                                    key={`forAnswerR${i}`}
                                    placeholder={
                                      addQuestionData.redFlagForNumber[i]
                                        .numericExpressionType == "RANGE"
                                        ? "From"
                                        : "Your answer"
                                    }
                                    name="forAnswer"
                                    value={x.forAnswer}
                                    onChange={(e) => handleChangeFlagR(e, i)}
                                    className="global-input"
                                    validators={[
                                      "matchRegexp:^[0-9]+([.][0-9]+)?$",
                                    ]}
                                    errorMessages={[
                                      "Only numbers and decimals are allowed",
                                    ]}
                                    InputLabelProps={{ shrink: false }}
                                  />
                                </Grid>
                                {addQuestionData.redFlagForNumber[i]
                                  .numericExpressionType == "RANGE" ? (
                                  <>
                                    <Grid
                                      item
                                      xs={3}
                                      key={`redflag-containerT${i}`}
                                    >
                                      <TextValidator
                                        variant="outlined"
                                        fullWidth
                                        id={`forRangeEndR${i}`}
                                        key={`forRangeEndR${i}`}
                                        placeholder="To"
                                        name="forRangeEnd"
                                        value={x.forRangeEnd}
                                        onChange={(e) =>
                                          handleChangeFlagR(e, i)
                                        }
                                        className="global-input"
                                        validators={[
                                          "matchRegexp:^[0-9]+([.][0-9]+)?$",
                                        ]}
                                        errorMessages={[
                                          "Only numbers and decimals are allowed",
                                        ]}
                                        InputLabelProps={{ shrink: false }}
                                      />
                                    </Grid>
                                  </>
                                ) : (
                                  ""
                                )}
                                <Grid
                                  item
                                  xs={2}
                                  className="row-icons-container"
                                  key={`redflag-containerIcons${i}`}
                                >
                                  {addQuestionData.redFlagForNumber.length !==
                                    1 && (
                                    <Tooltip title="Remove">
                                      <CancelIcon
                                        className={`delete-row-icon`}
                                        onClick={() =>
                                          handleRemoveClickRedFlag(i)
                                        }
                                      ></CancelIcon>
                                    </Tooltip>
                                  )}
                                  {addQuestionData.redFlagForNumber.length -
                                    1 ===
                                    i && (
                                    <Tooltip title="Add">
                                      <AddCircleIcon
                                        className={`add-row-icon`}
                                        onClick={handleAddClickRedFlag}
                                      ></AddCircleIcon>
                                    </Tooltip>
                                  )}
                                </Grid>
                              </Grid>
                            );
                          })
                        : ""}
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
                  <Grid item xs={10}>
                    {addQuestionData.positiveConformityForNumber &&
                    addQuestionData.positiveConformityForNumber.length > 0
                      ? addQuestionData.positiveConformityForNumber.map(
                          (x, i) => {
                            return (
                              <Grid
                                item
                                container
                                xs={12}
                                spacing={1}
                                key={`positiveflag-container${i}`}
                                className="dynamic-flag-container"
                              >
                                <Grid
                                  item
                                  xs={2}
                                  key={`positiveflag-containerSelect${i}`}
                                >
                                  <FormControl variant="outlined" fullWidth>
                                    <InputLabel
                                      id={`demo-simple-select-outlined-label${i}`}
                                      shrink={false}
                                      className="select-label"
                                    >
                                      {x.numericExpressionType &&
                                      x.numericExpressionType != ""
                                        ? ""
                                        : "Answer type"}
                                    </InputLabel>
                                    <Select
                                      required
                                      labelId={`demo-simple-select-outlined-label${i}`}
                                      id={`demo-simple-select-outlined${i}`}
                                      value={
                                        x.numericExpressionType
                                          ? x.numericExpressionType
                                          : ""
                                      }
                                      name="numericExpressionType"
                                      onChange={(e) => handleChangeFlagP(e, i)}
                                      placeholder="Answer type"
                                      InputLabelProps={{
                                        shrink: false,
                                      }}
                                      className="global-input single-select"
                                    >
                                      <MenuItem value="">
                                        <em>None</em>
                                      </MenuItem>
                                      {props.answerTypes.map((aType) => {
                                        return (
                                          <MenuItem
                                            value={aType.id}
                                            key={`atypered_${aType.id}`}
                                          >
                                            {aType.name}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid
                                  item
                                  xs={3}
                                  key={`positiveflag-containerF${i}`}
                                >
                                  <TextValidator
                                    variant="outlined"
                                    fullWidth
                                    id={`forAnswerP${i}`}
                                    key={`forAnswerP${i}`}
                                    placeholder={
                                      addQuestionData
                                        .positiveConformityForNumber[i]
                                        .numericExpressionType == "RANGE"
                                        ? "From"
                                        : "Your answer"
                                    }
                                    name="forAnswer"
                                    value={x.forAnswer}
                                    onChange={(e) => handleChangeFlagP(e, i)}
                                    className="global-input"
                                    validators={[
                                      "required",
                                      "matchRegexp:^[0-9]+([.][0-9]+)?$",
                                    ]}
                                    errorMessages={[
                                      "Please enter range",
                                      "Only numbers and decimals are allowed",
                                    ]}
                                    InputLabelProps={{ shrink: false }}
                                  />
                                </Grid>
                                {addQuestionData.positiveConformityForNumber[i]
                                  .numericExpressionType == "RANGE" ? (
                                  <>
                                    <Grid
                                      item
                                      xs={3}
                                      key={`positiveflag-containerT${i}`}
                                    >
                                      <TextValidator
                                        variant="outlined"
                                        fullWidth
                                        id={`forRangeEndP${i}`}
                                        key={`forRangeEndP${i}`}
                                        placeholder="To"
                                        name="forRangeEnd"
                                        value={x.forRangeEnd}
                                        onChange={(e) =>
                                          handleChangeFlagP(e, i)
                                        }
                                        className="global-input"
                                        validators={[
                                          "matchRegexp:^[0-9]+([.][0-9]+)?$",
                                        ]}
                                        errorMessages={[
                                          "Only numbers and decimals are allowed",
                                        ]}
                                        InputLabelProps={{ shrink: false }}
                                      />
                                    </Grid>
                                  </>
                                ) : (
                                  ""
                                )}
                                <Grid
                                  item
                                  xs={2}
                                  className="row-icons-container"
                                  key={`positiveflag-containerIcons${i}`}
                                >
                                  {addQuestionData.positiveConformityForNumber
                                    .length !== 1 && (
                                    <Tooltip title="Remove">
                                      <CancelIcon
                                        className={`delete-row-icon`}
                                        onClick={() =>
                                          handleRemoveClickPositiveFlag(i)
                                        }
                                      ></CancelIcon>
                                    </Tooltip>
                                  )}
                                  {addQuestionData.positiveConformityForNumber
                                    .length -
                                    1 ===
                                    i && (
                                    <Tooltip title="Add">
                                      <AddCircleIcon
                                        className={`add-row-icon`}
                                        onClick={handleAddClickPositiveFlag}
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

export default withRouter(NumericQuestion);
