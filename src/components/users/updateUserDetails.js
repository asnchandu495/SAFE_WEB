import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import PersonIcon from "@material-ui/icons/Person";
import AllocateUserToTeam from "./allocateUserToTeam";
import AllocateUserToSite from "./allocateUserToSite";
import AllocateUserToPrimaryGroup from "./allocateUserToPrimaryGroup";
import AllocateUserToSecondaryGroup from "./allocateUserToSecondaryGroup";
import AllocateUserToRole from "./allocateUserToRole";
import { connect } from "react-redux";
import * as UserAction from "../../Redux/Action/userAction";
import UserService from "../../services/usersService";
import PropTypes from "prop-types";
import "./updateUserDetails.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

function UpdateUserDetails(props) {
  const classes = useStyles();
  const UserId = props.match.params.id;

  const apiCallUser = new UserService();
  const [applicationUserData, setapplicationUserData] = useState([]);
  const [componentLoadder, setcomponentLoadder] = useState(true);

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  useEffect(() => {
    setcomponentLoadder(true);
    apiCallUser
      .GetApplicationUsersById(UserId)
      .then((result) => {
        setapplicationUserData(result);
        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(applicationUserData);

  return (
    <div className="innerpage-container">
      {!componentLoadder ? (
        <div>
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
            <LinkTo
              color="textPrimary"
              href="#"
              to={`/users/allusers`}
              className="active"
            >
              {applicationUserData.firstName} {applicationUserData.lastName}
            </LinkTo>
          </Breadcrumbs>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <AllocateUserToTeam
                userData={props.userData}
                applicationUserId={applicationUserData.id}
                siteTeamData={applicationUserData.applicationUserToTeamMapping}
              ></AllocateUserToTeam>
            </Grid>
            <Grid item xs={12} sm={6}>
              <AllocateUserToSite
                userData={props.userData}
                applicationUserId={applicationUserData.id}
                siteData={applicationUserData.applicationUserToSite}
              ></AllocateUserToSite>
            </Grid>
            <Grid item xs={12} sm={6}>
              <AllocateUserToPrimaryGroup
                primaryGroup={applicationUserData.group}
                applicationUserId={applicationUserData.id}
              ></AllocateUserToPrimaryGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <AllocateUserToSecondaryGroup
                secondaryGroup={
                  applicationUserData.applicationUserToSecondaryGroup
                }
                applicationUserId={applicationUserData.id}
              ></AllocateUserToSecondaryGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <AllocateUserToRole
                applicationUserId={applicationUserData.id}
                siteRoleData={applicationUserData.applicationUserToRole}
              ></AllocateUserToRole>
            </Grid>
          </Grid>
        </div>
      ) : null}
    </div>
  );
}

UpdateUserDetails.propTypes = {
  AddUser: PropTypes.func.isRequired,
  UpdateUser: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  userData: PropTypes.object.isRequired,
};

export function getUserById(users, id) {
  return users.find((user) => user.id === id) || null;
}

function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const emptyObject = {};
  const userData =
    id && state.user.length > 0 ? getUserById(state.user, id) : emptyObject;
  return {
    userData,
    users: state.user,
  };
}

const mapDispatchToProps = {
  AddUser: UserAction.CreateUser,
  UpdateUser: UserAction.UpdateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUserDetails);
