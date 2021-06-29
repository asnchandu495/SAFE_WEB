import React, { Fragment, useEffect, useState } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Link as LinkTo } from "react-router-dom";
import UserService from "../../services/usersService";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import { connect } from "react-redux";
import * as globalSettingAction from "../../Redux/Action/globalSettingAction";
import moment from "moment";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: 25,
  },
  stepButtons: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing(1),
  },
}));

const DisplayFormControl = ({
  viewUserDetailsTemp,
  viewUserDetailsTempUnit,
  loadGlobalSettingsDataTemp,
}) => {
  if (
    viewUserDetailsTemp != "" &&
    viewUserDetailsTempUnit != "" &&
    loadGlobalSettingsDataTemp != ""
  ) {
    if (loadGlobalSettingsDataTemp == viewUserDetailsTempUnit) {
      return viewUserDetailsTemp + "-" + viewUserDetailsTempUnit;
    } else if (loadGlobalSettingsDataTemp != viewUserDetailsTempUnit) {
      if (loadGlobalSettingsDataTemp == "C") {
        let convertedTemp = ((viewUserDetailsTemp - 32) * 5) / 9;
        return <span>{convertedTemp.toFixed(2)}-C</span>;
      } else {
        let convertedTemp = viewUserDetailsTemp * (9 / 5) + 32;
        return <span>{convertedTemp.toFixed(2)}-F</span>;
      }
    } else {
      return viewUserDetailsTemp + "-" + viewUserDetailsTempUnit;
    }
  } else {
    return "-";
  }
};

function ViewUser(props) {
  var userId = props.match.params.id;
  const apiCallUsers = new UserService();
  const classes = useStyles();
  const [viewUserDetails, setviewUserDetails] = useState();
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [changeTemprange, setchangeTemprange] = useState(0);

  useEffect(() => {
    setcomponentLoadder(true);
    props.loadGlobalSettingWithoutAPICall();
    apiCallUsers
      .GetApplicationUsersById(userId)
      .then((result) => {
        setviewUserDetails(result);

        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function ConvertTemperature(
    viewtemperature,
    viewtemperatureUnit,
    temperatureUnit
  ) {
    console.log(viewtemperatureUnit);
    console.log(temperatureUnit);
    if (viewtemperatureUnit == temperatureUnit) {
      console.log("same");
    } else if (temperatureUnit == "C") {
      let convertedTemp = ((viewtemperature - 32) * 5) / 9;
      return <span>{convertedTemp}-C</span>;
    } else {
      let convertedTemp = viewtemperature * (9 / 5) + 32;
      return <span>{convertedTemp}-F</span>;
    }
  }

  function handleClickGoBack() {
    props.history.push("/users/allusers");
  }

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  function renderapplicationUserRole(UserRolesValue) {
    var UserRoles = UserRolesValue;
    var displayRoles = "";
    if (UserRoles) {
      var UserRoleList = UserRoles.map((item) => {
        return item.id;
      });
      if (UserRoleList.length > 0) {
        displayRoles = UserRoleList.join(", ");
      }
    }
    return <span>{displayRoles}</span>;
  }

  function renderapplicationUserSecondaryGroup(UserRolesValue) {
    var UserRoles = UserRolesValue;
    var displayRoles = "";
    if (UserRoles) {
      var UserRoleList = UserRoles.map((item) => {
        return item.groupName;
      });
      if (UserRoleList.length > 0) {
        displayRoles = UserRoleList.join(", ");
      }
    }
    return <span>{displayRoles}</span>;
  }

  function renderapplicationUseTeamGroup(UserRolesValue) {
    var UserRoles = UserRolesValue;
    var displayRoles = "";
    if (UserRoles) {
      var UserRoleList = UserRoles.map((item) => {
        return item.name;
      });
      if (UserRoleList.length > 0) {
        displayRoles = UserRoleList.join(", ");
      }
    }
    return <span>{displayRoles}</span>;
  }

  function renderapplicationUserSite(UserRolesValue) {
    var UserRoles = UserRolesValue;
    var displayRoles = "";
    if (UserRoles) {
      var UserRoleList = UserRoles.map((item) => {
        return item.name;
      });
      if (UserRoleList.length > 0) {
        displayRoles = UserRoleList.join(", ");
      }
    }
    return <span>{displayRoles}</span>;
  }

  return (
    <div className="innerpage-container">
      {!componentLoadder ? (
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
            to={`/users/allusers`}
            className="inactive"
          >
            Users
          </LinkTo>
          <LinkTo color="textPrimary" href="#" className="active">
            {viewUserDetails.firstName} {viewUserDetails.lastName}
          </LinkTo>
        </Breadcrumbs>
      ) : null}
      {!componentLoadder ? (
        <Paper className={classes.instructions}>
          <div className={`global-form inline-form`}>
            <Grid container spacing={3} direction="row">
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>First Name</label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.firstName}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Middle Name</label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.middleName}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Last Name </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.lastName}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Gender :</label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.gender}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>User ID </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.userId}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Email ID </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.emailID}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Mobile Number </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.contactNumber}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Alternative Mobile Number </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.alternateContactNumber}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Designation </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.designation.name}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Team </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  {renderapplicationUseTeamGroup(
                    viewUserDetails.applicationUserToTeamMapping
                  )}
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Role </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  {renderapplicationUserRole(
                    viewUserDetails.applicationUserToRole
                  )}
                  {/* <label>{viewUserDetails.applicationUserToRoleMapping.Role}</label> */}
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Supervisor </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.supervisor}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Primary Group </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.group.groupName}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Secondary Group </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  {renderapplicationUserSecondaryGroup(
                    viewUserDetails.applicationUserToSecondaryGroup
                  )}
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Site </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  {renderapplicationUserSite(
                    viewUserDetails.applicationUserToSite
                  )}
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Country </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.country.name}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>State </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.state}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>City </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.city}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Address1 </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.address1}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Address2 </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.address2}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Zip Code </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.zipCode}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Temperature </label>
                  <span>:</span>
                </Grid>

                <Grid item xs={8}>
                  {/* {viewUserDetails.covidStateInfo && */}
                  {/* props.loadGlobalSettingsData ? ( */}
                  <label>
                    {/* {viewUserDetails.covidStateInfo
                        ? ConvertTemperature(
                            viewUserDetails.covidStateInfo.temperature,
                            viewUserDetails.covidStateInfo.temperatureUnit,
                            props.loadGlobalSettingsData.temperatureUnit
                          )
                        : " - " + props.loadGlobalSettingsData.temperatureUnit} */}

                    {/* {viewUserDetails.covidStateInfo.temperature && */}
                    {/* props.loadGlobalSettingsData.temperatureUnit */}
                    {/* ? viewUserDetails.covidStateInfo.temperature */}
                    {/* : "-"}{" "} */}
                    {/* {props.loadGlobalSettingsData.temperatureUnit && */}
                    {/* viewUserDetails.covidStateInfo.temperature */}
                    {/* ? props.loadGlobalSettingsData.temperatureUnit */}
                    {/* : ""} */}
                  </label>
                  {/* ) : ( */}
                  {/* "" */}
                  {/* )} */}

                  <DisplayFormControl
                    viewUserDetailsTemp={
                      viewUserDetails.covidStateInfo
                        ? viewUserDetails.covidStateInfo.temperature
                        : ""
                    }
                    viewUserDetailsTempUnit={
                      viewUserDetails.covidStateInfo
                        ? viewUserDetails.covidStateInfo.temperatureUnit
                        : ""
                    }
                    loadGlobalSettingsDataTemp={
                      props.loadGlobalSettingsData
                        ? props.loadGlobalSettingsData.temperatureUnit
                        : ""
                    }
                  ></DisplayFormControl>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Covid State </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>
                    {viewUserDetails.covidStateInfo
                      ? viewUserDetails.covidStateInfo.covidState
                      : "---"}
                  </label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>Shift Info </label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>
                    {viewUserDetails.userShiftInfo
                      ? moment(viewUserDetails.userShiftInfo.startTime).format(
                        props.loadGlobalSettingsData
                          ? props.loadGlobalSettingsData.timeFormat
                          : "hh:mm"
                      )
                      : "-"}{" "}
                    -{" "}
                    {viewUserDetails.userShiftInfo
                      ? moment(viewUserDetails.userShiftInfo.endTime).format(
                        props.loadGlobalSettingsData
                          ? props.loadGlobalSettingsData.timeFormat
                          : "hh:mm"
                      )
                      : ""}
                  </label>
                </Grid>
              </Grid>
              {viewUserDetails.rlapUserReferenceId ? <Grid item xs={6} container>
                <Grid item xs={4} className="user-view-label">
                  <label>RLAP User ID</label>
                  <span>:</span>
                </Grid>
                <Grid item xs={8}>
                  <label>
                    {viewUserDetails.rlapUserReferenceId}
                  </label>
                </Grid>
              </Grid> : ""}
              <Grid
                item
                xs={12}
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
              >
                <div className={`form-buttons-container`}>
                  <Button
                    variant="contained"
                    type="button"
                    onClick={handleClickGoBack}
                    className="global-cancel-btn"
                  >
                    Close
                  </Button>
                </div>
              </Grid>
            </Grid>
          </div>
        </Paper>
      ) : (
        <ComponentLoadderComponent />
      )}
    </div>
  );
}

ViewUser.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewUser);
