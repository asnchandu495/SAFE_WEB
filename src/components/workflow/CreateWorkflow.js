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
  const [formFieldValidation, setformFieldValidation] = useState({
    group: false,
    from: false,
    to: false,
  });
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

  // function resetForm() {
  //   SetformData({
  //     groupId: "",
  //     name: "",
  //     fromStateId: "",
  //     toStateId: "",
  //   });
  //   setSelectedGroupName(null);
  //   setSelectedFromCovidState(null);
  //   setSelectedToCovidState(null);
  // }
  /**
   * Method on change of groupname tovalidate and bind the data
   * @param  {} event
   * @param  {} value-groupname
   */
  function handleChangeGroupName(event, value) {
    setisAlertBoxOpened(true);
    setSelectedGroupName(value);
    if (value) {
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
  /**
   * Method on change of covid state to validate and bind the data
   * @param  {} event
   * @param  {} value-covid state name
   */
  function handleChangeFromCovidState(event, value) {
    setisAlertBoxOpened(true);
    setSelectedFromCovidState(value);
    if (value) {
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
    // setToCovidStatelist(
    //   covidStatelist.filter((state) => {
    //     return state.id != value.id;
    //   })
    // );
  }

  function handleChangeToCovidState(event, value) {
    setisAlertBoxOpened(true);
    setSelectedToCovidState(value);
    if (value) {
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
  //Method onchange of for feilds to bind the data
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
  /**
   * Check Unque Name
   * Check if any duplicate workdflow   exists
   * @param  {} value-{workdlow name}
   */
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

  //Validation for the user group dropdown after submit
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
  //Validation for the From state dropdown after submit
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
  //Validation for the To  state dropdown after submit
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
  //After submit for the validation
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
  //Method after form submit to add or update workflow
  function SubmitUserForm() {
    setshowLoadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
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
  //Method to redirect on click of cancel
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
                        validators={["required", "matchRegexp:^.{0,50}$"]}
                        errorMessages={[
                          "Please enter workflow name",
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
                        id="tags-outlinedGroup"
                        label=""
                        options={
                          userGroupList && userGroupList.length > 0
                            ? userGroupList
                            : []
                        }
                        getOptionLabel={(option) => option.groupName}
                        onChange={handleChangeGroupName}
                        defaultValue={selectedGroupName}
                        value={selectedGroupName}
                        name="groupId"
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select user group"
                            autoComplete="nope"
                          />
                        )}
                      />

                      {formFieldValidation.group ? (
                        <FormHelperText className="error-msg">
                          Please select group name
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
                        COVID State From
                      </label>
                    </Grid>
                    <Grid item xs={5}>
                      <Autocomplete
                        id="tags-outlinedFrom"
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
                          Please select COVID state From
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
                        COVID State To
                      </label>
                    </Grid>
                    <Grid item xs={5}>
                      <Autocomplete
                        id="tags-outlinedTo"
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
                          Please select COVID state To
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
                        {/* <Button
                          variant="contained"
                          type="reset"
                          onClick={resetForm}
                          className="global-cancel-btn"
                        >
                          Reset
                        </Button> */}
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
/**
 * Get Usergroup Id
 * Method to find the user on id return 1st  matched element
 * @param  {} users-- workflow id from object
 * @param  {} id--- with id
 */
export function getWorkflowById(users, id) {
  return users.find((user) => user.id === id) || null;
}
//Validates data which are recevied from props
CreateWorkflow.propTypes = {
  workflowDatas: PropTypes.array.isRequired,
  // workflowData: PropTypes.array.isRequired,
  LoadAllUserGroup: PropTypes.func.isRequired,
  CreateWorkflowCall: PropTypes.func.isRequired,
  UpdateWorkflowCall: PropTypes.func.isRequired,
};
//To update the redux store and merge into props component
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

// Customizing the functions your component receives, and how they dispatch actions
const mapDispatchToProps = {
  LoadAllUserGroup: workflowAction.loadWorkflow,
  CreateWorkflowCall: workflowAction.createWorkflowData,
  UpdateWorkflowCall: workflowAction.updateWorkflowData,
};
//Connects a React component to a Redux store
export default connect(mapStateToProps, mapDispatchToProps)(CreateWorkflow);
