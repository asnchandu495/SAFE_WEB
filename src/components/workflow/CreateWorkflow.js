import React from "react";

import { Fragment, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo, StaticRouter } from "react-router-dom";
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

import * as workflowAction from "../../Redux/Action/workflowAction";
import workflowService from "../../services/workflowService";

function CreateWorkflow(props) {
  const workflowId = props.match.params.id;
  const UserGroup = new UserGroupService();
  const CovidStateApi = new CovidStateApiServices();
  const [showLoadder, setshowLoadder] = useState(false);
  const [userGroupList, setuserGroupList] = useState();

  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");

  const [isDuplicate, setIsDuplicate] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [covidStatelist, setcovidStatelist] = useState([]);
  const [toCovidStatelist, setToCovidStatelist] = useState([]);
  const [selectedGroupName, setSelectedGroupName] = useState();
  const [selectedFromCovidState, setSelectedFromCovidState] = useState();
  const [selectedToCovidState, setSelectedToCovidState] = useState();

  const [formFieldValidation, setformFieldValidation] = useState({
    group: false,
    from: false,
    to: false,
  });

  const workflowApiCall = new workflowService();
  const [formData, SetformData] = useState({
    groupId: "",
    name: "",
    fromStateId: "",
    toStateId: "",
  });

  useEffect(() => {
    if (workflowId != 0) {
      Promise.all([
        UserGroup.loadUserGroup(),
        CovidStateApi.getCOVIDStates(),
        workflowApiCall.GetWorkFlowById(workflowId),
      ])
        .then(([getUserList, getCovidStates, workflowData]) => {
          setuserGroupList(getUserList);
          setcovidStatelist(getCovidStates);
          setToCovidStatelist(getCovidStates);
          SetformData(workflowData);
          let selectedGroup = {
            id: workflowData.groupId,
            groupName: workflowData.groupName,
          };
          setSelectedGroupName(selectedGroup);
          let fromStateObject = getCovidStates.find(
            (o) => o.id == workflowData.fromStateId
          );
          let toStateObject = getCovidStates.find(
            (o) => o.id == workflowData.toStateId
          );
          setSelectedFromCovidState(fromStateObject);
          setSelectedToCovidState(toStateObject);
          setComponentLoadder(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      Promise.all([UserGroup.loadUserGroup(), CovidStateApi.getCOVIDStates()])
        .then(([getUserList, getCovidStates]) => {
          setuserGroupList(getUserList);
          setcovidStatelist(getCovidStates);
          setToCovidStatelist(getCovidStates);
          setComponentLoadder(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  function handleChangeGroupName(event, value) {
    setisAlertBoxOpened(true);
    setSelectedGroupName(value);
  }

  function handleChangeFromCovidState(event, value) {
    setisAlertBoxOpened(true);
    setSelectedFromCovidState(value);
    setToCovidStatelist(
      covidStatelist.filter((state) => {
        return state.id != value.id;
      })
    );
  }

  function handleChangeToCovidState(event, value) {
    setisAlertBoxOpened(true);
    setSelectedToCovidState(value);
  }

  function handleChange(e) {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    if (name == "name") {
      checkUnqueName(value);
    }
    SetformData((formData) => ({
      ...formData,
      [name]: value,
    }));
  }

  function checkUnqueName(value) {
    if (props.match.params.id != 0) {
      if (props.workflowDatas && props.workflowDatas.length > 0) {
        let filteredData = props.workflowDatas.filter((x) => {
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
      if (props.workflowDatas && props.workflowDatas.length > 0) {
        let matchedValue = props.workflowDatas.find(
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

  function SelectUserGroupValidation() {
    if (selectedGroupName) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["group"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["group"]: true,
      }));
    }
  }

  function SelectFromStateValidation() {
    if (selectedFromCovidState) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["from"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["from"]: true,
      }));
    }
  }

  function SelectToStateValidation() {
    if (selectedToCovidState) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["to"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["to"]: true,
      }));
    }
  }

  function workflowCreation() {
    // e.preventDefault();
    SelectUserGroupValidation();
    SelectFromStateValidation();
    SelectToStateValidation();

    if (selectedGroupName && selectedToCovidState && selectedFromCovidState) {
      SubmitUserForm();
    } else {
      return false;
    }
  }

  function SubmitUserForm() {
    setshowLoadder(true);
    var workflowData = formData;
    if (workflowId != 0) {
      workflowData.groupId = selectedGroupName.id;
      workflowData.fromStateId = selectedFromCovidState.id;
      workflowData.toStateId = selectedToCovidState.id;
      props
        .UpdateWorkflowCall(workflowData)
        .then((result) => {
          setisAlertBoxOpened(false);
          setshowLoadder(false);
          setStateSnackbar(true);
          setToasterMessage("Workflow  Updated");
          settoasterServerity("success");
          setTimeout(() => {
            props.history.push("/workflow/allWorkflow");
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
      workflowData.groupId = selectedGroupName.id;
      workflowData.fromStateId = selectedFromCovidState.id;
      workflowData.toStateId = selectedToCovidState.id;

      props
        .CreateWorkflowCall(workflowData)
        .then((result) => {
          setisAlertBoxOpened(false);
          setStateSnackbar(true);
          setToasterMessage("Workflow  Created");
          settoasterServerity("success");
          setTimeout(() => {
            props.history.push("/workflow/allWorkflow");
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

  function redirectToList() {
    props.history.push("/workflow/allWorkflow");
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
          to={`/workflow/allWorkflow`}
          className="inactive"
        >
          Workflow
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          aria-current="page"
          className="active"
        >
          {workflowId != 0 ? "Update Workflow " : "Create   Workflow "}
        </LinkTo>
      </Breadcrumbs>
      <div>
        <Paper className={`main-paper`}>
          <Fragment>
            {!componentLoadder ? (
              <ValidatorForm
                className={`global-form`}
                onSubmit={workflowCreation}
              >
                <Grid container spacing={3}>
                  <Grid item container xs={12}>
                    <Grid item xs={3}>
                      <label className="input-label required">
                        Workflow Name
                      </label>
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
                        onChange={handleChange}
                        value={formData.name}
                        autoFocus
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

                  <Grid item cs={12} container>
                    <Grid item xs={3}>
                      <label className="required">User Group </label>
                    </Grid>
                    <Grid item xs={5}>
                      {/* <FormControl variant="outlined" fullWidth> */}
                      <Autocomplete
                        id="tags-outlined"
                        options={
                          userGroupList && userGroupList.length > 0
                            ? userGroupList
                            : []
                        }
                        getOptionLabel={(option) => option.groupName}
                        onChange={handleChangeGroupName}
                        defaultValue={
                          selectedGroupName ? selectedGroupName : ""
                        }
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select usergroup"
                            autoComplete="nope"
                          />
                        )}
                      />

                      {formFieldValidation.group ? (
                        <FormHelperText className="error-msg">
                          Please select group name{" "}
                        </FormHelperText>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Grid>

                  <Grid item container xs={12}>
                    <Grid item xs={3}>
                      <label
                        htmlFor="password"
                        className="input-label  required"
                      >
                        From State
                      </label>
                    </Grid>
                    <Grid item xs={5}>
                      <Autocomplete
                        id="tags-outlined"
                        options={
                          covidStatelist && covidStatelist.length > 0
                            ? covidStatelist
                            : []
                        }
                        getOptionLabel={(option) => option.stateName}
                        onChange={handleChangeFromCovidState}
                        name="fromStateId"
                        defaultValue={
                          selectedFromCovidState ? selectedFromCovidState : {}
                        }
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select state"
                            autoComplete="nope"
                          />
                        )}
                      />
                      {formFieldValidation.from ? (
                        <FormHelperText className="error-msg">
                          Please select Fromstate{" "}
                        </FormHelperText>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Grid>

                  <Grid item container xs={12}>
                    <Grid item xs={3}>
                      <label
                        htmlFor="password"
                        className="input-label required "
                      >
                        To State
                      </label>
                    </Grid>
                    <Grid item xs={5}>
                      <Autocomplete
                        id="tags-outlined"
                        options={
                          toCovidStatelist && toCovidStatelist.length > 0
                            ? toCovidStatelist
                            : []
                        }
                        getOptionLabel={(option) => option.stateName}
                        onChange={handleChangeToCovidState}
                        defaultValue={
                          selectedToCovidState ? selectedToCovidState : ""
                        }
                        name="toStateId"
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select state"
                            autoComplete="nope"
                          />
                        )}
                      />
                      {formFieldValidation.to ? (
                        <FormHelperText className="error-msg">
                          Please select Tostate{" "}
                        </FormHelperText>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    xs={12}
                    className={`inner-table-buttons`}
                  >
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
                          onClick={redirectToList}
                          className="global-cancel-btn"
                        >
                          Cancel
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </ValidatorForm>
            ) : (
              <ComponentLoadderComponent></ComponentLoadderComponent>
            )}
          </Fragment>
        </Paper>
      </div>
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

export function getWorkflowById(users, id) {
  return users.find((user) => user.id === id) || null;
}
CreateWorkflow.propTypes = {
  workflowDatas: PropTypes.array.isRequired,
  // workflowData: PropTypes.array.isRequired,
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
  LoadAllUserGroup: workflowAction.loadWorkflow,
  CreateWorkflowCall: workflowAction.createWorkflowData,
  UpdateWorkflowCall: workflowAction.updateWorkflowData,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateWorkflow);
