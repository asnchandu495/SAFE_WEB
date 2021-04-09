import React, { Fragment, useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Prompt } from "react-router-dom";
import ToasterMessageComponent from "../../common/toaster";
import AlertBoxComponent from "../../common/alert";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import ComponentLoadderComponent from "../../common/loadder/componentloadder";
import * as globalSettingAction from "../../../Redux/Action/globalSettingAction";
import GlobalSettingApiServices from "../../../services/globalSettingService";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";

import OutlinedInput from "@material-ui/core/OutlinedInput";

const useStyles = makeStyles((theme) => ({
  gridDispaly: {
    display: "inline-flex",
  },
}));

function GlobalSetting(props) {
  const classes = useStyles();
  const [showLoadder, setshowLoadder] = useState(false);
  const GlobalSettingApi = new GlobalSettingApiServices();

  const [isFormSubmit, setisFormSubmit] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [formData, SetformData] = useState({
    id: "",
    geoFencingTolerance: 0,
    geoFencingToleranceUnit: "",
    frequencyOfGeoLocation: 0,
    frequencyOfGeoLocationUnit: "",
    facialTolerance: 0.0,
    socialDistanceTolerance: 0,
    socialDistanceToleranceUnit: "",
    fileFormatToImportUsers: "",
    timeFormat: "",
    dateFormat: "",

    automatedCheckoutTime: 0,
    selfHealthCheckReminder: 0,
    selfHealthCheckReminderUnit: "",
    durationToLockUserAccount: 0,
    maxPasswordlength: 0,
    allowCheckinWithoutWFHLocationApproval: true,
    allowCheckinWithoutProfileSelfieApproval: true,
    maximumFileSizeOfUserSelfieUnit: "MB",
    maximumFileSizeOfUserSelfie: 0,
    // maximumFileSizeToImportUsersUnit: "",
    // temperatureUnit: "",
  });
  const [geoUnits, setGeoUnits] = useState([]);
  const [toleranceUnits, setToleranceUnits] = useState([]);
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date("2014-08-18T21:11:54")
  );
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const fileFormat = [
    { id: "xls", format: "xls" },
    { id: "csv", format: "csv" },
  ];

  const selfReminder = [
    {
      id: "Minute",
      selfvalue: "Minute",
    },
    {
      id: "Hours",
      selfvalue: "Hours",
    },
  ];

  const datesFormat = [
    {
      id: "dd/mm/yyyy",
      formatvalue: "dd/mm/yyyy",
    },
    {
      id: "mm/dd/yyyy",
      formatvalue: "mm/dd/yyyy",
    },
    {
      id: "dddd/mmmm/yyyy",
      formatvalue: "dddd/mmmm/yyyy",
    },
    {
      id: "mmmm/dddd/yyyy",
      formatvalue: "mmmm/dddd/yyyy",
    },
    {
      id: "ddd/mmm/yyyy",
      formatvalue: "ddd/mmm/yyyy",
    },
    {
      id: "mmm/ddd/yyyy",
      formatvalue: "mmm/ddd/yyyy",
    },
  ];
  const timeFormat = [
    {
      id: "hh:mm a",
      value: "12 Hours",
    },
    {
      id: "hh:mm",
      value: "24 Hours",
    },
  ];

  useEffect(() => {
    Promise.all([
      GlobalSettingApi.getLoadGlobalSetting(),
      GlobalSettingApi.FrequencytoFetchGeoUnits(),
      GlobalSettingApi.GetGeoFencingToleranceUnits(),
    ])
      .then(([globalSettings, getGeoUnits, getToleranceUnits]) => {
        setGeoUnits(getGeoUnits);
        setToleranceUnits(getToleranceUnits);
        SetformData(globalSettings);
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChangecheckBox = (event) => {
    SetformData((formData) => ({
      ...formData,
      ["allowCheckinWithoutWFHLocationApproval"]: event.target.checked,
    }));
  };

  const handleChangeSelfiecheckBox = (e) => {
    SetformData((formData) => ({
      ...formData,
      ["allowCheckinWithoutProfileSelfieApproval"]: e.target.checked,
    }));
  };
  function GlobalSettingForm(e) {
    e.preventDefault();
    setshowLoadder(true);
    setisFormSubmit(true);
    // console.log("data");
    // console.log(JSON.stringify(formData));
    // return false;
    let finalData = formData;
    finalData.socialDistanceTolerance = parseInt(
      formData.socialDistanceTolerance
    );
    finalData.maxPasswordlength = parseInt(formData.maxPasswordlength);
    finalData.durationToLockUserAccount = parseInt(
      formData.durationToLockUserAccount
    );
    finalData.automatedCheckoutTime = parseInt(formData.automatedCheckoutTime);
    finalData.selfHealthCheckReminder = parseInt(
      formData.selfHealthCheckReminder
    );
    finalData.frequencyOfGeoLocation = parseInt(
      formData.frequencyOfGeoLocation
    );
    finalData.geoFencingTolerance = parseInt(formData.geoFencingTolerance);
    let finalFacialRecVal = parseFloat(formData.facialTolerance);
    finalData.facialTolerance = finalFacialRecVal;

    finalData.maximumFileSizeOfUserSelfie = parseInt(
      formData.maximumFileSizeOfUserSelfie
    );

    props
      .createGlobalSetting(finalData)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Updated Global settings.");
        settoasterServerity("success");
        setisAlertBoxOpened(false);
        setTimeout(() => {
          setshowLoadder(false);
        }, 6000);
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
        setshowLoadder(false);
      });
  }

  function handleChange(e) {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    SetformData((logInForm) => ({
      ...logInForm,
      [name]: value,
    }));
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
        <LinkTo color="textPrimary" href="#" className="active">
          Global Setting
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder ? (
        <ComponentLoadderComponent />
      ) : (
        <Paper className={`main-paper`}>
          <ValidatorForm className={`global-form`} onSubmit={GlobalSettingForm}>
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                className={[classes.gridDispaly].join(" ")}
                container
                spacing={1}
              >
                <Grid item xs={3}>
                  <label className="required">Geo Fencing Tolerance</label>
                </Grid>
                <Grid item xs={3}>
                  <TextValidator
                    variant="outlined"
                    validators={[
                      "required",
                      "matchRegexp:^[0-9]*$",
                      "maxNumber:999",
                    ]}
                    errorMessages={[
                      "Please enter geo fencing tolerance",
                      "Only numbers are allowed",
                      "Maximum allowed 3 digits",
                    ]}
                    fullWidth
                    placeholder="Geo Fencing Tolerance"
                    id="geoFencingTolerance"
                    name="geoFencingTolerance"
                    onChange={handleChange}
                    value={formData.geoFencingTolerance}
                    className="global-input"
                    InputLabelProps={{ shrink: false }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel
                      id="demo-simple-select-outlined-label"
                      shrink={false}
                      className="select-label"
                    >
                      {formData.geoFencingToleranceUnit == "" ? "Select" : ""}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={formData.geoFencingToleranceUnit}
                      name="geoFencingToleranceUnit"
                      onChange={handleChange}
                      placeholder="Select"
                      required
                      InputLabelProps={{ shrink: false }}
                      className="global-input single-select"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {toleranceUnits.length > 0
                        ? toleranceUnits.map((tol) => {
                            return (
                              <MenuItem
                                key={`factol_${tol.geoFencingToleranceUnit}`}
                                value={tol.geoFencingToleranceUnit}
                              >
                                {tol.geoFencingToleranceUnit}
                              </MenuItem>
                            );
                          })
                        : ""}
                    </Select>
                  </FormControl>
                  {isFormSubmit && !formData.geoFencingToleranceUnit ? (
                    <FormHelperText className={classes.errorSpanMsg}>
                      Please select value{" "}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                className={[classes.gridDispaly].join(" ")}
                container
                spacing={1}
              >
                <Grid item xs={3}>
                  <label className="required">
                    Frequencey to fetch the geo co ordinates:Once in every
                  </label>
                </Grid>
                <Grid item xs={3}>
                  <TextValidator
                    variant="outlined"
                    validators={[
                      "required",
                      "matchRegexp:^[0-9]*$",
                      "maxNumber:999",
                    ]}
                    errorMessages={[
                      "Please enter frequencey to fetch the geo co ordinates",
                      "Only numbers are allowed",
                      "Maximum allowed 3 digits",
                    ]}
                    fullWidth
                    id="frequencyOfGeoLocation"
                    placeholder="Geo cordinates"
                    name="frequencyOfGeoLocation"
                    onChange={handleChange}
                    value={formData.frequencyOfGeoLocation}
                    className="global-input"
                    InputLabelProps={{ shrink: false }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel
                      id="demo-simple-select-outlined-label"
                      shrink={false}
                      className="select-label"
                    >
                      {formData.frequencyOfGeoLocationUnit == ""
                        ? "Select"
                        : ""}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={formData.frequencyOfGeoLocationUnit}
                      name="frequencyOfGeoLocationUnit"
                      onChange={handleChange}
                      placeholder="Select"
                      required
                      InputLabelProps={{ shrink: false }}
                      className="global-input single-select"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={"Minutes"}>Minutes</MenuItem>
                      <MenuItem value={"Seconds"}>Seconds</MenuItem>
                    </Select>
                  </FormControl>
                  {isFormSubmit && !formData.frequencyOfGeoLocationUnit ? (
                    <FormHelperText className={classes.errorSpanMsg}>
                      Please select value{" "}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                className={[classes.gridDispaly].join(" ")}
                container
                spacing={1}
              >
                <Grid item xs={3}>
                  <label className="required">
                    Social distancing tolerance
                  </label>
                </Grid>
                <Grid item xs={3}>
                  <TextValidator
                    variant="outlined"
                    validators={[
                      "required",
                      "matchRegexp:^[0-9]*$",
                      "maxNumber:999",
                    ]}
                    errorMessages={[
                      "Please enter social distancing tolerance",
                      "Only numbers are allowed",
                      "Maximum allowed 3 digits",
                    ]}
                    fullWidth
                    id="socialDistanceTolerance"
                    placeholder="Social distancing"
                    name="socialDistanceTolerance"
                    onChange={handleChange}
                    value={formData.socialDistanceTolerance}
                    className="global-input"
                    InputLabelProps={{ shrink: false }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel
                      id="demo-simple-select-outlined-label"
                      shrink={false}
                      className="select-label"
                    >
                      {formData.socialDistanceToleranceUnit == ""
                        ? "Select"
                        : ""}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={formData.socialDistanceToleranceUnit}
                      name="socialDistanceToleranceUnit"
                      onChange={handleChange}
                      placeholder="Select"
                      required
                      InputLabelProps={{ shrink: false }}
                      className="global-input single-select"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {toleranceUnits.length > 0
                        ? toleranceUnits.map((tol) => {
                            return (
                              <MenuItem
                                key={`soctol_${tol.geoFencingToleranceUnit}`}
                                value={tol.geoFencingToleranceUnit}
                              >
                                {tol.geoFencingToleranceUnit}
                              </MenuItem>
                            );
                          })
                        : ""}
                    </Select>
                  </FormControl>
                  {isFormSubmit && !formData.socialDistanceToleranceUnit ? (
                    <FormHelperText className={classes.errorSpanMsg}>
                      Please select value{" "}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                className={[classes.gridDispaly].join(" ")}
                container
                spacing={1}
              >
                <Grid item xs={3}>
                  <label className="required">
                    Facial recognition tolerance
                  </label>
                </Grid>
                <Grid item xs={3}>
                  <TextValidator
                    variant="outlined"
                    validators={["required"]}
                    validators={[
                      "required",
                      "matchRegexp:^\\d{1,2}(\\.\\d{1,2})?$",
                    ]}
                    errorMessages={[
                      "Please enter facial recognition tolerance",
                      "Only numbers and decimals are allowed",
                    ]}
                    fullWidth
                    id="facialTolerance"
                    placeholder="Facial recognition tolerance"
                    name="facialTolerance"
                    onChange={handleChange}
                    value={formData.facialTolerance}
                    className="global-input"
                    InputLabelProps={{ shrink: false }}
                  />
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                className={[classes.gridDispaly].join(" ")}
                container
                spacing={1}
              >
                <Grid item xs={3}>
                  <label className="required">Date Format</label>
                </Grid>

                <Grid item xs={2}>
                  <FormControl variant="outlined" fullWidth>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={formData.dateFormat}
                      name="dateFormat"
                      onChange={handleChange}
                      placeholder="Select"
                      required
                      InputLabelProps={{ shrink: false }}
                      className="global-input single-select"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {datesFormat.length > 0
                        ? datesFormat.map((datevalue) => {
                            return (
                              <MenuItem
                                key={datevalue.id}
                                value={datevalue.formatvalue}
                              >
                                {datevalue.formatvalue}
                              </MenuItem>
                            );
                          })
                        : ""}
                    </Select>
                  </FormControl>
                  {isFormSubmit && !formData.dateFormat ? (
                    <FormHelperText className={classes.errorSpanMsg}>
                      Please select value{" "}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                className={[classes.gridDispaly].join(" ")}
                container
                spacing={1}
              >
                <Grid item xs={3}>
                  <label className="required">Times Format</label>
                </Grid>

                <Grid item xs={2}>
                  <FormControl variant="outlined" fullWidth>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={formData.timeFormat}
                      name="timeFormat"
                      onChange={handleChange}
                      placeholder="Select"
                      required
                      InputLabelProps={{ shrink: false }}
                      className="global-input single-select"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {timeFormat.length > 0
                        ? timeFormat.map((timevalue) => {
                            return (
                              <MenuItem
                                key={timevalue.id}
                                value={timevalue.value}
                              >
                                {timevalue.value}
                              </MenuItem>
                            );
                          })
                        : ""}
                    </Select>
                  </FormControl>
                  {isFormSubmit && !formData.timeFormat ? (
                    <FormHelperText className={classes.errorSpanMsg}>
                      Please select value{" "}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                className={[classes.gridDispaly].join(" ")}
                container
                spacing={1}
              >
                <Grid item xs={3}>
                  <label className="required">
                    File format to import users details:
                  </label>
                </Grid>

                {/* <Grid item xs={3}>
                  <TextValidator
                    variant="outlined"
                    validators={[
                      "required",
                      "matchRegexp:^[0-9]*$",
                      "maxNumber:999",
                    ]}
                    errorMessages={[
                      "Please enter maximumFileSizeToImportUsersUnit",
                      "Only numbers are allowed",
                      "Maximum allowed 3 digits",
                    ]}
                    fullWidth
                    id="maximumFileSizeToImportUsersUnit"
                    placeholder=""
                    name="maximumFileSizeToImportUsersUnit"
                    onChange={handleChange}
                    value={formData.maximumFileSizeToImportUsersUnit}
                    className="global-input"
                    InputLabelProps={{ shrink: false }}
                  />
                </Grid> */}

                <Grid item xs={2}>
                  <FormControl variant="outlined" fullWidth>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={formData.fileFormatToImportUsers}
                      name="fileFormatToImportUsers"
                      onChange={handleChange}
                      placeholder="Select"
                      required
                      InputLabelProps={{ shrink: false }}
                      className="global-input single-select"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {fileFormat.length > 0
                        ? fileFormat.map((fol) => {
                            return (
                              <MenuItem key={fol.id} value={fol.format}>
                                {fol.format}
                              </MenuItem>
                            );
                          })
                        : ""}
                    </Select>
                  </FormControl>
                  {isFormSubmit && !formData.fileFormatToImportUsers ? (
                    <FormHelperText
                      className={classes.errorSpanMsg}
                    ></FormHelperText>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>

              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label>Unlock duration of user account</label>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="outlined">
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      name="durationToLockUserAccount"
                      type={"text"}
                      value={
                        formData.durationToLockUserAccount
                          ? formData.durationToLockUserAccount
                          : ""
                      }
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">Minutes</InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      labelWidth={0}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2}></Grid>
              </Grid>

              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">Automated check-out time</label>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="outlined">
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      validators={[
                        "required",
                        "matchRegexp:^\\d{1,2}(\\.\\d{1,2})?$",
                      ]}
                      errorMessages={[
                        "Please enter automated check-out time",
                        "Only numbers and decimals are allowed",
                      ]}
                      name="automatedCheckoutTime"
                      type={"text"}
                      value={
                        formData.automatedCheckoutTime
                          ? formData.automatedCheckoutTime
                          : ""
                      }
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">Hours</InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      labelWidth={0}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2}></Grid>
              </Grid>

              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">Minimum password length</label>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="outlined">
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      name="maxPasswordlength"
                      type={"text"}
                      value={
                        formData.maxPasswordlength
                          ? formData.maxPasswordlength
                          : ""
                      }
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          Characters
                        </InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      labelWidth={0}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2}></Grid>
              </Grid>

              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">
                    Maximum filesize of userSelfie unit
                  </label>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="outlined">
                    <OutlinedInput
                      validators={[
                        "required",
                        "matchRegexp:^[0-9]*$",
                        "maxNumber:999",
                      ]}
                      errorMessages={[
                        "Please enter filesize of userSelfie unit",
                        "Only numbers are allowed",
                        "Maximum allowed 3 digits",
                      ]}
                      id="outlined-adornment-weight"
                      name="maximumFileSizeOfUserSelfie"
                      type={"text"}
                      value={
                        formData.maximumFileSizeOfUserSelfie
                          ? formData.maximumFileSizeOfUserSelfie
                          : ""
                      }
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">MB</InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      labelWidth={0}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2}></Grid>
              </Grid>
              <Grid
                item
                xs={12}
                className={[classes.gridDispaly].join(" ")}
                container
                spacing={1}
              >
                <Grid item xs={3}>
                  <label className="required">Self health check reminder</label>
                </Grid>
                <Grid item xs={3}>
                  <TextValidator
                    variant="outlined"
                    validators={[
                      "required",
                      "matchRegexp:^\\d{1,6}(\\.\\d{1,2})?$",
                    ]}
                    errorMessages={[
                      "Please enter self healthcheck reminder",
                      "Only numbers and decimals are allowed",
                    ]}
                    fullWidth
                    id="selfHealthCheckReminder"
                    placeholder=""
                    name="selfHealthCheckReminder"
                    onChange={handleChange}
                    value={formData.selfHealthCheckReminder}
                    className="global-input"
                    InputLabelProps={{ shrink: false }}
                  />
                </Grid>

                <Grid item xs={2}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel
                      id="demo-simple-select-outlined-label"
                      shrink={false}
                      className="select-label"
                    >
                      {formData.selfHealthCheckReminder == "" ? "" : ""}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={formData.selfHealthCheckReminderUnit}
                      name="selfHealthCheckReminderUnit"
                      onChange={handleChange}
                      placeholder=""
                      required
                      InputLabelProps={{ shrink: false }}
                      className="global-input single-select"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {selfReminder.length > 0
                        ? selfReminder.map((tol) => {
                            return (
                              <MenuItem key={tol.id} value={tol.selfvalue}>
                                {tol.selfvalue}
                              </MenuItem>
                            );
                          })
                        : ""}
                    </Select>
                  </FormControl>
                  {isFormSubmit && !formData.selfHealthCheckReminderUnit ? (
                    <FormHelperText
                      className={classes.errorSpanMsg}
                    ></FormHelperText>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                className={[classes.gridDispaly].join(" ")}
                container
                spacing={1}
              >
                <Grid item xs={3}>
                  <label>
                    Allow exceptional check-in when WFHL request is in pending
                    status
                  </label>
                </Grid>

                <Grid item xs={2}>
                  <Checkbox
                    checked={formData.allowCheckinWithoutWFHLocationApproval}
                    onChange={handleChangecheckBox}
                    value={formData.allowCheckinWithoutWFHLocationApproval}
                    inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                  />
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                className={[classes.gridDispaly].join(" ")}
                container
                spacing={1}
              >
                <Grid item xs={3}>
                  <label className="required">
                    Allow exceptional check-in when Profile selfie request is in
                    pending status
                  </label>
                </Grid>

                <Grid item xs={2}>
                  <Checkbox
                    checked={formData.allowCheckinWithoutProfileSelfieApproval}
                    onChange={handleChangeSelfiecheckBox}
                    value={formData.allowCheckinWithoutProfileSelfieApproval}
                    inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                  />
                </Grid>
              </Grid>

              {/* <Grid
                item
                xs={12}
                className={[classes.gridDispaly].join(" ")}
                container
                spacing={1}
              >
                <Grid item xs={3}>
                  <label className="required">UoM for temperature</label>
                </Grid>

                <Grid item xs={2}>
                  <FormControl variant="outlined" fullWidth>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="temperatureUnit"
                      value={formData.temperatureUnit}
                      name="temperatureUnit"
                      onChange={handleChange}
                      placeholder=""
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
                              <MenuItem
                                key={tempvalue.id}
                                value={tempvalue.uomtempvalue}
                              >
                                {tempvalue.uomtempvalue}
                              </MenuItem>
                            );
                          })
                        : ""}
                    </Select>
                  </FormControl>
                  {isFormSubmit && !formData.temperatureUnit ? (
                    <FormHelperText
                      className={classes.errorSpanMsg}
                    ></FormHelperText>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid> */}

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
            </Grid>
          </ValidatorForm>
        </Paper>
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

GlobalSetting.propTypes = {
  createGlobalSetting: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    loadGlobalSettingsData: state.loadGlobalSettingsData,
  };
}

const mapDispatchToProps = {
  createGlobalSetting: globalSettingAction.createGlobalSetting,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSetting);
