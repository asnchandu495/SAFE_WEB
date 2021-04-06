import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import HomeIcon from "@material-ui/icons/Home";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import Link from "@material-ui/core/Link";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Link as LinkTo, useParams } from "react-router-dom";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ToasterMessageComponent from "../common/toaster";

import GlobalSettingApiServices from "../../services/globalSettingService";
import CovidStateApiServices from "../../services/masterDataService";
import questionaireService from "../../services/questionaireService";

const CovidStateApi = new CovidStateApiServices();
const useStyles = makeStyles((theme) => ({
  gridDispaly: {
    display: "inline-flex",
  },
}));
function QuestionnaireEvaluation(props) {
  const classes = useStyles();
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
        // .then((covidstateRes) => {
        console.log(getEvaluationDetails);
        setcovidStatelist(covidstateRes);
        temperatureConfigForm.positiveConformityScore =
          getEvaluationDetails.positiveConformityScore;
      })
      .catch((err) => {
        console.log(err);
        // throw err;
      });
  }, []);
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...temperatureConfigForm];
    list[index][name] = value;
    setTemperatureConfigForm(list);
  };

  function handleChangeInput(e) {
    const { name, value } = e.target;
    setTemperatureConfigForm((tempsections) => ({
      ...tempsections,
      [name]: value,
    }));
  }

  function handleChangeCovidState(e, value, index) {
    let thisValue = { id: value.id, state: value.stateName };
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
            return conIndex == index
              ? { ...con, [name]: parseInt(value) }
              : con;
          } else {
            return conIndex == index ? { ...con, [name]: value } : con;
          }
        }),
      ],
    };
    setTemperatureConfigForm(list);
  };
  // const handleRemoveClick = (index) => {
  //   const list = [...temperatureConfigForm];
  //   list.splice(index, 1);
  //   setTemperatureConfigForm(list);
  // };
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
  // handle click event of the Add button
  // const handleAddClick = () => {
  //   setTemperatureConfigForm([
  //     ...temperatureConfigForm,
  //     {
  //       id: Math.random().toString(36).substring(7),
  //       covidState: "",
  //       lowerLimit: "",
  //       upperLimit: "",
  //     },
  //   ]);
  // };

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
    console.log("data");
    var formData = temperatureConfigForm;
    console.log(JSON.stringify(formData));
    questionaireApiCall
      .AddEvaluationResultForQuestionnaire(formData)
      .then((response) => {
        console.log("success");
        setStateSnackbar(true);
        setToasterMessage("created evalauation settings.");
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
        <LinkTo color="textPrimary" href="#" className="active">
          Questionnaire Evaluation
        </LinkTo>
      </Breadcrumbs>
      <Paper className={`main-paper`}>
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
                    "matchRegexp:^.{0,50}$",
                  ]}
                  errorMessages={[
                    "Please positive conformity score",
                    "Special charcters are not allowed",
                    "Maximum 50 characters",
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
                    // /options={teamManagers}
                    options={
                      covidStatelist && covidStatelist.length > 0
                        ? covidStatelist
                        : []
                    }
                    getOptionLabel={(option) => option.stateName}
                    onChange={(e, v) => handleChangeCovidState(e, v)}
                    // defaultValue={formData.manager ? formData.manager : {}}
                    // defaultValue={formData.covidState}
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
                          {/* <InputLabel
                        id="demo-simple-select-outlined-label"
                        shrink={false}
                        className="select-label"
                      >
                        {formData.covidState == "" ? "Select covid state" : ""}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        name="covidState"
                        placeholder=""
                        className="global-input single-select"
                        InputLabelProps={{ shrink: false }}
                        value={x.covidState}
                        onChange={(e) => handleInputChange(e, i)}
                      >
                        <MenuItem value="">None</MenuItem>
                        {covidStatelist
                          ? covidStatelist.map((cState) => {
                              return (
                                <MenuItem value={cState.id}>
                                  {cState.stateName}
                                </MenuItem>
                              );
                            })
                          : ""}
                      </Select> */}
                          <Autocomplete
                            id="tags-outlined"
                            // /options={teamManagers}
                            options={
                              covidStatelist && covidStatelist.length > 0
                                ? covidStatelist
                                : []
                            }
                            getOptionLabel={(option) => option.stateName}
                            // onChange={(e) => handleInputChange(e, i)}
                            onChange={(e, v) => handleChangeCovidState(e, v, i)}
                            defaultValue={
                              temperatureConfigForm.positiveResponses
                                ? temperatureConfigForm.positiveResponses
                                : []
                            }
                            // defaultValue={formData.manager ? formData.manager : {}}
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
                          validators={["required"]}
                          errorMessages={["Please enter lower limit"]}
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
                              <InputAdornment position="end">F</InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextValidator
                          variant="outlined"
                          validators={["required"]}
                          errorMessages={["Please enter upper limit"]}
                          fullWidth
                          id={`upperLimit_${i}`}
                          placeholder="Upper Limit"
                          name="upperLimit"
                          value={x.upperLimit}
                          className="global-input"
                          onChange={(e) => handleInputChangeContacts(e, i)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">F</InputAdornment>
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
                        {temperatureConfigForm.positiveResponses.length - 1 ===
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

export default QuestionnaireEvaluation;
