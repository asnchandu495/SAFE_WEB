import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { connect } from "react-redux";
import * as UserLocationAction from "../../Redux/Action/addLocationAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import SiteService from "../../services/siteService";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TooltipComponent from "../common/tooltip";

//Styling
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "0px solid #ffff !imortant",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  stepButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
    margin: 0,
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  errorSpanMsg: {
    color: "red",
  },
  DefineDensitySpan: {
    textDecorationLine: "underline",
    fontWeight: 600,
  },

  temperatureRange: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  temperatureRangeLabel: {
    position: "absolute",
    top: "30%",
    // position: absolute;
    // top: 30%
  },
  dilaogBox: {
    minWidth: "800px",
    // maxWidth:"800px"
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function AddLocation(props) {
  const classes = useStyles();
  const siteApiCall = new SiteService();

  const [componentLoadder, setcomponentLoadder] = useState(false);
  const [isFormSubmit, setisFormSubmit] = useState(false);

  const [formData, SetformData] = useState({
    siteId: "",
    id: "",
    floorName: "",
    floorId: "",
    locationName: "",
    isPinMicroActive: false,
    HightTemperatureNoLimit: false,
    densityThreasholdLowFrom: 0,
    densityThreasholdLowTo: 0,
    densityThreasholdMediumFrom: 0,
    densityThreasholdMediumTo: 0,
    densityThreasholdHighFrom: 0,
    densityThreasholdHighTo: 0,
    isRLAPActive: false,
    rlapReferenceId: "",
  });
  const [resetformData, SetresetformData] = useState({
    siteId: "",
    id: "",
    floorName: "",
    floorId: "",
    locationName: "",
    isRLAPActive: false,
    densityThreasholdLowFrom: 0,
    densityThreasholdLowTo: 0,
    densityThreasholdMediumFrom: 0,
    densityThreasholdMediumTo: 0,
    densityThreasholdHighFrom: 0,
    densityThreasholdHighTo: 0,
    HightTemperatureNoLimit: false,
  });

  const [formValidation, SetformValidation] = useState({
    floor: false,
    densityFieldRequired: false,
  });

  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [floorInfoData, setfloorInfoData] = useState([]);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    setcomponentLoadder(true);
    if (props.SelectedRowId && props.LocationData.length > 0) {
      SetformData(props.selecteLocationData);
    }
    siteApiCall
      .getListFloor(props.siteId)
      .then((result) => {
        setfloorInfoData(result);
        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.SelectedRowId]);
  //Method to close the popup modal and reset the popup form data
  const handleClose = () => {
    resetCovidStateFormData();
    props.setopenAddLocationModal(false);
    setIsDuplicate(false);
    props.setSelectedRowId("");
  };
  //Method to reset the form on click of refresh button
  function resetCovidStateFormData() {
    SetformData(resetformData);
  }
  /**
   * Handle change
   * Binding data with the form fields also calls the check unique function
   * @param  {} e
   */
  function handleChange(e) {
    const { name, value } = e.target;

    if (name == "locationName") {
      checkUnqueName(value);
    }
    if (name == "isRLAPActive") {
      if (!e.target.checked) {
        SetformData((logInForm) => ({
          ...logInForm,
          ["densityThreasholdLowFrom"]: 0,
          ["densityThreasholdLowTo"]: 0,
          ["densityThreasholdMediumFrom"]: 0,
          ["densityThreasholdMediumTo"]: 0,
          ["densityThreasholdHighFrom"]: 0,
          ["densityThreasholdHighTo"]: 0,
        }));
      }
      SetformData((logInForm) => ({
        ...logInForm,
        [name]: e.target.checked,
      }));
    } else if (name == "HightTemperatureNoLimit") {
      if (e.target.checked) {
        SetformData((logInForm) => ({
          ...logInForm,
          [name]: e.target.checked,
          ["densityThreasholdHighTo"]: -1,
        }));
      } else {
        SetformData((logInForm) => ({
          ...logInForm,
          [name]: e.target.checked,
          ["densityThreasholdHighTo"]: null,
        }));
      }
    } else {
      SetformData((logInForm) => ({
        ...logInForm,
        [name]: value,
      }));
      // SetformData((logInForm) => ({
      //   ...logInForm,
      //   ["isRLAPActive"]: e.target.checked,
      // }));
    }
  }
  /**
   * Check unique name
   * Method to check if there's any duplicacy in the location name
   * @param  {} value-location name
   */
  function checkUnqueName(value) {
    if (props.SelectedRowId) {
      if (props.LocationData && props.LocationData.length > 0) {
        let filteredData = props.LocationData.filter((x) => {
          return x.id != props.SelectedRowId;
        });
        let matchedValue = filteredData.find(
          (x) => x.locationName.toLowerCase() == value.toLowerCase()
        );
        if (matchedValue) {
          setIsDuplicate(true);
        } else {
          setIsDuplicate(false);
        }
      }
    } else {
      if (props.LocationData && props.LocationData.length > 0) {
        let matchedValue = props.LocationData.find(
          (x) => x.locationName.toLowerCase() == value.toLowerCase()
        );
        if (matchedValue) {
          setIsDuplicate(true);
        } else {
          setIsDuplicate(false);
        }
      }
    }
  }
  /**
   * Handle change density threashold
   * Binding data with onchange of  density thershold values
   * @param  {} e
   */
  function handleChangedensityThreashold(e) {
    const { name, value } = e.target;
    SetformData((logInForm) => ({
      ...logInForm,
      [name]: value,
    }));
  }

  //Method  to  validate the form and call method to add or update info
  function userCovidInfo(e) {
    e.preventDefault();
    setisFormSubmit(true);
    var data = formData;
    var validationField = formValidation;
    floorValidation(data);
    if (!validationField.formValidation) {
      submitUserCovidInformation();
    }
  }
  /**
   * Floor validation
   * Method to validate floor feild
   * @param  {} data-{
    siteId: string;
    id: string;
    floorName: string;
    floorId: string;
    locationName: string;
    isPinMicroActive: boolean;
    HightTemperatureNoLimit: boolean;
    densityThreasholdLowFrom: number;
    densityThreasholdLowTo: number;
    etc,,,;
    rlapReferenceId: string;
}
   */
  function floorValidation(data) {
    if (data.floorId) {
      SetformValidation((ValidationForm) => ({
        ...ValidationForm,
        ["floor"]: false,
      }));
    } else {
      SetformValidation((ValidationForm) => ({
        ...ValidationForm,
        ["floor"]: true,
      }));
    }
  }

  function DensityRequiredFieldValidation() {
    var microStatus = formData.isRLAPActive;
    if (microStatus) {
      if (
        formData.densityThreasholdLowFrom &&
        formData.densityThreasholdLowTo &&
        formData.densityThreasholdMediumFrom &&
        formData.densityThreasholdMediumTo &&
        formData.densityThreasholdHighFrom &&
        formData.densityThreasholdHighTo
      ) {
        SetformValidation((ValidationForm) => ({
          ...ValidationForm,
          ["densityFieldRequired"]: true,
        }));
      } else {
        SetformValidation((ValidationForm) => ({
          ...ValidationForm,
          ["densityFieldRequired"]: false,
        }));
      }
    } else {
      SetformValidation((ValidationForm) => ({
        ...ValidationForm,
        ["densityFieldRequired"]: false,
      }));
    }
  }
  /**
   * Submit user covid info
   * Method to add or update a location to the floor
   * @param  {} e
   */
  function submitUserCovidInformation(e) {
    settoasterServerity("");
    settoasterErrorMessageType("");
    var data = formData;

    var fileterSelectedFloorName = floorInfoData.filter(
      (item) => item.id == data.floorId
    );
    data.siteId = props.siteId;
    data.floorName = fileterSelectedFloorName[0].floorName;
    data.densityThreasholdHighFrom = parseFloat(data.densityThreasholdHighFrom);
    data.densityThreasholdHighTo = parseFloat(data.densityThreasholdHighTo);
    data.densityThreasholdLowFrom = parseFloat(data.densityThreasholdLowFrom);
    data.densityThreasholdLowTo = parseFloat(data.densityThreasholdLowTo);
    data.densityThreasholdMediumFrom = parseFloat(
      data.densityThreasholdMediumFrom
    );
    data.densityThreasholdMediumTo = parseFloat(data.densityThreasholdMediumTo);
    setshowLoadder(true);
    if (props.SelectedRowId) {
      props
        .UpdateData(data)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Updated Location details.");
          settoasterServerity("success");
          setTimeout(() => {
            resetCovidStateFormData();
            setshowLoadder(false);
            props.setSelectedRowId("");
            props.setopenAddLocationModal(false);
            setIsDuplicate(false);
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      props
        .AddData(data)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Added new location to Floor.");
          settoasterServerity("success");
          setTimeout(() => {
            resetCovidStateFormData();
            setshowLoadder(false);
            props.setSelectedRowId("");
            props.setopenAddLocationModal(false);
            setIsDuplicate(false);
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    }
  }

  return (
    <div>
      {!componentLoadder ? (
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={props.openAddLocationModal}
          maxWidth="md"
          className="global-dialog add-location-dialog"
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            {props.SelectedRowId ? "Update Location" : "Add Location"}
          </DialogTitle>
          <ValidatorForm className={`global-form`} onSubmit={userCovidInfo}>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item cs={12} container>
                  <Grid item xs={3}>
                    <label className="required">Floor</label>
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      fullWidth
                    >
                      <InputLabel
                        id="demo-simple-select-outlined-label"
                        shrink={false}
                        className="select-label"
                      >
                        {formData.floorId == "" ? " Select" : ""}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        placeholder="Select"
                        name="floorId"
                        value={formData.floorId}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: false }}
                        className="global-input single-select"
                      >
                        <MenuItem value="">None</MenuItem>
                        {floorInfoData.length > 0
                          ? floorInfoData.map((lan) => {
                              return (
                                <MenuItem value={lan.id}>
                                  {lan.floorName}
                                </MenuItem>
                              );
                            })
                          : ""}
                      </Select>
                    </FormControl>
                    {isFormSubmit && formValidation.floor ? (
                      <FormHelperText className={classes.errorSpanMsg}>
                        Please select floor{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
                <Grid item cs={12} container>
                  <Grid item xs={3}>
                    <label className="required">Location Name</label>
                  </Grid>
                  <Grid item xs={4}>
                    <TextValidator
                      variant="outlined"
                      validators={[
                        "required",
                        // "matchRegexp:^[a-zA-Z0-9]*$",
                        "matchRegexp:^.{0,50}$",
                      ]}
                      errorMessages={[
                        "Please enter location name",
                        // "Special charcters are not allowed",
                        "Maximum 60 characters",
                      ]}
                      fullWidth
                      id="locationName"
                      placeholder="Enter location name"
                      name="locationName"
                      onChange={handleChange}
                      value={formData.locationName}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                    {isDuplicate ? (
                      <FormHelperText className="error-msg">
                        This name already exists.
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
                <Grid
                  item
                  cs={12}
                  container
                  className="location-pin-micro-checkbox"
                >
                  <Grid item xs={3}></Grid>
                  <Grid item xs={7}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isRLAPActive}
                          onChange={handleChange}
                          value={formData.isRLAPActive}
                          name="isRLAPActive"
                          inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                        />
                      }
                      label="RLAP Active"
                    />
                    <TooltipComponent
                      isMarginBottom={true}
                      tooltipMessage={`Indicates if user's real time location tracking  is implemented in the locations . "Density Threshold" details of the location to be maintained only if  RLAP is active in the location.`}
                    ></TooltipComponent>
                  </Grid>
                </Grid>
                <Grid item container xs={12}>
                  <Grid item xs={3}>
                    <label
                      className={`input-label ${
                        formData.isRLAPActive ? "required" : ""
                      }`}
                    >
                      RLAP Location ID
                    </label>
                    <TooltipComponent
                      isMarginBottom={true}
                      tooltipMessage={`Unique reference ID  of floor  as maintained in RLAP  platform . This ID will be used for technical implementation, to fetch the floor specific data from RLAP platform.Unique reference ID  of floor  as maintained in RLAP  platform . This ID will be used for technical implementation, to fetch the floor specific data from RLAP platform. reference ID  of site as maintained in RLAP  platform . This is required for technical implementation, to fetch the site specific data from RLAP platform.`}
                    ></TooltipComponent>
                  </Grid>
                  <Grid item xs={5}>
                    <TextValidator
                      variant="outlined"
                      validators={formData.isRLAPActive ? ["required"] : ""}
                      errorMessages={
                        formData.isRLAPActive
                          ? ["Please enter RLAP ReferenceId"]
                          : ""
                      }
                      fullWidth
                      id="rlapReferenceId"
                      disabled={!formData.isRLAPActive}
                      placeholder="Enter rlapReferenceId "
                      name="rlapReferenceId"
                      onChange={handleChange}
                      value={formData.rlapReferenceId}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                </Grid>
                <Grid item cs={12} container>
                  <Grid item xs={12}>
                    <label className={classes.DefineDensitySpan}>
                      Define Density Threshold:
                    </label>
                    <TooltipComponent
                      isMarginBottom={true}
                      tooltipMessage={`Density Threshold will be  used in the "Density Information" report to show live density of a location using color codes: Green -Low, Amber- Medium , Red-High
                      Edited.`}
                    ></TooltipComponent>
                  </Grid>
                </Grid>
                <Grid item cs={12} container className="thershold-limits">
                  <Grid item xs={3}>
                    <label
                      className={[formData.isRLAPActive ? "required" : ""].join(
                        " "
                      )}
                    >
                      Low
                    </label>
                  </Grid>
                  <Grid item xs={3}>
                    <TextValidator
                      variant="outlined"
                      validators={["matchRegexp:^[0-9]*$", "maxNumber:999999"]}
                      errorMessages={[
                        "Only numbers are allowed",
                        "Maximum allowed 6 digits",
                      ]}
                      type="number"
                      fullWidth
                      id="densityThreasholdLowFrom"
                      placeholder=""
                      name="densityThreasholdLowFrom"
                      onChange={handleChangedensityThreashold}
                      value={formData.densityThreasholdLowFrom}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                      disabled={!formData.isRLAPActive}
                    />
                  </Grid>
                  <Grid item xs={1} className={classes.temperatureRange}>
                    <label className={classes.temperatureRangeLabel}>to</label>
                  </Grid>
                  <Grid item xs={3}>
                    <TextValidator
                      variant="outlined"
                      validators={[
                        "matchRegexp:^[0-9]*$",
                        `minNumber:${
                          formData.isRLAPActive
                            ? parseInt(formData.densityThreasholdLowFrom) + 1
                            : 0
                        }`,
                      ]}
                      errorMessages={[
                        "Only  numbers are allowed",
                        `Minimum allowed ${
                          formData.isRLAPActive
                            ? parseInt(formData.densityThreasholdLowFrom) + 1
                            : 0
                        }`,
                      ]}
                      type="number"
                      fullWidth
                      id="densityThreasholdLowTo"
                      placeholder=""
                      name="densityThreasholdLowTo"
                      onChange={handleChangedensityThreashold}
                      value={formData.densityThreasholdLowTo}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                      disabled={!formData.isRLAPActive}
                    />
                  </Grid>
                </Grid>
                <Grid item cs={12} container className="thershold-limits">
                  <Grid item xs={3}>
                    <label
                      className={[formData.isRLAPActive ? "required" : ""].join(
                        " "
                      )}
                    >
                      Medium
                    </label>
                  </Grid>
                  <Grid item xs={3}>
                    <TextValidator
                      variant="outlined"
                      validators={[
                        "matchRegexp:^[0-9]*$",
                        `minNumber:${
                          formData.isRLAPActive
                            ? parseInt(formData.densityThreasholdLowTo) + 1
                            : 0
                        }`,
                      ]}
                      errorMessages={[
                        "Only numbers are allowed",
                        `Minimum allowed ${
                          formData.isRLAPActive
                            ? parseInt(formData.densityThreasholdLowTo) + 1
                            : 0
                        }`,
                      ]}
                      type="number"
                      fullWidth
                      id="densityThreasholdMediumFrom"
                      placeholder=""
                      name="densityThreasholdMediumFrom"
                      onChange={handleChangedensityThreashold}
                      value={formData.densityThreasholdMediumFrom}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                      disabled={!formData.isRLAPActive}
                    />
                  </Grid>
                  <Grid item xs={1} className={classes.temperatureRange}>
                    <label className={classes.temperatureRangeLabel}>to</label>
                  </Grid>
                  <Grid item xs={3}>
                    <TextValidator
                      variant="outlined"
                      validators={[
                        "matchRegexp:^[0-9]*$",
                        `minNumber:${
                          formData.isRLAPActive
                            ? parseInt(formData.densityThreasholdMediumFrom) + 1
                            : 0
                        }`,
                      ]}
                      errorMessages={[
                        "Only numbers are allowed",
                        `Minimum allowed ${
                          formData.isRLAPActive
                            ? parseInt(formData.densityThreasholdMediumFrom) + 1
                            : 0
                        }`,
                      ]}
                      type="number"
                      fullWidth
                      id="densityThreasholdMediumTo"
                      placeholder=""
                      name="densityThreasholdMediumTo"
                      onChange={handleChangedensityThreashold}
                      value={formData.densityThreasholdMediumTo}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                      disabled={!formData.isRLAPActive}
                    />
                  </Grid>
                </Grid>
                <Grid item cs={12} container className="thershold-limits">
                  <Grid item xs={3}>
                    <label
                      className={[formData.isRLAPActive ? "required" : ""].join(
                        " "
                      )}
                    >
                      High
                    </label>
                  </Grid>
                  <Grid item xs={3}>
                    <TextValidator
                      variant="outlined"
                      validators={[
                        "matchRegexp:^[0-9]*$",
                        `minNumber:${
                          formData.isRLAPActive
                            ? parseInt(formData.densityThreasholdMediumTo) + 1
                            : 0
                        }`,
                      ]}
                      errorMessages={[
                        "Only numbers are allowed",
                        `Minimum allowed ${
                          formData.isRLAPActive
                            ? parseInt(formData.densityThreasholdMediumTo) + 1
                            : 0
                        }`,
                      ]}
                      type="number"
                      fullWidth
                      id="densityThreasholdHighFrom"
                      placeholder=""
                      name="densityThreasholdHighFrom"
                      onChange={handleChangedensityThreashold}
                      value={formData.densityThreasholdHighFrom}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                      disabled={!formData.isRLAPActive}
                    />
                  </Grid>
                  <Grid item xs={1} className={classes.temperatureRange}>
                    <label className={classes.temperatureRangeLabel}>to</label>
                  </Grid>
                  <Grid item xs={3}>
                    <TextValidator
                      variant="outlined"
                      validators={[
                        "matchRegexp:^[0-9]*$",
                        `minNumber:${
                          formData.isRLAPActive
                            ? parseInt(formData.densityThreasholdHighFrom) + 1
                            : 0
                        }`,
                      ]}
                      errorMessages={[
                        "Only numbers are allowed",
                        `Minimum allowed ${
                          formData.isRLAPActive
                            ? parseInt(formData.densityThreasholdHighFrom) + 1
                            : 0
                        }`,
                      ]}
                      // disabled={formData.HightTemperatureNoLimit}
                      type="number"
                      fullWidth
                      id="densityThreasholdHighTo"
                      placeholder=""
                      name="densityThreasholdHighTo"
                      onChange={handleChangedensityThreashold}
                      value={
                        formData.HightTemperatureNoLimit ||
                        formData.densityThreasholdHighTo == -1
                          ? ""
                          : formData.densityThreasholdHighTo
                      }
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                      disabled={
                        !formData.isRLAPActive ||
                        // formData.HightTemperatureNoLimit ||
                        formData.densityThreasholdHighTo == -1
                      }
                    />
                  </Grid>

                  <Grid item xs={2} style={{ paddingLeft: 10 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            (formData.isRLAPActive &&
                              formData.HightTemperatureNoLimit &&
                              formData.densityThreasholdHighTo != 0) ||
                            (formData.isRLAPActive &&
                              formData.densityThreasholdHighTo == -1 &&
                              formData.densityThreasholdHighTo != 0)
                          }
                          onChange={handleChange}
                          name="HightTemperatureNoLimit"
                          disabled={!formData.isRLAPActive}
                        />
                      }
                      label="No Limit"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                type="submit"
                className="global-submit-btn"
                disabled={showLoadder}
              >
                {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
              </Button>
              <Button onClick={handleClose} className="global-cancel-btn">
                Cancel
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>
      ) : null}
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

export function getLocationById(location, id) {
  return location.find((location) => location.id === id) || null;
}
//Validates the data received from the props
AddLocation.propTypes = {
  LocationData: PropTypes.array.isRequired,
  selecteLocationData: PropTypes.array.isRequired,
  LoadData: PropTypes.func.isRequired,
  AddData: PropTypes.func.isRequired,
  UpdateData: PropTypes.func.isRequired,
};
//Update redux store and merge them into props
function mapStateToProps(state, ownProps) {
  const emptyObject = {};
  const selecteLocationData =
    ownProps.SelectedRowId && state.LocationState.length > 0
      ? getLocationById(state.LocationState, ownProps.SelectedRowId)
      : emptyObject;
  return {
    selecteLocationData,
    LocationData: state.LocationState,
  };
}
// Customizing the functions your component receives, and how they dispatch actions
const mapDispatchToProps = {
  LoadData: UserLocationAction.loadLocation,
  AddData: UserLocationAction.createLocation,
  UpdateData: UserLocationAction.updateLocation,
};
//connects the component with redux store
export default connect(mapStateToProps, mapDispatchToProps)(AddLocation);
