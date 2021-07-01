import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Link as LinkTo, useParams } from "react-router-dom";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import ToasterMessageComponent from "../common/toaster";
import CovidStateApiServices from "../../services/masterDataService";
import questionaireService from "../../services/questionaireService";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as globalSettingAction from "../../Redux/Action/globalSettingAction";
import TooltipComponent from "../common/tooltip";

const useStyles = makeStyles((theme) => ({
  gridDispaly: {
    display: "inline-flex",
  },
}));

function QuestionnaireEvaluation(props) {
  const classes = useStyles();
  const CovidStateApi = new CovidStateApiServices();
  const questionaireApiCall = new questionaireService();
  const surveyIdURL = props.match.params.id;
  const { id } = useParams();
  const [showLoadder, setshowLoadder] = useState(false);
  const [questionaireDetails, setquestionaireDetails] = useState();
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [covidStatelist, setcovidStatelist] = useState([]);
  // const [formData, SetformData] = useState({
  //   id: "",
  //   lowerLimit: 0,
  //   upperLimit: 0,
  //   globalSettingsId: "",
  //   covidState: {
  //     id: "",
  //     stateName: "",
  //   },
  // });
  const [flagStatus, setflagStatus] = useState(false);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [selectedcovidState, setSelectedCovidState] = useState();
  const [disableUpperLimit, setdisableUpperLimit] = useState(false);
  const [temperatureConfigForm, setTemperatureConfigForm] = useState({
    id: "",
    surveyId: id,
    positiveConformityScore: 0,
    covidState: {
      id: "",
      stateName: "",
    },
    positiveResponses: [
      {
        id: "",
        upperLimit: 0,
        lowerLimit: 0,
        covidState: {
          id: "",
          stateName: "",
        },
        isNoUpperLimit: false,
      },
    ],
  });
  const [oldData, setOldData] = useState({
    id: "",
    surveyId: id,
    positiveConformityScore: 0,
    covidState: {
      id: "",
      stateName: "",
    },
    positiveResponses: [
      {
        id: "",
        upperLimit: 0,
        lowerLimit: 0,
        covidState: {
          id: "",
          stateName: "",
        },
        isNoUpperLimit: true,
      },
    ],
  });
  const [componentLoadder, setcomponentLoadder] = useState(true);

  const uomTemp = [
    {
      id: "1",
      uomTempvalue: "Farenheit",
    },
    {
      id: "2",
      uomTempvalue: "Celsius",
    },
  ];

  useEffect(() => {
    Promise.all([
      questionaireApiCall.getSurveyById(id),
      CovidStateApi.getCOVIDStates(),
      questionaireApiCall.GetEvaluationId(id),
    ])
      .then(([surveyid, covidstateRes, getEvaluationDetails]) => {
        setcovidStatelist(covidstateRes);
        setquestionaireDetails(surveyid);
        if (getEvaluationDetails && getEvaluationDetails.id) {
          setTemperatureConfigForm(getEvaluationDetails);
          setOldData(getEvaluationDetails);
        }
        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleChangeInput(e) {
    const { name, value } = e.target;
    let thisValue = "";
    if (value != "") {
      thisValue = parseInt(value);
    } else {
      thisValue = "";
    }
    setTemperatureConfigForm((temperatureConfigForm) => ({
      ...temperatureConfigForm,
      [name]: thisValue,
    }));
  }

  function handleChangeCovidStateMain(e, selectedValue) {
    let thisValue = {
      id: selectedValue.id,
      stateName: selectedValue.stateName,
    };
    setTemperatureConfigForm((temperatureConfigForm) => ({
      ...temperatureConfigForm,
      ["covidState"]: thisValue,
    }));
  }

  function handleChangeCovidState(e, value, index) {
    let thisValue = { id: value.id, stateName: value.stateName };
    const list = {
      ...temperatureConfigForm,
      positiveResponses: [
        ...temperatureConfigForm.positiveResponses.map((con, conIndex) =>
          conIndex == index
            ? {
                ...con,
                ["covidState"]: thisValue,
              }
            : con
        ),
      ],
    };
    setTemperatureConfigForm(list);
  }

  const handleInputChange = (e, index) => {
    const { name, value, checked } = e.target;
    const list = {
      ...temperatureConfigForm,
      positiveResponses: [
        ...temperatureConfigForm.positiveResponses.map((con, conIndex) => {
          if (name == "lowerLimit") {
            return conIndex == index ? { ...con, [name]: value } : con;
          } else if (name == "upperLimit") {
            return conIndex == index ? { ...con, [name]: value } : con;
          } else {
            if (checked) {
              return conIndex == index
                ? { ...con, [name]: checked, ["upperLimit"]: 0 }
                : con;
            } else {
              return conIndex == index
                ? { ...con, [name]: checked, ["upperLimit"]: 0 }
                : con;
            }
          }
        }),
      ],
    };
    setTemperatureConfigForm(list);
  };

  const handleRemoveClick = (j) => {
    const list = { ...temperatureConfigForm };
    list.positiveResponses.splice(j, 1);
    const listmain = {
      ...list,
      positiveResponses: [
        ...list.positiveResponses.map((con, conIndex) => {
          return conIndex - 1 == j - 1
            ? { ...con, ["isNoUpperLimit"]: true, ["upperLimit"]: 0 }
            : con;
        }),
      ],
    };
    // setTemperatureConfigForm(list);
    setTemperatureConfigForm(listmain);
  };
  function handleChange(e) {
    setisAlertBoxOpened(true);

    const { name, value } = e.target;
    if (name == "HightTemperatureNoLimit") {
      if (e.target.checked == true) {
        setdisableUpperLimit(true);
        setTemperatureConfigForm((logInForm) => ({
          ...logInForm,
          [name]: e.target.checked,
          ["upperLimit"]: -1,
        }));
      } else {
        setdisableUpperLimit(false);
        setTemperatureConfigForm((logInForm) => ({
          ...logInForm,
          [name]: value,
        }));
      }
    }
  }

  const handleAddClick = (index, j) => {
    const list = { ...temperatureConfigForm };
    const thistempsections = list.positiveResponses;
    list.positiveResponses = [
      ...thistempsections,
      {
        id: "",
        upperLimit: 0,
        lowerLimit: 0,
        covidState: {
          id: "",
          stateName: "",
        },
        isNoUpperLimit: false,
      },
    ];
    const listmain = {
      ...list,
      positiveResponses: [
        ...list.positiveResponses.map((con, conIndex) => {
          return conIndex - 1 == index - 1
            ? { ...con, ["isNoUpperLimit"]: false, ["upperLimit"]: 0 }
            : con;
        }),
      ],
    };

    // setTemperatureConfigForm(list);
    setTemperatureConfigForm(listmain);
  };

  function handleChange(e) {
    const { name, value } = e.target.checked;
    if (e.target.checked) {
      setflagStatus(true);
    } else {
      setflagStatus(false);
    }
  }
  function submitForm(e) {
    e.preventDefault();
    setshowLoadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    var formData = temperatureConfigForm;
    let getPositiveResponses = formData.positiveResponses;
    getPositiveResponses.forEach((item) => {
      item.upperLimit = parseFloat(item.upperLimit);
      item.lowerLimit = parseFloat(item.lowerLimit);
    });
    formData.positiveResponses = getPositiveResponses;
    if (temperatureConfigForm.id != "") {
      questionaireApiCall
        .updateEvaluationResultForQuestionnaire(formData)
        .then((response) => {
          setStateSnackbar(true);
          setToasterMessage("Updated evaluation settings.");
          settoasterServerity("success");
          setisAlertBoxOpened(false);
          setTimeout(() => {
            setshowLoadder(false);
          }, 6000);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      questionaireApiCall
        .AddEvaluationResultForQuestionnaire(formData)
        .then((response) => {
          setStateSnackbar(true);
          setToasterMessage("Created evaluation settings.");
          settoasterServerity("success");
          setisAlertBoxOpened(false);
          setTimeout(() => {
            setshowLoadder(false);
          }, 6000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleClickGoBackToPage() {
    setTemperatureConfigForm(oldData);
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
          href="#"
          to={`/questionaires/allquestionaires`}
          className="inactive"
        >
          Questionnaire
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/questionaires/view-questions/` + id}
          className="inactive"
        >
          {questionaireDetails ? questionaireDetails.name : ""}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Questionnaire Evaluation{" "}
        </LinkTo>
      </Breadcrumbs>
      <span style={{ float: "right" }}>
        <TooltipComponent
          isMarginBottom={true}
          tooltipMessage={`Logic defined to determined user's COVID state from their responses to questionnaire.`}
        ></TooltipComponent>{" "}
      </span>

      <Paper className={`main-paper`}>
        {componentLoadder ? (
          <ComponentLoadderComponent />
        ) : (
          <ValidatorForm className={`global-form`} onSubmit={submitForm}>
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                className={[classes.gridDispaly].join(" ")}
                container
                spacing={1}
              >
                <Grid item xs={3}>
                  <label className="required">
                    Score for positive conformity response
                  </label>
                </Grid>

                <Grid item xs={3}>
                  <TextValidator
                    variant="outlined"
                    validators={[
                      "required",
                      "matchRegexp:^[a-zA-Z0-9 ]*$",
                      "maxNumber:99",
                    ]}
                    errorMessages={[
                      "Please select positive conformity score",
                      "Special charcters are not allowed",
                      "Entered numbers are not valid",
                    ]}
                    fullWidth
                    id="positiveConformityScore"
                    placeholder="Positive conformity score"
                    name="positiveConformityScore"
                    onChange={handleChangeInput}
                    value={temperatureConfigForm.positiveConformityScore}
                    InputLabelProps={{ shrink: false }}
                    className="global-input"
                  />
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                className={[classes.gridDispaly].join(" ")}
                container
                spacing={1}
              >
                <Grid item xs={3}>
                  <label className="required">
                    Covid state if one or more red flag responses
                  </label>
                </Grid>
                <Grid item xs={3}>
                  <FormControl variant="outlined" fullWidth>
                    <Autocomplete
                      id="tags-outlined"
                      options={
                        covidStatelist && covidStatelist.length > 0
                          ? covidStatelist
                          : []
                      }
                      getOptionLabel={(option) => option.stateName}
                      onChange={(e, v) => handleChangeCovidStateMain(e, v)}
                      defaultValue={
                        temperatureConfigForm.covidState
                          ? temperatureConfigForm.covidState
                          : ""
                      }
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      required
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select  covid state"
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            {temperatureConfigForm.positiveResponses &&
            temperatureConfigForm.positiveResponses.length > 0
              ? temperatureConfigForm.positiveResponses.map((x, i) => {
                  return (
                    <Grid
                      container
                      spacing={3}
                      className="evaluate-dynamic-rows"
                    >
                      <Grid
                        item
                        xs={12}
                        className={[classes.gridDispaly].join(" ")}
                        container
                        spacing={1}
                      >
                        <Grid item xs={3}>
                          <label className="required">
                            {" "}
                            Covid state based on positive conformity score
                          </label>
                        </Grid>
                        <Grid item xs={2}>
                          <FormControl variant="outlined" fullWidth>
                            <Autocomplete
                              id="tags-outlined"
                              options={
                                covidStatelist && covidStatelist.length > 0
                                  ? covidStatelist
                                  : []
                              }
                              getOptionLabel={(option) => option.stateName}
                              onChange={(e, v) =>
                                handleChangeCovidState(e, v, i)
                              }
                              defaultValue={
                                temperatureConfigForm.positiveResponses
                                  ? temperatureConfigForm.positiveResponses
                                  : ""
                              }
                              name="covidState"
                              defaultValue={x.covidState}
                              filterSelectedOptions
                              className="global-input autocomplete-select"
                              required
                              renderInput={(params) => (
                                <TextField
                                  required
                                  {...params}
                                  variant="outlined"
                                  placeholder="Select  covid state"
                                />
                              )}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                          <TextValidator
                            variant="outlined"
                            validators={
                              i == 0
                                ? [
                                    "required",
                                    "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                    "minNumber:0",
                                  ]
                                : [
                                    "required",
                                    "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                    `minNumber:${
                                      parseFloat(
                                        temperatureConfigForm.positiveResponses[
                                          i - 1
                                        ].upperLimit
                                      ) + 1
                                    }`,
                                  ]
                            }
                            errorMessages={
                              i == 0
                                ? [
                                    "Please enter lower limit",
                                    "Entered numbers are not valid",
                                    "Minimum allowed is 0",
                                  ]
                                : [
                                    "Please enter lower limit",
                                    "Entered numbers are not valid",
                                    `Minimum allowed is ${
                                      parseFloat(
                                        temperatureConfigForm.positiveResponses[
                                          i - 1
                                        ].upperLimit
                                      ) + 1
                                    }`,
                                  ]
                            }
                            fullWidth
                            id={`lowerLimit_${i}`}
                            placeholder="Lower Limit"
                            name="lowerLimit"
                            value={x.lowerLimit}
                            className="global-input"
                            onChange={(e) => handleInputChange(e, i)}
                            InputLabelProps={{ shrink: false }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextValidator
                            variant="outlined"
                            disabled={disableUpperLimit ? "true" : ""}
                            validators={
                              temperatureConfigForm.positiveResponses
                                ? x.isNoUpperLimit
                                  ? [
                                      "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                      `minNumber:${
                                        x.isNoUpperLimit
                                          ? 0
                                          : parseFloat(x.lowerLimit) + 1
                                      }`,
                                    ]
                                  : [
                                      "required",
                                      "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                      `minNumber:${
                                        x.isNoUpperLimit
                                          ? 0
                                          : parseFloat(x.lowerLimit) + 1
                                      }`,
                                    ]
                                : x.isNoUpperLimit
                                ? [
                                    "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                    `minNumber:${
                                      x.isNoUpperLimit
                                        ? 0
                                        : parseFloat(x.lowerLimit) + 1
                                    }`,
                                  ]
                                : [
                                    "required",
                                    "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                    `minNumber:${
                                      x.isNoUpperLimit
                                        ? 0
                                        : parseFloat(x.lowerLimit) + 1
                                    }`,
                                  ]
                            }
                            errorMessages={
                              temperatureConfigForm.positiveResponses
                                ? x.isNoUpperLimit
                                  ? [
                                      "Entered numbers are not valid",
                                      `Minimum allowed is ${
                                        x.isNoUpperLimit
                                          ? 0
                                          : parseFloat(x.lowerLimit) + 1
                                      }`,
                                    ]
                                  : [
                                      "Please enter lower limit",
                                      "Entered numbers are not valid",
                                      `Minimum allowed is ${
                                        x.isNoUpperLimit
                                          ? 0
                                          : parseFloat(x.lowerLimit) + 1
                                      }`,
                                    ]
                                : x.isNoUpperLimit
                                ? [
                                    "Entered numbers are not valid",
                                    `Minimum allowed is ${
                                      x.isNoUpperLimit
                                        ? 0
                                        : parseFloat(x.lowerLimit) + 1
                                    }`,
                                  ]
                                : [
                                    "Please enter lower limit",
                                    "Entered numbers are not valid",
                                    `Minimum allowed is ${
                                      x.isNoUpperLimit
                                        ? 0
                                        : parseFloat(x.lowerLimit) + 1
                                    }`,
                                  ]
                            }
                            fullWidth
                            id={`upperLimit_${i}`}
                            placeholder="Upper Limit"
                            name="upperLimit"
                            disabled={x.isNoUpperLimit}
                            value={x.upperLimit}
                            className="global-input"
                            onChange={(e) => handleInputChange(e, i)}
                          />
                        </Grid>
                        {temperatureConfigForm.positiveResponses.length - 1 ===
                          i && (
                          <Grid item xs={2} className="row-icons-container">
                            {
                              <FormControlLabel
                                control={<Checkbox name="isNoUpperLimit" />}
                                // onChange={handleChange}
                                onChange={(e) => handleInputChange(e, i)}
                                name="isNoUpperLimit"
                                label="No limit"
                                checked={x.isNoUpperLimit}
                              />
                            }
                          </Grid>
                        )}
                        <Grid item xs={1} className="row-icons-container">
                          {temperatureConfigForm.positiveResponses.length !==
                            1 && (
                            <Tooltip title="Remove">
                              <CancelIcon
                                className={`delete-row-icon`}
                                onClick={() => handleRemoveClick(i)}
                              ></CancelIcon>
                            </Tooltip>
                          )}
                          {!x.isNoUpperLimit
                            ? temperatureConfigForm.positiveResponses.length -
                                1 ===
                                i && (
                                <Tooltip title="Add">
                                  <AddCircleIcon
                                    className={`add-row-icon`}
                                    onClick={handleAddClick}
                                  ></AddCircleIcon>
                                </Tooltip>
                              )
                            : ""}
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })
              : ""}
            <br />
            <Grid item container xs={12}>
              <Grid item xs={3}>
                <label>&nbsp;</label>
              </Grid>
              <Grid item xs={9}>
                <div
                  className={`form-buttons-container`}
                  style={{ marginBottom: "9px" }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    className="global-submit-btn"
                    disabled={showLoadder}
                  >
                    {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
                  </Button>
                  <Button
                    variant="contained"
                    type="reset"
                    onClick={handleClickGoBackToPage}
                    className="global-cancel-btn"
                  >
                    Cancel
                  </Button>
                  &nbsp;
                </div>
              </Grid>
            </Grid>
          </ValidatorForm>
        )}
      </Paper>
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

QuestionnaireEvaluation.propTypes = {
  loadGlobalSettingWithoutAPICall: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    loadGlobalSettingsData: state.loadGlobalSettingsData,
  };
}

const mapDispatchToProps = {
  loadGlobalSettingWithoutAPICall:
    globalSettingAction.loadGlobalSettingWithoutAPICall,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionnaireEvaluation);
