import React, { Fragment, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { connect } from "react-redux";
import * as UserDesignationAction from "../../Redux/Action/designationAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import AlertBoxComponent from "../common/alert";
import ComponentLoadderComponent from "../common/loadder/componentloadder";

function AddDesignation(props) {
  const designationIdFromURL = props.match.params.id;
  const [activeStep, setActiveStep] = React.useState(0);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [formData, SetformData] = useState({
    id: "",
    name: "",
    attendanceGracetime: "00",
    description: "",
  });

  useEffect(() => {
    setComponentLoadder(true);
    if (designationIdFromURL != 0 && props.userGroupDatas.length > 0) {
      SetformData(props.userGroupData);
    }
    props
      .LoadData()
      .then((result) => {
        setComponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleBack = () => {
    // setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function UserBasicInfo(e) {
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    setshowLoadder(true);
    if (designationIdFromURL != 0) {
      var data = formData;
      data.attendanceGracetime = parseInt(data.attendanceGracetime);
      props
        .UpdateData(data)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Updated Designation details.");
          settoasterServerity("success");
          setisAlertBoxOpened(false);
          setTimeout(() => {
            props.history.push("/designation/all-designation");
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
      data.attendanceGracetime = parseInt(data.attendanceGracetime);
      props
        .AddData(data)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("New Designation has been added.");
          settoasterServerity("success");
          setisAlertBoxOpened(false);
          setTimeout(() => {
            props.history.push("/designation/all-designation");
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
    if (name == "name") {
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
          (x) => x.name.toLowerCase() == value.toLowerCase()
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
          (x) => x.name.toLowerCase() == value.toLowerCase()
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
    props.history.push("/designation/all-designation");
  }

  return (
    <>
      {componentLoadder ? (
        <ComponentLoadderComponent />
      ) : (
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
              to={`/designation/all-designation`}
              className="inactive"
            >
              Designations
            </LinkTo>
            <LinkTo color="textPrimary" href="#" className="active">
              {designationIdFromURL != 0
                ? "Update Designation"
                : "Create Designation"}
            </LinkTo>
          </Breadcrumbs>
          <Paper className={`main-paper`}>
            <ValidatorForm className={`global-form`} onSubmit={UserBasicInfo}>
              <Grid container spacing={3}>
                <Grid item container xs={12}>
                  <Grid item xs={3}>
                    <label className="required">Designation Name</label>
                  </Grid>
                  <Grid item xs={3}>
                    <TextValidator
                      variant="outlined"
                      validators={[
                        "required",
                        "matchRegexp:^[a-zA-Z0-9 ]*$",
                        "matchRegexp:^.{0,60}$",
                      ]}
                      errorMessages={[
                        "Please enter designation name",
                        "Special charcters are not allowed",
                        "Maximum 60 characters",
                      ]}
                      fullWidth
                      id="name"
                      placeholder="Designation name"
                      name="name"
                      onChange={handleChange}
                      value={formData.name ? formData.name : ""}
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
                    <label className="required">Attendance Grace Time</label>
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl variant="outlined">
                      <TextValidator
                        variant="outlined"
                        id="outlined-adornment-weight"
                        validators={[
                          "required",
                          "matchRegexp:^[0-9]*$",

                          "maxNumber:99",
                        ]}
                        errorMessages={[
                          "Please enter attendance grace time",
                          "Numbers allowed",
                          "Only two digits are allowed",
                        ]}
                        name="attendanceGracetime"
                        type={"number"}
                        value={
                          formData.attendanceGracetime
                            ? formData.attendanceGracetime
                            : ""
                        }
                        onChange={handleChange}
                        // endAdornment={
                        //   <InputAdornment position="end">Min</InputAdornment>
                        // }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">Min</InputAdornment>
                          ),
                        }}
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
                      value={formData.description ? formData.description : ""}
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
          </Paper>
        </div>
      )}
      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
    </>
  );
}

export function getUserGroupById(users, id) {
  return users.find((user) => user.id === id) || null;
}

AddDesignation.propTypes = {
  LoadData: PropTypes.array.isRequired,
  AddData: PropTypes.array.isRequired,
  UpdateData: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const emptyObject = {};
  const userGroupData =
    id && state.userDesignation.length > 0
      ? getUserGroupById(state.userDesignation, id)
      : emptyObject;
  return {
    userGroupData,
    userGroupDatas: state.userDesignation,
  };
}

const mapDispatchToProps = {
  LoadData: UserDesignationAction.loadUserDesignation,
  AddData: UserDesignationAction.createUserDesignation,
  UpdateData: UserDesignationAction.updateUserDesignation,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDesignation);
