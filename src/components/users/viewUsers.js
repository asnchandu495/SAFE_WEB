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

function ViewUser(props) {
  var userId = props.match.params.id;
  const apiCallUsers = new UserService();
  const classes = useStyles();
  const [viewUserDetails, setviewUserDetails] = useState();
  const [componentLoadder, setcomponentLoadder] = useState(true);

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
                <Grid item xs={4}>
                  <label>First Name :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.firstName}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Middle Name:</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.middleName}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Last Name :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.lastName}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Gender :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.gender}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>User Id :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.userId}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Email Id :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.emailID}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Contact Number :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.contactNumber}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Alternative Contact Number :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.alternateContactNumber}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Designation :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.designation.name}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Team :</label>
                </Grid>
                <Grid item xs={8}>
                  {renderapplicationUseTeamGroup(
                    viewUserDetails.applicationUserToTeamMapping
                  )}
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Role :</label>
                </Grid>
                <Grid item xs={8}>
                  {renderapplicationUserRole(
                    viewUserDetails.applicationUserToRole
                  )}
                  {/* <label>{viewUserDetails.applicationUserToRoleMapping.Role}</label> */}
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Supervisor :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.supervisor}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Primary Group :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.group.groupName}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Secondary Group :</label>
                </Grid>
                <Grid item xs={8}>
                  {renderapplicationUserSecondaryGroup(
                    viewUserDetails.applicationUserToSecondaryGroup
                  )}
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Site :</label>
                </Grid>
                <Grid item xs={8}>
                  {renderapplicationUserSite(
                    viewUserDetails.applicationUserToSite
                  )}
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Country :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.country.name}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>State :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.state}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>City :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.city}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Address1 :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.address1}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Address2 :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.address2}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Zip Code :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>{viewUserDetails.zipCode}</label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Tempearture :</label>
                </Grid>
                <Grid item xs={8}>
                  <label>
                    {viewUserDetails.covidStateInfo
                      ? viewUserDetails.covidStateInfo.temperature
                      : "-"}{" "}
                    {props.loadGlobalSettingsData
                      ? props.loadGlobalSettingsData.temperatureUnit
                      : ""}
                  </label>
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4}>
                  <label>Covid State :</label>
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
                <Grid item xs={4}>
                  <label>Shift Info :</label>
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
