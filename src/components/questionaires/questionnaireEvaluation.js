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

const useStyles = makeStyles((theme) => ({
  gridDispaly: {
    display: "inline-flex",
  },
}));

function QuestionnaireEvaluation(props) {
  const classes = useStyles();
  const CovidStateApi = new CovidStateApiServices();
  const questionaireApiCall = new questionaireService();
  const { id } = useParams();
  const [showLoadder, setshowLoadder] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [covidStatelist, setcovidStatelist] = useState([]);
  const [formData, SetformData] = useState({
    id: "",
    lowerLimit: 0,
    upperLimit: 0,
    globalSettingsId: "",
    covidState: {
      id: "",
      stateName: "",
    },
  });
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [selectedcovidState, setSelectedCovidState] = useState();
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
      CovidStateApi.getCOVIDStates(),
      questionaireApiCall.GetEvaluationId(id),
    ])
      .then(([covidstateRes, getEvaluationDetails]) => {
        setcovidStatelist(covidstateRes);
        if (getEvaluationDetails && getEvaluationDetails.id) {
          setTemperatureConfigForm(getEvaluationDetails);
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

  const handleInputChangeContacts = (e, index) => {
    const { name, value } = e.target;
    const list = {
      ...temperatureConfigForm,
      positiveResponses: [
        ...temperatureConfigForm.positiveResponses.map((con, conIndex) => {
          if (name == "upperLimit" || name == "lowerLimit") {
            return conIndex == index ? { ...con, [name]: value } : con;
          } else {
            return conIndex == index ? { ...con, [name]: value } : con;
          }
        }),
      ],
    };
    setTemperatureConfigForm(list);
  };

  const handleRemoveClick = (j) => {
    const list = { ...temperatureConfigForm };
    list.positiveResponses.splice(j, 1);
    setTemperatureConfigForm(list);
  };
  function handleChange(e) {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;

    SetformData((emergencyContact) => ({
      ...emergencyContact,
      [name]: value,
    }));
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
      },
    ];
    setTemperatureConfigForm(list);
  };

  function submitForm(e) {
    e.preventDefault();
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
          console.log("success");
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
          Questionaire
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Questionnaire Evaluation
        </LinkTo>
      </Breadcrumbs>
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
                        <Grid item xs={2}>
                          <TextValidator
                            variant="outlined"
                            validators={["required", "maxNumber:99"]}
                            errorMessages={[
                              "Please enter lower limit",
                              "Entered numbers are not valid",
                            ]}
                            fullWidth
                            id={`lowerLimit_${i}`}
                            placeholder="Lower Limit"
                            name="lowerLimit"
                            value={x.lowerLimit}
                            className="global-input"
                            onChange={(e) => handleInputChangeContacts(e, i)}
                            InputLabelProps={{ shrink: false }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {props.loadGlobalSettingsData
                                    ? props.loadGlobalSettingsData
                                        .temperatureUnit
                                    : ""}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextValidator
                            variant="outlined"
                            validators={["required", "maxNumber:99"]}
                            errorMessages={[
                              "Please enter upper limit",
                              "Entered numbers are not valid",
                            ]}
                            fullWidth
                            id={`upperLimit_${i}`}
                            placeholder="Upper Limit"
                            name="upperLimit"
                            value={x.upperLimit}
                            className="global-input"
                            onChange={(e) => handleInputChangeContacts(e, i)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {props.loadGlobalSettingsData
                                    ? props.loadGlobalSettingsData
                                        .temperatureUnit
                                    : ""}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={2} className="row-icons-container">
                          {
                            <FormControlLabel
                              control={<Checkbox name="checkedA" />}
                              label="No limit"
                            />
                          }
                        </Grid>
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
                          {temperatureConfigForm.positiveResponses.length -
                            1 ===
                            i && (
                            <Tooltip title="Add">
                              <AddCircleIcon
                                className={`add-row-icon`}
                                onClick={handleAddClick}
                              ></AddCircleIcon>
                            </Tooltip>
                          )}
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
                    // onClick={redirectToViewUsersGroup}
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
