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
import TooltipComponent from "../../common/tooltip";
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
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
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
    maximumFileSizeToImportUsersUnit: "MB",
    // temperatureUnit: "",
  });

  const [cancelData, setcancelData] = useState({
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
    maximumFileSizeToImportUsersUnit: "MB",
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
      id: "yyyy-MM-DD",
      formatvalue: "yyyy-MM-DD",
    },
    {
      id: "MM/DD/yyyy",
      formatvalue: "MM/DD/yyyy",
    },
    {
      id: "DD/MM/yyyy",
      formatvalue: "DD/MM/yyyy",
    },
    {
      id: "dddd,DD MMMM yyyy",
      formatvalue: "dddd,DD MMMM yyyy",
    },
    {
      id: "MMMM DD,yyyy",
      formatvalue: "MMMM DD,yyyy",
    },
    {
      id: "MMMDDyyyy",
      formatvalue: "MMMDDyyyy",
    },
    {
      id: "DDMMMyyyy",
      formatvalue: "DDMMMyyyy",
    },

    {
      id: "yyyyMMMDD",
      formatvalue: "yyyyMMMDD",
    },
    {
      id: "DD MMMM,yyyy",
      formatvalue: "DD MMMM,yyyy",
    },
    {
      id: "yyyy,MMMM DD",
      formatvalue: "yyyy,MMMM DD",
    },
    {
      id: "MMM DD,yyyy",
      formatvalue: "MMM DD,yyyy",
    },
    {
      id: "DD MMM,yyyy",
      formatvalue: "DD MMM,yyyy",
    },
    {
      id: "yyyy,MMM DD",
      formatvalue: "yyyy,MMM DD",
    },
    {
      id: "MMM/DD/yyyy",
      formatvalue: "MMM/DD/yyyy",
    },
    {
      id: "DD/MMM/yyyy",
      formatvalue: "DD/MMM/yyyy",
    },
    {
      id: "yyyy/MMM/DD",
      formatvalue: "yyyy/MMM/DD",
    },
  ];
  const timesFormat = [
    {
      id: "HH:mm",
      value: "HH:mm",
    },
    {
      id: "hh:mm a",
      value: "hh:mm a",
    },
    {
      id: "HH:mm:ss",
      value: "HH:mm:ss",
    },
    {
      id: "hh:mm:ss a",
      value: "hh:mm:ss a",
    },
  ];

  useEffect(() => {
    Promise.all([
      GlobalSettingApi.getLoadGlobalSetting(),
      GlobalSettingApi.FrequencytoFetchGeoUnits(),
      GlobalSettingApi.GetGeoFencingToleranceUnits(),
    ])
      .then(([globalSettings, getGeoUnits, getToleranceUnits]) => {
        console.log(globalSettings);
        setGeoUnits(getGeoUnits);
        setToleranceUnits(getToleranceUnits);
        if (globalSettings) {
          SetformData(globalSettings);
          setcancelData(globalSettings);
        } else {
          SetformData(formData);
          setcancelData(formData);
        }
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

  function redirectToViewUsersGroup() {
    SetformData(cancelData);
  }
  function GlobalSettingForm(e) {
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    setshowLoadder(true);
    setisFormSubmit(true);
    let finalData = formData;
    finalData.socialDistanceTolerance = parseInt(
      formData.socialDistanceTolerance
    );
    finalData.maxPasswordlength = parseInt(formData.maxPasswordlength);
    finalData.durationToLockUserAccount = parseInt(
      formData.durationToLockUserAccount
    );
    finalData.automatedCheckoutTime = parseFloat(
      formData.automatedCheckoutTime
    );
    finalData.selfHealthCheckReminder = parseFloat(
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

    finalData.maximumFileSizeOfUserSelfieUnit = "MB";
    finalData.maximumFileSizeToImportUsersUnit = "MB";

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
                  <TooltipComponent
                    isMarginBottom={false}
                    tooltipMessage={`Maximum distance from approved WFHL allowed for user to move around while Checked In`}
                  ></TooltipComponent>
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
                    Frequencey To Fetch The Geo Coordinates : Once In Every
                  </label>
                  <TooltipComponent
                    isMarginBottom={false}
                    tooltipMessage={`Frequency to fetch user's live location, to optimise battery utilisation while user is Checked In.`}
                  ></TooltipComponent>
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
                    Social Distancing Tolerance
                  </label>
                  <TooltipComponent
                    isMarginBottom={false}
                    tooltipMessage={`Minimum physical distace to be maintained for "Social distancing" practice.`}
                  ></TooltipComponent>
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
                    Facial Recognition Tolerance
                  </label>
                  <TooltipComponent
                    isMarginBottom={false}
                    tooltipMessage={`Maximum difference between the selfie uploaded to Check In and the approved PPP for check in to be successful. `}
                  ></TooltipComponent>
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
                  <TooltipComponent
                    isMarginBottom={false}
                    tooltipMessage={`Format to display date  on both web and mobile app.`}
                  ></TooltipComponent>
                </Grid>

                <Grid item xs={3}>
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
                  <TooltipComponent
                    isMarginBottom={false}
                    tooltipMessage={`Format to display time  on both web and mobile app.`}
                  ></TooltipComponent>
                </Grid>

                <Grid item xs={3}>
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
                      {timesFormat.length > 0
                        ? timesFormat.map((timevalue) => {
                          return (
                            <MenuItem key={timevalue.id} value={timevalue.id}>
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
                    File Format To Import Users Details:
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

                <Grid item xs={3}>
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
                  <label className="required">
                    Unlock Duration Of User Account
                  </label>
                  <TooltipComponent
                    isMarginBottom={false}
                    tooltipMessage={`Duration to  lock user's account after maximum invalid login attempt.User's account to be auto unlocked after the defined duration.`}
                  ></TooltipComponent>
                </Grid>
                <Grid item xs={3}>
                  <TextValidator
                    variant="outlined"
                    fullWidth
                    validators={[
                      "required",
                      "matchRegexp:^[0-9]*$",
                      "maxNumber:999",
                    ]}
                    errorMessages={[
                      "Please enter unlock duration of user account",
                      "Only numbers are allowed",
                      "Maximum allowed 3 digits",
                    ]}
                    id="outlined-adornment-weight"
                    name="durationToLockUserAccount"
                    type={"text"}
                    value={
                      formData.durationToLockUserAccount
                        ? formData.durationToLockUserAccount
                        : ""
                    }
                    onChange={handleChange}
                    // endAdornment={
                    //   <InputAdornment position="end">Minutes</InputAdornment>
                    // }
                    aria-describedby="outlined-weight-helper-text"
                    labelWidth={0}
                    className="global-input"
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">Minutes</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">Automated Check-out Time</label>
                  <TooltipComponent
                    isMarginBottom={false}
                    tooltipMessage={`Maximum Check In time allowed for user, after system Checks Out user automatically .`}
                  ></TooltipComponent>
                </Grid>
                <Grid item xs={3}>
                  <TextValidator
                    variant="outlined"
                    fullWidth
                    id="outlined-adornment-weight"
                    validators={[
                      "required",
                      "matchRegexp:^\\d{1,2}(\\.\\d{1,2})?$",
                    ]}
                    errorMessages={[
                      "Please enter automated check-out time",
                      "Numbers and decimals  allowed",
                    ]}
                    name="automatedCheckoutTime"
                    type={"text"}
                    value={
                      formData.automatedCheckoutTime
                        ? formData.automatedCheckoutTime
                        : ""
                    }
                    onChange={handleChange}
                    // endAdornment={
                    //   <InputAdornment position="end">Hours</InputAdornment>
                    // }
                    aria-describedby="outlined-weight-helper-text"
                    labelWidth={0}
                    className="global-input"
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">Hours</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">Minimum Password Length</label>
                  <TooltipComponent
                    isMarginBottom={false}
                    tooltipMessage={`Minimum length of password to be set by the user for their account.`}
                  ></TooltipComponent>
                </Grid>
                <Grid item xs={3}>
                  <TextValidator
                    variant="outlined"
                    fullWidth
                    validators={[
                      "required",
                      "matchRegexp:^[0-9]*$",
                      "maxNumber:99",
                    ]}
                    errorMessages={[
                      "Please enter passord",
                      "Only numbers are allowed",
                      "Only two digits are allowed ",
                    ]}
                    id="outlined-adornment-weight"
                    name="maxPasswordlength"
                    type={"text"}
                    value={
                      formData.maxPasswordlength
                        ? formData.maxPasswordlength
                        : ""
                    }
                    onChange={handleChange}
                    aria-describedby="outlined-weight-helper-text"
                    labelWidth={0}
                    className="global-input"
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          Characters
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">
                    Maximum File Size Of User Selfie Unit
                  </label>
                  <TooltipComponent
                    isMarginBottom={false}
                    tooltipMessage={`Maximum size of selfie allowed  to upload to Check In.`}
                  ></TooltipComponent>
                </Grid>
                <Grid item xs={3}>
                  <TextValidator
                    variant="outlined"
                    fullWidth
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
                    aria-describedby="outlined-weight-helper-text"
                    labelWidth={0}
                    className="global-input"
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">MB</InputAdornment>
                      ),
                    }}
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
                  <label className="required">Self Health Check Reminder</label>
                  <TooltipComponent
                    isMarginBottom={false}
                    tooltipMessage={`Remind user to submit self-health check before shift time.`}
                  ></TooltipComponent>
                </Grid>
                <Grid item xs={3}>
                  <TextValidator
                    variant="outlined"
                    validators={[
                      "required",
                      "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
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
                    Allow Exceptional Check-in When WFHL Request Is In Pending
                    Status
                  </label>{" "}
                  <TooltipComponent
                    isMarginBottom={false}
                    tooltipMessage={`For user to be able to check in from  WFHL in "Pending" status, this setting must be selected .`}
                  ></TooltipComponent>
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
                    Allow Exceptional Check-in When Profile Selfie Request Is In
                    Pending Status
                  </label>
                  <TooltipComponent
                    isMarginBottom={false}
                    tooltipMessage={`For user to be able to check in wrt PPP in "Pending" status, this setting must be selected .`}
                  ></TooltipComponent>
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
                      onClick={redirectToViewUsersGroup}
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
