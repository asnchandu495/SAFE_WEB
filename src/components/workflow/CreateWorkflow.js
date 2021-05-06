import React from "react";

import { Fragment, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { connect } from "react-redux";
import * as TeamAction from "../../Redux/Action/teamAction";
import PropTypes from "prop-types";
import AlertBoxComponent from "../common/alert";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import Autocomplete from "@material-ui/lab/Autocomplete";
import UserGroupService from "../../services/userGroupService";
import CovidStateApiServices from "../../services/masterDataService";
import FormControl from "@material-ui/core/FormControl";

import * as worlflowAction from "../../Redux/Action/workflowAction";

function CreateWorkflow(props) {
  const UserGroup = new UserGroupService();
  const CovidStateApi = new CovidStateApiServices();
  const [showLoadder, setshowLoadder] = useState(false);
  const [userGroupList, setuserGroupList] = useState();
  const [formFieldValidation, setformFieldValidation] = useState({
    manager: false,
  });
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");

  const [isDuplicate, setIsDuplicate] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [covidStatelist, setcovidStatelist] = useState([]);
  const workflowId = props.match.params.id;

  const [formData, SetformData] = useState({
    id: "",
    name: "",
    description: "",
    manager: {},
  });

  useEffect(() => {
    Promise.all([UserGroup.loadUserGroup(), CovidStateApi.getCOVIDStates()])
      .then(([getUserList, getCovidStates]) => {
        setuserGroupList(getUserList);
        setcovidStatelist(getCovidStates);
        setComponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function workflowCreation(e) {
    e.preventDefault();
    SelectUserGroupValidation();
    // if (selectedTeamManager) {
    //   SubmitUserForm();
    // } else {
    //   return false;
    // }
  }

  function SubmitUserForm() {
    setshowLoadder(true);
    var workflowData = formData;
    if (workflowId != 0) {
      // workflowData.manager = selectedTeamManager;
      props
        .UpdateWorkflowCall(workflowData)
        .then((result) => {
          setisAlertBoxOpened(false);
          setshowLoadder(false);
          setStateSnackbar(true);
          setToasterMessage("Workflow  Updated");
          settoasterServerity("success");
          setTimeout(() => {
            props.history.push("");
            setshowLoadder(false);
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
      // workflowData.manager = selectedTeamManager;

      props
        .CreateWorkflowCall(workflowData)

        .then((result) => {
          setisAlertBoxOpened(false);
          setStateSnackbar(true);
          setToasterMessage("Workflow  Created");
          settoasterServerity("success");
          setTimeout(() => {
            props.history.push("");
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

  function SelectUserGroupValidation() {
    // if (selectedTeamManager) {
    //   setformFieldValidation((ValidationForm) => ({
    //     ...ValidationForm,
    //     ["manager"]: false,
    //   }));
    // } else {
    //   setformFieldValidation((ValidationForm) => ({
    //     ...ValidationForm,
    //     ["manager"]: true,
    //   }));
    // }
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
          to={`/teams/allteams`}
          className="inactive"
        >
          Workflow
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/teams/allteams`}
          className="inactive"
        >
          Create workflow
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <Paper className="main-paper">
          <ValidatorForm className={`global-form`} onSubmit={workflowCreation}>
            <Grid container spacing={3}>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="input-label ">Work Flow Name</label>
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
                      "Please Worlflow name",
                      "Special character  not allowed",
                      "Maximum 50 characters",
                    ]}
                    fullWidth
                    id="name"
                    placeholder="Worlflow name"
                    name="name"
                    autoComplete="name"
                    // onChange={handleChange}
                    // value={formData.name}
                    autoFocus
                    InputLabelProps={{ shrink: false }}
                    className="global-input"
                  />
                </Grid>
              </Grid>

              <Grid item cs={12} container>
                <Grid item xs={3}>
                  <label className="">User Group </label>
                </Grid>
                <Grid item xs={5}>
                  <FormControl variant="outlined" fullWidth>
                    <Autocomplete
                      id="tags-outlined"
                      options={
                        userGroupList && userGroupList.length > 0
                          ? userGroupList
                          : []
                      }
                      getOptionLabel={(option) => option.groupName}
                      defaultValue="#"
                      //   onChange={selectedUser}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select usergroup"
                        />
                      )}
                    />{" "}
                  </FormControl>
                </Grid>
              </Grid>

              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label htmlFor="password" className="input-label ">
                    From State
                  </label>
                </Grid>
                <Grid item xs={5}>
                  <Autocomplete
                    id="tags-outlined"
                    // /options={teamManagers}
                    options={
                      covidStatelist && covidStatelist.length > 0
                        ? covidStatelist
                        : []
                    }
                    getOptionLabel={(option) => option.stateName}
                    // onChange={(e, v) => handleChangeCovidState(e, v, i)}
                    // defaultValue={
                    //   tempsections.covidStates ? tempsections.covidStates : []
                    // }
                    name="covidState"
                    // defaultValue={x.covidState}
                    filterSelectedOptions
                    className="global-input autocomplete-select"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select   state"
                      />
                    )}
                  />
                  {formFieldValidation.manager ? (
                    <FormHelperText className="error-msg">
                      Please select from state{" "}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>

              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label htmlFor="password" className="input-label ">
                    To State
                  </label>
                </Grid>
                <Grid item xs={5}>
                  <Autocomplete
                    id="tags-outlined"
                    // /options={teamManagers}
                    options={
                      covidStatelist && covidStatelist.length > 0
                        ? covidStatelist
                        : []
                    }
                    getOptionLabel={(option) => option.stateName}
                    // onChange={(e, v) => handleChangeCovidState(e, v, i)}
                    // defaultValue={
                    //   tempsections.covidStates ? tempsections.covidStates : []
                    // }
                    name="covidState"
                    // defaultValue={x.covidState}
                    filterSelectedOptions
                    className="global-input autocomplete-select"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select   state"
                      />
                    )}
                  />
                  {formFieldValidation.manager ? (
                    <FormHelperText className="error-msg">
                      Please select To state{" "}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
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
                      onClick="#"
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
      ) : (
        <ComponentLoadderComponent />
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

// export default CreateWorkflow;

export function getWorkflowById(users, id) {
  return users.find((user) => user.id === id) || null;
}
CreateWorkflow.propTypes = {
  workflowDatas: PropTypes.array.isRequired,
  workflowData: PropTypes.array.isRequired,
  LoadAllUserGroup: PropTypes.func.isRequired,
  CreateWorkflowCall: PropTypes.func.isRequired,
  UpdateWorkflowCall: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const emptyObject = {};
  const workflowData =
    id && state.workflowState.length > 0
      ? getWorkflowById(state.workflowState, id)
      : emptyObject;
  return {
    workflowData,
    workflowDatas: state.workflowState,
  };
}

const mapDispatchToProps = {
  LoadAllUserGroup: worlflowAction.loadWorkflow,
  CreateWorkflowCall: worlflowAction.createWorkflowData,
  UpdateWorkflowCall: worlflowAction.updateWorkflowData,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateWorkflow);
