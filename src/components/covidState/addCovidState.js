import React, { Fragment, useEffect, useState } from "react";
import {
  makeStyles,
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link as LinkTo } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { connect } from "react-redux";
import * as CovidStateAction from "../../Redux/Action/covidStateAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import CovidStateService from "../../services/covidStateServices";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";
import AlertBoxComponent from "../common/alert";
import FormHelperText from "@material-ui/core/FormHelperText";
import ComponentLoadderComponent from "../common/loadder/componentloadder";

const defaultTheme = createMuiTheme();
const theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "1em",
        color: "black",
        backgroundColor: "yellow",
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: 25,
  },
  icon: {
    marginRight: theme.spacing(0.5),
    marginBottom: -3,
    width: 20,
    height: 20,
  },
  selfHealthTooltip: {
    textDecorationLine: "underline",
    fontWeight: 600,
  },
  HealthcheckTooltipContainer: {
    display: "flex",
  },
  infoIconSize: {
    fontSize: 20,
    marginLeft: 5,
  },
}));

function CreateCovidState(props) {
  const userGroupUpdateid = props.match.params.id;
  const CovidStateApiCall = new CovidStateService();
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [backgroundcolor, setbackgroundcolor] = useState([]);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [formData, SetformData] = useState({
    id: "",
    stateName: "",
    colorName: "",
    description: "",
    message: "",
    colorId: "",
  });

  useEffect(() => {
    setComponentLoadder(true);
    if (userGroupUpdateid != 0 && props.userGroupDatas.length > 0) {
      SetformData(props.userGroupData);
    }
    props
      .LoadData()
      .then((result) => {})
      .catch((err) => {
        console.log(err);
      });

    CovidStateApiCall.getColorCode()
      .then((result) => {
        setbackgroundcolor(result);
        setComponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
        setComponentLoadder(false);
      });
  }, []);

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function UserBasicInfo(e) {
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");

    setshowLoadder(true);
    if (userGroupUpdateid) {
      var data = formData;
      props
        .UpdateData(data)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Updated COVID state details.");
          settoasterServerity("success");
          setisAlertBoxOpened(false);
          setTimeout(() => {
            props.history.push("/covidstate/all-covidstate");
            setshowLoadder(false);
          }, 3000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      var data = formData;
      props
        .AddData(data)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Added new COVID state.");
          settoasterServerity("success");
          setisAlertBoxOpened(false);
          setTimeout(() => {
            props.history.push("/covidstate/all-covidstate");
            setshowLoadder(false);
          }, 3000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    }
  }

  function handleChange(e) {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    if (name == "stateName") {
      checkUnqueName(value);
    }
    if (name == "colorId") {
      var color = backgroundcolor.filter((item) => item.id == value);
      SetformData((logInForm) => ({
        ...logInForm,
        [name]: value,
        ["colorName"]: color[0].colorName,
      }));
    } else {
      SetformData((logInForm) => ({
        ...logInForm,
        [name]: value,
      }));
    }
  }

  function checkUnqueName(value) {
    if (props.match.params.id != 0) {
      if (props.userGroupDatas && props.userGroupDatas.length > 0) {
        let filteredData = props.userGroupDatas.filter((x) => {
          return x.id != props.match.params.id;
        });
        let matchedValue = filteredData.find(
          (x) => x.stateName.toLowerCase() == value.toLowerCase()
        );
        if (matchedValue) {
          setIsDuplicate(true);
        } else {
          setIsDuplicate(false);
        }
      }
    } else {
      if (props.userGroupDatas && props.userGroupDatas.length > 0) {
        let matchedValue = props.userGroupDatas.find(
          (x) => x.stateName.toLowerCase() == value.toLowerCase()
        );
        if (matchedValue) {
          setIsDuplicate(true);
        } else {
          setIsDuplicate(false);
        }
      }
    }
  }

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  function redirectToViewUsersGroup() {
    props.history.push("/covidstate/all-covidstate");
  }

  return (
    <MuiThemeProvider theme={defaultTheme}>
      <>
        <AlertBoxComponent isAlertBoxOpened={isAlertBoxOpened} />
        {componentLoadder ? (
          <ComponentLoadderComponent />
        ) : (
          <>
            <div className="innerpage-container">
              <Breadcrumbs
                aria-label="breadcrumb"
                className="global-breadcrumb"
              >
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
                  to={`/covidstate/all-covidstate`}
                  className="inactive"
                >
                  Covid States
                </LinkTo>
                <LinkTo color="textPrimary" href="#" className="active">
                  {userGroupUpdateid
                    ? "Update Covid State"
                    : "Create Covid State"}
                </LinkTo>
              </Breadcrumbs>
              <Paper className={`main-paper`}>
                <ValidatorForm
                  className={`global-form`}
                  onSubmit={UserBasicInfo}
                >
                  <Grid container spacing={3}>
                    <Grid item container xs={12}>
                      <Grid item xs={3}>
                        <label className="required">Covid State Name</label>
                      </Grid>
                      <Grid item xs={5}>
                        <TextValidator
                          variant="outlined"
                          validators={[
                            "required",
                            "matchRegexp:^[a-zA-Z ]*$",
                            "matchRegexp:^.{0,60}$",
                          ]}
                          errorMessages={[
                            "Please enter covid state name",
                            "Special charcters are not allowed",
                            "Maximum 60 characters",
                          ]}
                          fullWidth
                          id="stateName"
                          placeholder="Enter Covid state"
                          name="stateName"
                          onChange={handleChange}
                          value={formData.stateName}
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

                    <Grid item container xs={12}>
                      <Grid item xs={3}>
                        <label>Description</label>
                      </Grid>
                      <Grid item xs={5}>
                        <TextValidator
                          variant="outlined"
                          fullWidth
                          id="description"
                          placeholder="Add description"
                          validators={["matchRegexp:^.{0,150}$"]}
                          errorMessages={["Maximum 150 characters"]}
                          name="description"
                          onChange={handleChange}
                          multiline
                          rows={2}
                          value={formData.description}
                          className="global-input global-input-multiline"
                          InputLabelProps={{ shrink: false }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item container xs={12}>
                      <Grid item xs={3}></Grid>
                      <Grid
                        item
                        xs={5}
                        className={classes.HealthcheckTooltipContainer}
                      >
                        <label className={classes.selfHealthTooltip}>
                          Self-Health Check Message :
                        </label>
                        <MuiThemeProvider theme={theme}>
                          <Tooltip title="Message to be shown to the user on mobile app on submitting answers to self-health check questions.">
                            <InfoIcon className={classes.infoIconSize} />
                          </Tooltip>
                        </MuiThemeProvider>
                      </Grid>
                    </Grid>
                    <Grid item container xs={12}>
                      <Grid item xs={3}>
                        <label>Message To Display</label>
                      </Grid>
                      <Grid item xs={5}>
                        <TextValidator
                          variant="outlined"
                          validators={["matchRegexp:^.{0,60}$"]}
                          errorMessages={["Maximum 60 characters"]}
                          fullWidth
                          id="message"
                          placeholder="Add message"
                          name="message"
                          onChange={handleChange}
                          value={formData.message}
                          multiline
                          rows={2}
                          className="global-input global-input-multiline"
                          InputLabelProps={{ shrink: false }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item container xs={12}>
                      <Grid item xs={3}>
                        <label>Backround Colour Of Message</label>
                      </Grid>
                      <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel
                            id="demo-simple-select-outlined-label"
                            shrink={false}
                            className="select-label"
                          >
                            {" "}
                            {formData.colorId == "" ? " Select color" : ""}
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            placeholder="Select color"
                            name="colorId"
                            value={formData.colorId}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: false }}
                            className="global-input single-select"
                          >
                            <MenuItem value="">None</MenuItem>
                            {backgroundcolor.length > 0
                              ? backgroundcolor.map((value) => {
                                  return (
                                    <MenuItem
                                      value={value.id}
                                      key={value.colorName}
                                    >
                                      {value.colorName}
                                    </MenuItem>
                                  );
                                })
                              : ""}
                          </Select>
                        </FormControl>
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
                            {showLoadder ? (
                              <ButtonLoadderComponent />
                            ) : (
                              "Submit"
                            )}
                          </Button>
                          <Button
                            variant="contained"
                            type="reset"
                            onClick={redirectToViewUsersGroup}
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
            </div>
          </>
        )}
        <ToasterMessageComponent
          stateSnackbar={stateSnackbar}
          setStateSnackbar={setStateSnackbar}
          toasterMessage={toasterMessage}
          toasterServerity={toasterServerity}
          toasterErrorMessageType={toasterErrorMessageType}
        />
      </>
    </MuiThemeProvider>
  );
}

export function getUserGroupById(users, id) {
  return users.find((user) => user.id === id) || null;
}

CreateCovidState.propTypes = {
  LoadData: PropTypes.array.isRequired,
  AddData: PropTypes.array.isRequired,
  UpdateData: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const emptyObject = {};
  const userGroupData =
    id && state.covidState.length > 0
      ? getUserGroupById(state.covidState, id)
      : emptyObject;
  return {
    userGroupData,
    userGroupDatas: state.covidState,
  };
}

const mapDispatchToProps = {
  LoadData: CovidStateAction.loadCovidState,
  AddData: CovidStateAction.createCovidState,
  UpdateData: CovidStateAction.updateCovidState,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCovidState);
