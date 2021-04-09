import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import ToasterMessageComponent from "../../common/toaster";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import ComponentLoadderComponent from "../../common/loadder/componentloadder";
import FaqService from "../../../services/faqService";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Prompt } from "react-router-dom";
import * as globalSettingAction from "../../../Redux/Action/globalSettingAction";

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CovidStateApiServices from "../../../services/masterDataService";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import GlobalSettingApiServices from "../../../services/globalSettingService";
import AlertBoxComponent from "../../common/alert";

const useStyles = makeStyles((theme) => ({
  gridDispaly: {
    display: "inline-flex",
  },
}));

const languages = [{ id: "English", language: "English" }];

function TemperatureRange(props) {
  const CovidStateApi = new CovidStateApiServices();
  const GlobalSettingApi = new GlobalSettingApiServices();
  const faqApiCall = new FaqService();
  const classes = useStyles();
  // const getFaqId = props.match.params.id;
  // const getFaqIdSecId = props.match.params.secId;

  const uomTemp = [
    {
      id: "Farenheit",
      uomTempvalue: "Farenheit",
    },
    {
      id: "Celsius",
      uomTempvalue: "Celsius",
    },
  ];

  // const [faqId, setFaqId] = useState(getFaqId);
  // const [faqIdSecId, setFaqIdSecId] = useState(getFaqIdSecId);
  const [isFormSubmit, setisFormSubmit] = useState(false);
  const [muivalidatorForm, setmuivalidatorForm] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [covidStatelist, setcovidStatelist] = useState([]);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [globalsettingsId, setglobalsettingsId] = useState();
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [showLoadder, setshowLoadder] = useState(false);
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [tempsections, settempsections] = useState({
    id: "",
    globalSettingsId: globalsettingsId,
    temperatureUnit: "",
    covidStates: [
      {
        id: "",
        lowerLimit: 0,
        upperLimit: 0,
        covidState: {
          id: "",
          stateName: "",
        },
      },
    ],
  });

  useEffect(() => {
    Promise.all([
      CovidStateApi.getCOVIDStates(),
      GlobalSettingApi.getLoadGlobalSetting(),
    ])
      .then(([result, globalSettings]) => {
        setcovidStatelist(result);
        console.log(globalSettings.covidStateTemperatures);
        console.log(tempsections.covidStates);
        tempsections.covidStates = globalSettings.covidStateTemperatures;
        console.log(globalSettings.id);
        tempsections.globalSettingsId = globalSettings.id;
        tempsections.temperatureUnit = globalSettings.temperatureUnit;
        setComponentLoadder(false);
      })
      .catch((err) => {
        console.log("eror");
        console.log(err);
      });
    // setComponentLoadder(false);
  }, []);

  function handleChangeInput(e) {
    const { name, value } = e.target;
    settempsections((tempsections) => ({
      ...tempsections,
      [name]: value,
    }));
  }

  const handleInputChangeContacts = (e, index) => {
    const { name, value } = e.target;
    const list = {
      ...tempsections,
      covidStates: [
        ...tempsections.covidStates.map((con, conIndex) => {
          if (name == "upperLimit" || name == "lowerLimit") {
            return conIndex == index ? { ...con, [name]: value } : con;
          } else {
            return conIndex == index ? { ...con, [name]: value } : con;
          }
        }),
      ],
    };

    // parseFloat(settempsections(list));
    settempsections(list);
  };

  function handleChangeCovidState(e, value, index) {
    let thisValue = { id: value.id, state: value.stateName };
    const list = {
      ...tempsections,
      covidStates: [
        ...tempsections.covidStates.map((con, conIndex) =>
          conIndex == index
            ? {
                ...con,
                ["covidState"]: thisValue,
              }
            : con
        ),
      ],
    };
    settempsections(list);
  }

  const handleRemoveClickContacts = (j) => {
    const list = { ...tempsections };
    list.covidStates.splice(j, 1);
    settempsections(list);
  };

  const handleAddClickContacts = (index, j) => {
    const list = { ...tempsections };
    const thistempsections = list.covidStates;
    list.covidStates = [
      ...thistempsections,
      {
        id: "",
        lowerLimit: 0,
        upperLimit: 0,
        covidState: {
          id: "",
          stateName: "",
        },
      },
    ];
    settempsections(list);
  };

  function handleClickGoBackToPage() {
    props.history.push("/");
  }

  function submitForm(e) {
    e.preventDefault();
    setshowLoadder(true);
    setisFormSubmit(true);
    console.log("tempsections");
    console.log(tempsections.covidStates[0].lowerLimit);
    let sendData = tempsections;

    let getCovidStates = sendData.covidStates;
    getCovidStates.forEach((item) => {
      item.upperLimit = parseFloat(item.upperLimit);
      item.lowerLimit = parseFloat(item.lowerLimit);
    });
    sendData.covidStates = getCovidStates;

    console.log(JSON.stringify(sendData));

    // sendData.lowerLimit = parseInt(tempsections.lowerLimit);
    // sendData.upperLimit = parseInt(tempsections.upperLimit);

    // GlobalSettingApi.UpdateCovidStateTemperature(sendData)
    props
      .updateTemp(sendData)
      .then((result) => {
        console.log("success");
        setStateSnackbar(true);
        setToasterMessage("Updated temperature range settings.");
        settoasterServerity("success");
        setisAlertBoxOpened(false);
        setTimeout(() => {
          setshowLoadder(false);
        }, 6000);
      })
      .catch((err) => {
        console.log(err);
        // setToasterMessage(err.data.errors);
        // settoasterServerity("error");
        // setStateSnackbar(true);
        setshowLoadder(false);
        // throw err;
      });
    // ValidateSubmitForm();
  }

  function ValidateSubmitForm() {
    setshowLoadder(true);
    let sendData = tempsections;
  }

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  return (
    <div className="innerpage-container">
      <AlertBoxComponent isAlertBoxOpened={isAlertBoxOpened} />
      <Breadcrumbs aria-label="breadcrumb" className="global-breadcrumb">
        <LinkTo
          color="inherit"
          href="#"
          to={`/home/dashboard`}
          className="inactive"
        >
          Home
        </LinkTo>
        <LinkTo color="textPrimary" href="#" to="#" className="inactive">
          Temperature Range
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <Paper className="main-paper">
          <ValidatorForm className={`global-form`} onSubmit={submitForm}>
            <Grid container spacing={3}>
              <Grid
                item
                container
                xs={12}
                className={[classes.gridDispaly].join(" ")}
                container
                spacing={1}
              >
                <Grid container item xs={3}>
                  <label className="required">UoM for temperature</label>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel
                      id="demo-simple-select-outlined-label"
                      shrink={false}
                      className="select-label"
                    >
                      {tempsections.temperatureUnit == ""
                        ? "Select temperatures"
                        : ""}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={tempsections.temperatureUnit}
                      name="temperatureUnit"
                      onChange={handleChangeInput}
                      placeholder="dsfs"
                      required
                      InputLabelProps={{ shrink: false }}
                      className="global-input single-select"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {uomTemp.length > 0
                        ? uomTemp.map((tempvalue) => {
                            return (
                              <MenuItem key={tempvalue.id} value={tempvalue.id}>
                                {tempvalue.uomTempvalue}
                              </MenuItem>
                            );
                          })
                        : ""}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            {tempsections.covidStates && tempsections.covidStates.length > 0
              ? tempsections.covidStates.map((x, i) => {
                  return (
                    <Grid container spacing={3}>
                      <Grid
                        container
                        spacing={1}
                        item
                        xs={12}
                        className={[classes.gridDispaly].join(" ")}
                        key={`section-container${i}`}
                      >
                        <Grid item xs={3}>
                          <label className="required">Select COVID state</label>
                        </Grid>
                        <Grid item xs={2}>
                          <Autocomplete
                            id="tags-outlined"
                            // /options={teamManagers}
                            options={
                              covidStatelist && covidStatelist.length > 0
                                ? covidStatelist
                                : []
                            }
                            getOptionLabel={(option) => option.stateName}
                            onChange={(e, v) => handleChangeCovidState(e, v, i)}
                            defaultValue={
                              tempsections.covidStates
                                ? tempsections.covidStates
                                : []
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
                        </Grid>

                        <Grid item xs={2}>
                          <TextValidator
                            variant="outlined"
                            validators={["required"]}
                            errorMessages={["Please enter lower limit"]}
                            validators={[
                              "required",
                              "matchRegexp:^\\d{1,2}(\\.\\d{1,2})?$",
                              "maxNumber:999999",
                            ]}
                            errorMessages={[
                              "Please enter lower limit",
                              "Entered numbers are not valid",
                            ]}
                            id={`lowerLimit_${i}`}
                            placeholder="Lower Limit"
                            name="lowerLimit"
                            value={x.lowerLimit}
                            onChange={(e) => handleInputChangeContacts(e, i)}
                            className="global-input"
                            InputLabelProps={{ shrink: false }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  F
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextValidator
                            variant="outlined"
                            errorMessages={["Please enter lower limit"]}
                            validators={[
                              "required",
                              "matchRegexp:^\\d{1,2}(\\.\\d{1,2})?$",
                              "maxNumber:999999",
                            ]}
                            errorMessages={[
                              "Please enter lower limit",
                              "Entered numbers are not valid",
                            ]}
                            id={`upperLimit_${i}`}
                            placeholder="Upper Limit"
                            name="upperLimit"
                            value={x.upperLimit}
                            onChange={(e) => handleInputChangeContacts(e, i)}
                            className="global-input"
                            InputLabelProps={{ shrink: false }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  F
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
                          {tempsections.covidStates.length !== 1 && (
                            <Tooltip title="Remove">
                              <CancelIcon
                                className={`delete-row-icon`}
                                onClick={() => handleRemoveClickContacts(i)}
                              ></CancelIcon>
                            </Tooltip>
                          )}
                          {tempsections.covidStates.length - 1 === i && (
                            <Tooltip title="Add">
                              <AddCircleIcon
                                className={`add-row-icon`}
                                onClick={handleAddClickContacts}
                              ></AddCircleIcon>
                            </Tooltip>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })
              : ""}
            {isFormSubmit && !tempsections.covidStates ? (
              <FormHelperText className={classes.errorSpanMsg}>
                Please select value{" "}
              </FormHelperText>
            ) : (
              ""
            )}
            <Grid item container xs={12}>
              <Grid item xs={3}>
                <label>&nbsp;</label>
              </Grid>
              <Grid item xs={9}>
                <div className={`form-buttons-container`}>
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
                </div>
              </Grid>
            </Grid>
          </ValidatorForm>
        </Paper>
      ) : (
        <ComponentLoadderComponent />
      )}
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

TemperatureRange.propTypes = {
  updateTemp: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    loadGlobalSettingsData: state.temperaturerangeState,
  };
}

const mapDispatchToProps = {
  updateTemp: globalSettingAction.updateTemp,
};

// export default TemperatureRange;
export default connect(mapStateToProps, mapDispatchToProps)(TemperatureRange);
