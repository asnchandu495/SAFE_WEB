import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
import * as UserAction from "../../Redux/Action/userAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import AlertBoxComponent from "../common/alert";
import UserService from "../../services/usersService";
import UserGroupService from "../../services/userGroupService";
import MasterService from "../../services/masterDataService";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import { Prompt } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: 25,
  },
  stepButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    marginBottom: -3,
    width: 20,
    height: 20,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
    margin: 0,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  errorSpanMsg: {
    color: "red",
  },
  HideGrid: {
    display: "none",
  },
}));

const UserPrimaryGroup = [
  { id: "1", name: "Sumeru Samvit" },
  { id: "2", name: "Sumeru baneerghatta" },
];

const UserSecondaryGroup = [
  { id: "1", name: "Sumeru hyderbad" },
  { id: "2", name: "Sumeru mumbai" },
];

function CreateUser(props) {
  const usersApiCall = new UserService();
  const masterDataCallApi = new MasterService();
  const userGroupApiCall = new UserGroupService();

  const userId = props.match.params.id;
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [designationMasterData, setdesignationMasterData] = useState();
  const [BusinessTeamMasterData, setBusinessTeamMasterData] = useState();
  const [isDirty, setIsDirty] = useState(false);
  const [
    BusinessUserRoleMasterData,
    setBusinessUserRoleMasterData,
  ] = useState();

  const [
    UserPrimaryGroupMasterData,
    setUserPrimaryGroupMasterData,
  ] = useState();
  const [
    UserSecondaryGroupMasterData,
    setUserSecondaryGroupMasterData,
  ] = useState();
  const [
    UserPrimaryGroupMasterDataOriginal,
    setUserPrimaryGroupMasterDataOriginal,
  ] = useState();
  const [
    UserSecondaryGroupMasterDataOriginal,
    setUserSecondaryGroupMasterDataOriginal,
  ] = useState();
  const [AllSupervisorRole, setAllSupervisorRole] = useState();
  const [CountryMasterData, setCountryMasterData] = useState();
  const [SiteMasterData, setSiteMasterData] = useState();
  const [UserSelectedTeamValue, setUserSelectedTeamValue] = useState([]);
  const [UserSelectedRoleValue, setUserSelectedRoleValue] = useState([]);
  const [UserSelectSiteValue, setUserSelectSiteValue] = useState([]);
  const [
    UserSelectedPrimaryGroupValue,
    setUserSelectedPrimaryGroupValue,
  ] = useState();
  const [
    UserSelectedDesignationValue,
    setUserSelectedDesignationValue,
  ] = useState();
  const [
    UserSelectedSecondaryGroupValue,
    setUserSelectedSecondaryGroupValue,
  ] = useState([]);
  const [UserSelectCountry, setUserSelectCountry] = useState();
  const [UserSelectSupervisorData, setUserSelectSupervisorData] = useState();
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [showLoadder, setshowLoadder] = useState(false);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [formFieldValidation, setformFieldValidation] = useState({
    Gender: false,
    designation: false,
    Role: false,
    Team: false,
    primaryGroup: false,
    covidState: false,
    country: false,
    site: false,
    supervisor: false,
  });

  const [formData, SetformData] = useState({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    emailID: "",
    userId: "",
    contactNumber: "",
    alternateContactNumber: "",
    designation: "",
    applicationUserToRole: [],
    group: "",
    applicationUserToSecondaryGroup: [],
    applicationUserToSite: [],
    applicationUserToTeamMapping: [],
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    supervisorId: "",
    supervisor: "",
    zipCode: null,
  });

  const [resetformData, SetresetformData] = useState({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    emailID: "",
    userId: "",
    contactNumber: "",
    alternateContactNumber: "",
    designation: "",
    applicationUserToRole: [],
    group: "",
    applicationUserToSecondaryGroup: [],
    applicationUserToSite: [],
    applicationUserToTeamMapping: [],
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    supervisorId: "",
    supervisor: "",
    zipCode: null,
  });

  useEffect(() => {
    setcomponentLoadder(true);
    if (userId) {
      usersApiCall.GetApplicationUsersById(userId).then((userData) => {
        SetformData(userData);
        setUserSelectedTeamValue(userData.applicationUserToTeamMapping);
        setUserSelectedDesignationValue(userData.designation);
        setUserSelectedRoleValue(userData.applicationUserToRole);
        setUserSelectSiteValue(userData.applicationUserToSite);
        setUserSelectedPrimaryGroupValue(userData.group);
        setUserSelectedSecondaryGroupValue(
          userData.applicationUserToSecondaryGroup
        );
        setUserSelectCountry(userData.country);
        setUserSelectSupervisorData(userData.supervisor);
      });
    }

    Promise.all([
      masterDataCallApi.getDesignations(),
      masterDataCallApi.getCountries(),
      masterDataCallApi.getTeams(),
      masterDataCallApi.getSites(),
      masterDataCallApi.getUserRoles(),
      userGroupApiCall.loadUserGroup(),
      masterDataCallApi.getAllSuperVisor(),
    ])
      .then(
        ([
          getDesignations,
          getCountries,
          getTeams,
          getSites,
          getUserRoles,
          UserGroup,
          getAllSuperVisor,
        ]) => {
          setdesignationMasterData(getDesignations);
          setCountryMasterData(getCountries);
          setBusinessTeamMasterData(getTeams);
          setSiteMasterData(getSites);
          setBusinessUserRoleMasterData(getUserRoles);
          setUserPrimaryGroupMasterData(UserGroup);
          setUserSecondaryGroupMasterData(UserGroup);
          setAllSupervisorRole(getAllSuperVisor);
          setUserPrimaryGroupMasterDataOriginal(UserGroup);
          setUserSecondaryGroupMasterDataOriginal(UserGroup);
          setcomponentLoadder(false);
        }
      )
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function UserBasicInfo(e) {
    e.preventDefault();
    if (userId) {
      SelectGenderValidation();
      SelectDesignationValidation();
      SelectCountryValidation();
      SelectSuperVisorValidation();
      if (
        formData.gender &&
        UserSelectedDesignationValue &&
        UserSelectSupervisorData &&
        UserSelectCountry
      ) {
        SubmitUserForm();
      } else {
        return false;
      }
    } else {
      SelectGenderValidation();
      SelectDesignationValidation();
      SelectRoleValidation();
      SelectTeamValidation();
      SelectPrimaryGroupValidation();
      SelectCountryValidation();
      SelectUserSiteValidation();
      SelectSuperVisorValidation();
      if (
        formData.gender &&
        UserSelectedRoleValue.length > 0 &&
        UserSelectedTeamValue.length > 0 &&
        UserSelectedPrimaryGroupValue &&
        UserSelectedDesignationValue &&
        UserSelectSupervisorData &&
        UserSelectCountry &&
        UserSelectSiteValue.length > 0
      ) {
        SubmitUserForm();
      } else {
        return false;
      }
    }
  }

  function SubmitUserForm() {
    setshowLoadder(true);
    if (userId) {
      formData.country = UserSelectCountry;
      formData.designation = {
        id: UserSelectedDesignationValue.id,
        name: UserSelectedDesignationValue.name,
      };
      // formData.zipCode = parseInt(formData.zipCode);
      console.log(UserSelectedDesignationValue);
      console.log(formData);
      // data.supervisor = UserSelectSupervisorData;
      // data.supervisorId = UserSelectSupervisorData.id;
      props
        .UpdateUser(formData)
        .then((result) => {
          setisAlertBoxOpened(false);
          setStateSnackbar(true);
          setToasterMessage("Updated user details.");
          settoasterServerity("success");
          setshowLoadder(false);
        })
        .catch((err) => {
          console.log(err);
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      var data = formData;
      data.applicationUserToRole = UserSelectedRoleValue;
      data.group = UserSelectedPrimaryGroupValue;
      data.applicationUserToSecondaryGroup = UserSelectedSecondaryGroupValue;
      data.country = UserSelectCountry;
      data.applicationUserToSite = UserSelectSiteValue;
      data.applicationUserToTeamMapping = UserSelectedTeamValue;
      data.designation = UserSelectedDesignationValue;
      // data.zipCode = parseInt(data.zipCode);
      data.supervisor = UserSelectSupervisorData;
      data.supervisorId = UserSelectSupervisorData.applicationUserId;

      props
        .AddUser(data)
        .then((result) => {
          setisAlertBoxOpened(false);
          setStateSnackbar(true);
          setToasterMessage("User has been added.");
          settoasterServerity("success");
          setTimeout(() => {
            props.history.push(`/users/allusers`);
            setshowLoadder(false);
          }, 8000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    }
  }

  function SelectGenderValidation() {
    if (formData.gender) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["gender"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["gender"]: true,
      }));
    }
  }

  function SelectDesignationValidation() {
    if (UserSelectedDesignationValue) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["designation"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["designation"]: true,
      }));
    }
  }

  function SelectRoleValidation() {
    if (UserSelectedRoleValue.length > 0) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["Role"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["Role"]: true,
      }));
    }
  }

  function SelectTeamValidation() {
    if (UserSelectedTeamValue.length > 0) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["Team"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["Team"]: true,
      }));
    }
  }

  function SelectPrimaryGroupValidation() {
    if (UserSelectedPrimaryGroupValue) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["primaryGroup"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["primaryGroup"]: true,
      }));
    }
  }

  function SelectCountryValidation() {
    if (UserSelectCountry) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["country"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["country"]: true,
      }));
    }
  }

  function SelectSuperVisorValidation() {
    if (UserSelectSupervisorData) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["supervisor"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["supervisor"]: true,
      }));
    }
  }

  function SelectUserSiteValidation() {
    if (UserSelectSiteValue.length > 0) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["site"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["site"]: true,
      }));
    }
  }

  function handleChangeTeam(event, value) {
    setisAlertBoxOpened(true);
    setUserSelectedTeamValue(value);
  }
  function userSelectSite(event, value) {
    setisAlertBoxOpened(true);
    setUserSelectSiteValue(value);
  }

  function handleChangeUserRole(event, value) {
    setisAlertBoxOpened(true);
    setUserSelectedRoleValue(value);
  }

  function handleChangeUserPrimaryGroup(event, value) {
    setisAlertBoxOpened(true);
    if (value) {
      let currentSGroupData = UserSecondaryGroupMasterDataOriginal;
      let filteredSGroupData = currentSGroupData.filter((sgroup) => {
        return sgroup.id != value.id;
      });
      setUserSecondaryGroupMasterData(filteredSGroupData);
    }
    setUserSelectedPrimaryGroupValue(value);
  }

  function handleChangeUserDesignation(event, value) {
    setisAlertBoxOpened(true);
    setUserSelectedDesignationValue(value);
  }

  function handleChangeUserSecondaryGroup(event, value) {
    setisAlertBoxOpened(true);
    let currentPGroupData = UserPrimaryGroupMasterDataOriginal;
    let filteredPGroupData = currentPGroupData.filter(
      (elem) => !value.find(({ id }) => elem.id == id)
    );
    setUserPrimaryGroupMasterData(filteredPGroupData);
    setUserSelectedSecondaryGroupValue(value);
  }

  function handleChangeCountry(event, value) {
    setisAlertBoxOpened(true);
    setUserSelectCountry(value);
  }

  function handleChangeSuperVisor(event, value) {
    setisAlertBoxOpened(true);
    setUserSelectSupervisorData(value);
  }

  function handleChange(e) {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    SetformData((logInForm) => ({
      ...logInForm,
      [name]: value,
    }));
  }

  function redirectUsersListPage() {
    props.history.push("/users/allusers");
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
          to={`/users/allusers`}
          className="inactive"
        >
          Users
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          {userId ? "Update basic info" : "Add new user"}
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <Paper className={`main-paper`}>
          <Fragment>
            <ValidatorForm
              className={`global-form inline-form`}
              onSubmit={UserBasicInfo}
            >
              <Grid container spacing={3}>
                <Grid item container spacing={1} sm={12}>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label required">
                      First name
                    </label>
                    <TextValidator
                      variant="outlined"
                      validators={[
                        "required",
                        "matchRegexp:^[a-zA-Z ]*$",
                        "matchRegexp:^.{0,50}$",
                      ]}
                      errorMessages={[
                        "Please enter first name",
                        "Only alphabets are allowed",
                        "Maximum 50 characters",
                      ]}
                      fullWidth
                      id="firstName"
                      placeholder="First Name"
                      name="firstName"
                      autoComplete="firstName"
                      onChange={handleChange}
                      value={formData.firstName}
                      autoFocus
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label">
                      Middle name
                    </label>
                    <TextValidator
                      variant="outlined"
                      validators={[
                        "matchRegexp:^[a-zA-Z ]*$",
                        "matchRegexp:^.{0,50}$",
                      ]}
                      errorMessages={[
                        "Only alphabets are allowed",
                        "Maximum 50 characters",
                      ]}
                      fullWidth
                      id="middleName"
                      placeholder="Middle Name"
                      name="middleName"
                      autoComplete="middleName"
                      onChange={handleChange}
                      value={formData.middleName}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label required">
                      Last name
                    </label>
                    <TextValidator
                      variant="outlined"
                      fullWidth
                      id="lastName"
                      validators={[
                        "required",
                        "matchRegexp:^[a-zA-Z ]*$",
                        "matchRegexp:^.{0,50}$",
                      ]}
                      errorMessages={[
                        "Please enter last name",
                        "Only alphabets are allowed",
                        "Maximum 50 characters",
                      ]}
                      placeholder="Last Name"
                      name="lastName"
                      autoComplete="lastName"
                      onChange={handleChange}
                      value={formData.lastName}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label required">
                      Gender
                    </label>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        id="demo-simple-select-outlined-label"
                        shrink={false}
                        className="select-label"
                      >
                        {formData.gender == "" ? "Gender" : ""}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={formData.gender}
                        name="gender"
                        onChange={handleChange}
                        placeholder="Gender"
                        InputLabelProps={{ shrink: false }}
                        className="global-input single-select"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={"Male"}>Male</MenuItem>
                        <MenuItem value={"Female"}>Female</MenuItem>
                        <MenuItem value={"Others"}>Others</MenuItem>
                      </Select>
                    </FormControl>
                    {formFieldValidation.gender ? (
                      <FormHelperText className="error-msg">
                        Please select gender{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label required">
                      Email id
                    </label>
                    <TextValidator
                      variant="outlined"
                      fullWidth
                      id="emailId"
                      placeholder="Email Id"
                      validators={[
                        "required",
                        "isEmail",
                        "matchRegexp:^.{0,50}$",
                      ]}
                      errorMessages={[
                        "Please enter email id",
                        "Email id is not valid",
                        "Maximum 50 characters",
                      ]}
                      name="emailID"
                      autoComplete="emailID"
                      onChange={handleChange}
                      value={formData.emailID}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label required">
                      User id
                    </label>
                    <TextValidator
                      disabled={userId ? true : false}
                      variant="outlined"
                      fullWidth
                      id="userId"
                      placeholder="User Id"
                      validators={[
                        "required",
                        "matchRegexp:^[0-9]*$",
                        "maxNumber:9999999999",
                      ]}
                      errorMessages={[
                        "Please enter user id",
                        "Only numbers are allowed",
                        "Maximum allowed 10 digits",
                      ]}
                      name="userId"
                      autoComplete="userId"
                      onChange={handleChange}
                      value={formData.userId}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label required">
                      Mobile number
                    </label>
                    <TextValidator
                      variant="outlined"
                      fullWidth
                      id="contactNumber"
                      placeholder="Mobile Number"
                      validators={[
                        "required",
                        "minNumber:0",
                        "maxNumber:9999999999",
                        "matchRegexp:^[0-9]*$",
                      ]}
                      errorMessages={[
                        "Please enter mobile number",
                        "Enter valid number",
                        "Maximum allowed 10 digits",
                        "Only numbers are allowed",
                      ]}
                      name="contactNumber"
                      autoComplete="contactNumber"
                      onChange={handleChange}
                      value={formData.contactNumber}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label">
                      Alternate mobile number
                    </label>
                    <TextValidator
                      variant="outlined"
                      fullWidth
                      id="alternateContactNumber"
                      placeholder="Alternate Mobile Number"
                      name="alternateContactNumber"
                      autoComplete="alternateContactNumber"
                      onChange={handleChange}
                      value={formData.alternateContactNumber}
                      validators={[
                        "minNumber:0",
                        "maxNumber:9999999999",
                        "matchRegexp:^[0-9]*$",
                      ]}
                      errorMessages={[
                        "Enter valid number",
                        "Maximum allowed 10 digits",
                        "Only numbers are allowed",
                      ]}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label required">
                      Designation
                    </label>
                    <Autocomplete
                      id="tags-outlined"
                      options={
                        designationMasterData &&
                        designationMasterData.length > 0
                          ? designationMasterData
                          : []
                      }
                      getOptionLabel={(option) => option.name}
                      defaultValue={UserSelectedDesignationValue}
                      onChange={handleChangeUserDesignation}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select designation"
                        />
                      )}
                    />
                    {formFieldValidation.designation ? (
                      <FormHelperText className="error-msg">
                        Please select designation{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    className={[userId ? classes.HideGrid : ""].join(" ")}
                  >
                    <label htmlFor="password" className="input-label required">
                      Supervisor
                    </label>
                    <Autocomplete
                      id="tags-outlined"
                      options={AllSupervisorRole}
                      getOptionLabel={(option) => option.name}
                      onChange={handleChangeSuperVisor}
                      defaultValue={UserSelectSupervisorData}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select users"
                        />
                      )}
                    />
                    {formFieldValidation.supervisor ? (
                      <FormHelperText className="error-msg">
                        Please select supervisor{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    className={[userId ? classes.HideGrid : ""].join(" ")}
                  >
                    <label htmlFor="password" className="input-label required">
                      Teams
                    </label>
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={
                        BusinessTeamMasterData &&
                        BusinessTeamMasterData.length > 0
                          ? BusinessTeamMasterData
                          : []
                      }
                      getOptionLabel={(option) => option.name}
                      defaultValue={UserSelectedTeamValue}
                      onChange={handleChangeTeam}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select user team"
                        />
                      )}
                    />
                    {formFieldValidation.Team ? (
                      <FormHelperText className="error-msg">
                        Please select team{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    className={[userId ? classes.HideGrid : ""].join(" ")}
                  >
                    <label htmlFor="password" className="input-label required">
                      Roles
                    </label>
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={
                        BusinessUserRoleMasterData &&
                        BusinessUserRoleMasterData.length > 0
                          ? BusinessUserRoleMasterData
                          : []
                      }
                      getOptionLabel={(option) => option.description}
                      defaultValue={UserSelectedRoleValue}
                      onChange={handleChangeUserRole}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select user roles"
                        />
                      )}
                    />
                    {formFieldValidation.Role ? (
                      <FormHelperText className="error-msg">
                        Please select role{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    className={[userId ? classes.HideGrid : ""].join(" ")}
                  >
                    <label htmlFor="password" className="input-label required">
                      Primary group
                    </label>
                    <Autocomplete
                      id="tags-outlined"
                      options={
                        UserPrimaryGroupMasterData &&
                        UserPrimaryGroupMasterData.length > 0
                          ? UserPrimaryGroupMasterData
                          : []
                      }
                      getOptionLabel={(option) => option.groupName}
                      defaultValue={UserSelectedPrimaryGroupValue}
                      onChange={handleChangeUserPrimaryGroup}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select primary group"
                        />
                      )}
                    />
                    {formFieldValidation.primaryGroup ? (
                      <FormHelperText className="error-msg">
                        Please select primary group{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    className={[userId ? classes.HideGrid : ""].join(" ")}
                  >
                    <label htmlFor="password" className="input-label">
                      Secondary group
                    </label>
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      onChange={handleChangeUserSecondaryGroup}
                      options={
                        UserSecondaryGroupMasterData &&
                        UserSecondaryGroupMasterData.length > 0
                          ? UserSecondaryGroupMasterData
                          : []
                      }
                      getOptionLabel={(option) => option.groupName}
                      defaultValue={UserSelectedSecondaryGroupValue}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select secondary group"
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    className={[userId ? classes.HideGrid : ""].join(" ")}
                  >
                    <label htmlFor="password" className="input-label required">
                      Sites
                    </label>
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={
                        SiteMasterData && SiteMasterData.length > 0
                          ? SiteMasterData
                          : []
                      }
                      getOptionLabel={(option) => option.name}
                      defaultValue={UserSelectSiteValue}
                      onChange={userSelectSite}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select site"
                        />
                      )}
                    />
                    {formFieldValidation.site ? (
                      <FormHelperText className="error-msg">
                        Please select site{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label required">
                      Address 1
                    </label>
                    <TextValidator
                      variant="outlined"
                      fullWidth
                      id="address1"
                      placeholder="Address 1"
                      name="address1"
                      autoComplete="address1"
                      onChange={handleChange}
                      value={formData.address1}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                      validators={["required", "matchRegexp:^.{0,150}$"]}
                      errorMessages={[
                        "Please enter the address",
                        "Maximum 150 characters are allowed",
                      ]}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label">
                      Address 2
                    </label>
                    <TextValidator
                      variant="outlined"
                      fullWidth
                      id="address2"
                      placeholder="Address 2"
                      name="address2"
                      autoComplete="address2"
                      onChange={handleChange}
                      value={formData.address2}
                      validators={["matchRegexp:^.{0,150}$"]}
                      errorMessages={["Maximum 150 characters are allowed"]}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label required">
                      City
                    </label>
                    <TextValidator
                      variant="outlined"
                      validators={[
                        "matchRegexp:^[a-zA-Z ]*$",
                        "matchRegexp:^.{0,60}$",
                      ]}
                      errorMessages={[
                        "Only alphabets are allowed",
                        "Maximum 60 characters are allowed",
                      ]}
                      fullWidth
                      id="city"
                      placeholder="City"
                      name="city"
                      autoComplete="city"
                      onChange={handleChange}
                      value={formData.city}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label">
                      State
                    </label>
                    <TextValidator
                      variant="outlined"
                      validators={[
                        "matchRegexp:^[a-zA-Z ]*$",
                        "matchRegexp:^.{0,60}$",
                      ]}
                      errorMessages={[
                        "Only alphabets are allowed",
                        "Maximum 60 characters are allowed",
                      ]}
                      fullWidth
                      id="state"
                      placeholder="State"
                      name="state"
                      autoComplete="state"
                      onChange={handleChange}
                      value={formData.state}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label required">
                      Country
                    </label>
                    <Autocomplete
                      id="tags-outlined"
                      options={CountryMasterData}
                      getOptionLabel={(option) => option.name}
                      onChange={handleChangeCountry}
                      defaultValue={UserSelectCountry}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Country of Residence"
                        />
                      )}
                    />
                    {formFieldValidation.country ? (
                      <FormHelperText className="error-msg">
                        Please select country of residence{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item sm={4}>
                    <label htmlFor="password" className="input-label required">
                      Postal / Zip Code
                    </label>
                    <TextValidator
                      variant="outlined"
                      validators={["required"]}
                      errorMessages={["Please enter zipcode"]}
                      fullWidth
                      id="zipCode"
                      placeholder="Postal / Zip Code"
                      name="zipCode"
                      autoComplete="zipCode"
                      onChange={handleChange}
                      value={formData.zipCode}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} className={`inner-table-buttons`}>
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
                          onClick={redirectUsersListPage}
                          className="global-cancel-btn"
                        >
                          Cancel
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </ValidatorForm>
          </Fragment>
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

//  export default CreateUser;

CreateUser.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);
