import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { connect } from "react-redux";
import * as UserGroupAction from "../../Redux/Action/userGroupAction";
import PropTypes from "prop-types";
import AlertBoxComponent from "../common/alert";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import FormHelperText from "@material-ui/core/FormHelperText";

function CreateUserGroup(props) {
  const userGroupUpdateid = props.match.params.id;
  const [activeStep, setActiveStep] = React.useState(0);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [formData, SetformData] = useState({
    id: "",
    groupName: "",
    description: "",
    createDate: "12/10/20",
  });

  useEffect(() => {
    if (userGroupUpdateid != 0 && props.userGroupDatas.length > 0) {
      setComponentLoadder(true);
      SetformData(props.userGroupData);
    }
    props
      .LoadAllUserGroup()
      .then((result) => {
        setComponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function UserBasicInfo(e) {
    setshowLoadder(true);
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    if (userGroupUpdateid != 0) {
      var data = formData;
      props
        .UpdateUserGroup(data)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Updated User Group details.");
          settoasterServerity("success");
          setisAlertBoxOpened(false);
          setTimeout(() => {
            props.history.push("/usergroups/allusergroups");
            setshowLoadder(false);
          }, 6000);
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
        .AddUserGroup(data)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Added new User Group.");
          settoasterServerity("success");
          setisAlertBoxOpened(false);
          setTimeout(() => {
            props.history.push("/usergroups/allusergroups");
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
  }

  function handleChange(e) {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    if (name == "groupName") {
      checkUnqueName(value);
    }
    SetformData((logInForm) => ({
      ...logInForm,
      [name]: value,
    }));
  }

  function checkUnqueName(value) {
    if (props.match.params.id != 0) {
      if (props.userGroupDatas && props.userGroupDatas.length > 0) {
        let filteredData = props.userGroupDatas.filter((x) => {
          return x.id != props.match.params.id;
        });
        let matchedValue = filteredData.find(
          (x) => x.groupName.toLowerCase() == value.toLowerCase()
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
          (x) => x.groupName.toLowerCase() == value.toLowerCase()
        );
        if (matchedValue) {
          setIsDuplicate(true);
        } else {
          setIsDuplicate(false);
        }
      }
    }
  }

  function redirectToViewUsersGroup() {
    props.history.push("/usergroups/allusergroups");
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
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/usergroups/allusergroups`}
          className="inactive"
        >
          User Groups
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          {userGroupUpdateid != 0 ? "Update User Group" : "Create User Group"}
        </LinkTo>
      </Breadcrumbs>
      <Paper className="main-paper">
        {!componentLoadder ? (
          <ValidatorForm className={`global-form`} onSubmit={UserBasicInfo}>
            <Grid container spacing={3}>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">User Group Name</label>
                </Grid>
                <Grid item xs={5}>
                  <TextValidator
                    variant="outlined"
                    validators={[
                      "required",
                      "matchRegexp:^[a-zA-Z0-9 ]*$",
                      "matchRegexp:^.{0,50}$",
                    ]}
                    errorMessages={[
                      "Please enter user group name",
                      "Special charcters are not allowed",
                      "Maximum 50 characters",
                    ]}
                    fullWidth
                    id="groupName"
                    placeholder="User group name"
                    name="groupName"
                    onChange={handleChange}
                    value={formData.groupName}
                    InputLabelProps={{ shrink: false }}
                    className="global-input"
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
        ) : null}
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

export function getUserGroupById(users, id) {
  return users.find((user) => user.id === id) || null;
}

CreateUserGroup.propTypes = {
  userGroupDatas: PropTypes.array.isRequired,
  userGroupData: PropTypes.array.isRequired,
  LoadAllUserGroup: PropTypes.func.isRequired,
  AddUserGroup: PropTypes.func.isRequired,
  UpdateUserGroup: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const emptyObject = {};
  const userGroupData =
    id && state.usergroup.length > 0
      ? getUserGroupById(state.usergroup, id)
      : emptyObject;
  return {
    userGroupData,
    userGroupDatas: state.usergroup,
  };
}

const mapDispatchToProps = {
  LoadAllUserGroup: UserGroupAction.loadUserGroup,
  AddUserGroup: UserGroupAction.createUserGroup,
  UpdateUserGroup: UserGroupAction.updateUserGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUserGroup);
