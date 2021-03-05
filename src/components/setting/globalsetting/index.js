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
  });
  const [geoUnits, setGeoUnits] = useState([]);
  const [toleranceUnits, setToleranceUnits] = useState([]);
  const [componentLoadder, setcomponentLoadder] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);

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

  function GlobalSettingForm(e) {
    e.preventDefault();
    setshowLoadder(true);
    setisFormSubmit(true);
    let finalData = formData;
    finalData.socialDistanceTolerance = parseInt(
      formData.socialDistanceTolerance
    );
    finalData.frequencyOfGeoLocation = parseInt(
      formData.frequencyOfGeoLocation
    );
    finalData.geoFencingTolerance = parseInt(formData.geoFencingTolerance);
    let finalFacialRecVal = parseFloat(formData.facialTolerance);
    finalData.facialTolerance = finalFacialRecVal;
    props
      .createGlobalSetting(finalData)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Global setting data updated");
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
                      className="global-cancel-btn"
                    >
                      Cancel
                    </Button>
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
