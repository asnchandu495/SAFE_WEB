import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import * as UserSiteAction from "../../Redux/Action/siteAction";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SiteService from "../../services/siteService";
import FormHelperText from "@material-ui/core/FormHelperText";
import MasterService from "../../services/masterDataService";
import AlertBoxComponent from "../common/alert";
import TooltipComponent from "../common/tooltip";
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "react-dom";
import Checkbox from "@material-ui/core/Checkbox";

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
}));

const siteManger = [
  {
    name: "Prakash",
    value: "Prakash",
  },
  {
    name: "Akash",
    value: "Akash",
  },
  {
    name: "Chandru",
    value: "Chandru",
  },
];

const securityManger = [
  {
    name: "Krathik",
    value: "Krathik",
  },
  {
    name: "Sunil",
    value: "Sunil",
  },
  {
    name: "Sagar",
    value: "Sagar",
  },
];

function CreateSite(props) {
  const siteId = props.match.params.id;
  const siteApiCall = new SiteService();
  const masterDataCallApi = new MasterService();
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [CountryMasterData, setCountryMasterData] = useState([]);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [allLanguages, setAllLanguages] = useState([]);
  const [siteManger, setSiteManger] = useState([]);
  const [securityManger, setSecurityManger] = useState([]);
  const [siteLead, setSiteLead] = useState([]);
  const [siteBHR, setSiteBHR] = useState([]);
  const [userSelectedSiteManager, setUserSelectedSiteManager] = useState();
  const [userSelectedSecurityManager, setUserSelectedSecurityManager] =
    useState();
  const [siteSelectedLead, setSiteSelectedLead] = useState();
  const [siteSelectedBHR, setSiteSelectedBHR] = useState();

  const [formData, SetformData] = useState({
    id: "",
    name: "",
    description: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    countryId: "",
    zipCode: "",
    siteManager: "",
    siteManagerName: "",
    noFloors: "",
    securityManager: "",
    securityManagerName: "",
    floors: [],
    locations: [],
    isRLAPActive: false,
    rlapReferenceId: "",
    securityLead: "",
    siteBHR: "",
    securityLeadName: "",
    siteBHRName: "",
  });

  const [formFieldValidation, setformFieldValidation] = useState({
    securityManager: false,
    siteManager: false,
    country: false,
  });

  useEffect(() => {
    setComponentLoadder(true);
    Promise.all([
      masterDataCallApi.getCountries(),
      siteApiCall.getSiteManagers(),
      siteApiCall.getLocationManagers(),
      siteApiCall.getSiteLeaders(),
      siteApiCall.getSiteBHR(),
      props.LoadData(),
    ])
      .then(
        ([
          getCountries,
          getSiteManagers,
          getLocationManagers,
          getSiteLeaders,
          getSiteBHR,
          loadData,
        ]) => {
          if (siteId) {
            siteApiCall
              .getSiteById(siteId)
              .then((siteDetails) => {
                setUserSelectedSecurityManager({
                  applicationUserId: siteDetails.securityManager,
                  name: siteDetails.securityManagerName,
                });
                setUserSelectedSiteManager({
                  applicationUserId: siteDetails.siteManager,
                  name: siteDetails.siteManagerName,
                });
                setSiteSelectedLead({
                  applicationUserId: siteDetails.securityLead,
                  name: siteDetails.securityLeadName,
                });
                setSiteSelectedBHR({
                  applicationUserId: siteDetails.siteBHR,
                  name: siteDetails.siteBHRName,
                });
                setSiteLead(getSiteLeaders);
                setSiteBHR(getSiteBHR);
                SetformData(siteDetails);
                setCountryMasterData(getCountries);
                setSiteManger(getSiteManagers);
                setSecurityManger(getLocationManagers);
                setComponentLoadder(false);
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            setSiteLead(getSiteLeaders);
            setSiteBHR(getSiteBHR);
            setCountryMasterData(getCountries);
            setSiteManger(getSiteManagers);
            setSecurityManger(getLocationManagers);
            setComponentLoadder(false);
          }
        }
      )
      .catch((error) => {
        console.log(error);
      });
  }, []);
  /**
   * User basisc info
   * Method on after form submit to validate the form feilds
   * @param  {} e
   */
  function UserBasicInfo(e) {
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    SelectCountryValidation();
    SelectSiteManagerValidation();
    SelectSecurityManagerValidation();
    if (
      formData.countryId &&
      userSelectedSiteManager.applicationUserId != null &&
      userSelectedSecurityManager.applicationUserId != null
    ) {
      submitCreateSiteForm();
    } else {
      return false;
    }
  }
  /**
   * Select country validation
   * Method onchange of country dropdown
   */
  function SelectCountryValidation() {
    if (formData.countryId) {
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
  /**
   * Select site manager validation
   * Method onchange of site manager dropdown
   */
  function SelectSiteManagerValidation() {
    if (
      userSelectedSiteManager &&
      userSelectedSiteManager.applicationUserId != null
    ) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["siteManager"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["siteManager"]: true,
      }));
    }
  }

  /**
   * Select security manager validation
   * Method onchange of security manager dropdown
   */
  function SelectSecurityManagerValidation() {
    if (
      userSelectedSecurityManager &&
      userSelectedSecurityManager.applicationUserId != null
    ) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["securityManager"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["securityManager"]: true,
      }));
    }
  }
  /**
   * Submit create site form
   * Method to  add or update a site
   */
  function submitCreateSiteForm() {
    setshowLoadder(true);
    var data = formData;
    if (!siteId) {
      // data.zipCode = parseInt(data.zipCode);
      data.siteManager = userSelectedSiteManager.applicationUserId;
      data.siteManagerName = userSelectedSiteManager.name;

      data.securityManager = userSelectedSecurityManager.applicationUserId;
      data.securityManagerName = userSelectedSecurityManager.name;

      data.securityLead = siteSelectedLead.applicationUserId;
      data.securityLeadName = siteSelectedLead.name;

      data.siteBHR = siteSelectedBHR.applicationUserId;
      data.siteBHRName = siteSelectedBHR.name;
      props
        .AddData(data)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Added new Site.");
          settoasterServerity("success");
          setshowLoadder(false);
          setisAlertBoxOpened(false);
          setTimeout(() => {
            props.history.push("/site/all-site");
          }, 3000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      // data.zipCode = parseInt(data.zipCode);
      formData.siteManager = userSelectedSiteManager.applicationUserId;
      formData.siteManagerName = userSelectedSiteManager.name;

      formData.securityManager = userSelectedSecurityManager.applicationUserId;
      formData.securityManagerName = userSelectedSecurityManager.name;

      formData.securityLead = siteSelectedLead.applicationUserId;
      formData.securityLeadName = siteSelectedLead.name;

      formData.siteBHR = siteSelectedBHR.applicationUserId;
      formData.siteBHRName = siteSelectedBHR.name;
      props
        .UpdateData(formData)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Updated Site details.");
          settoasterServerity("success");
          setshowLoadder(false);
          setisAlertBoxOpened(false);
          setTimeout(() => {
            props.history.push("/site/all-site");
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

  /**
   * Handle change
   * Binding data with the form fields also calls the check unique function
   * @param  {} e
   */

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
  /**
   * Check unique name
   * Method to check if there's any duplicacy in the location name
   * @param  {} value-text feild name
   */
  function checkUnqueName(value) {
    if (props.match.params.id != 0) {
      if (props.SiteData && props.SiteData.length > 0) {
        let filteredData = props.SiteData.filter((x) => {
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
      if (props.SiteData && props.SiteData.length > 0) {
        let matchedValue = props.SiteData.find(
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
  /**
   * Method on change of site manager   dropdown
   * @param  {} event
   * @param  {} value --site manager  name
   */
  function handleChangeSiteManager(event, value) {
    setisAlertBoxOpened(true);
    setUserSelectedSiteManager(value);
    if (value) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["siteManager"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["siteManager"]: true,
      }));
    }
  }

  /**
   * Method on change of security manager   dropdown
   * @param  {} event
   * @param  {} value --security manager  name
   */
  function handleChangeSecurityManager(event, value) {
    setisAlertBoxOpened(true);
    setUserSelectedSecurityManager(value);
    if (value) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["securityManager"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["securityManager"]: true,
      }));
    }
  }
  /**
   * Method on change of site bhr dropdown
   * @param  {} e
   * @param  {} v--site name
   */
  function handleChangeSiteBHR(e, v) {
    setSiteSelectedBHR(v);
  }
  /**
   * Method on change of security lead dropdown
   * @param  {} e
   * @param  {} v
   */
  function handleChangeSiteLead(e, v) {
    setSiteSelectedLead(v);
  }
  /**
   * Redirect to view user group
   * Method on click of cancel button to redirect to list page
   */
  function redirectToViewUsersGroup() {
    props.history.push("/site/all-site");
  }
  /**
   * Handle change checkbox
   *  Method on change of rlap feild to set the state
   * @param  {} event
   */
  const handleChangecheckBox = (event) => {
    SetformData((formData) => ({
      ...formData,
      ["isRLAPActive"]: event.target.checked,
    }));
  };

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
          color="inherit"
          href="#"
          to={`/site/all-site`}
          className="inactive"
        >
          Sites
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          aria-current="page"
          className="active"
        >
          {siteId ? "Update Site" : "Create New Site"}
        </LinkTo>
      </Breadcrumbs>
      <div>
        <Paper className={`main-paper`}>
          <Fragment>
            {!componentLoadder ? (
              <ValidatorForm
                className={`global-form inline-form`}
                onSubmit={UserBasicInfo}
              >
                <Grid container spacing={3}>
                  <Grid item container xs={12} spacing={1} sm={12}>
                    <Grid item xs={4}>
                      <label
                        htmlFor="password"
                        className="input-label required"
                      >
                        Site Name
                      </label>
                      <TextValidator
                        variant="outlined"
                        validators={[
                          "required",

                          "matchRegexp:^[a-zA-Z0-9 ]*$",
                          "matchRegexp:^.{0,60}$",
                        ]}
                        errorMessages={[
                          "Please enter site name",
                          "Special charcters are not allowed",
                          "Maximum 60 characters",
                        ]}
                        fullWidth
                        id="name"
                        placeholder="Enter site name"
                        name="name"
                        onChange={handleChange}
                        value={formData.name}
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
                    <Grid item xs={4}>
                      <label
                        htmlFor="password"
                        className="input-label required"
                      >
                        Site Manager
                      </label>
                      <Autocomplete
                        id="tags-outlined"
                        options={siteManger}
                        getOptionLabel={(option) => option.name}
                        onChange={handleChangeSiteManager}
                        defaultValue={userSelectedSiteManager}
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select site manager"
                          />
                        )}
                      />
                      {formFieldValidation.siteManager ? (
                        <FormHelperText className="error-msg">
                          Please select site manager{" "}
                        </FormHelperText>
                      ) : (
                        ""
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      <label
                        htmlFor="password"
                        className="input-label required"
                      >
                        Security Manager
                      </label>
                      <Autocomplete
                        id="tags-outlined"
                        options={securityManger}
                        getOptionLabel={(option) => option.name}
                        onChange={handleChangeSecurityManager}
                        defaultValue={userSelectedSecurityManager}
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select security manager"
                          />
                        )}
                      />
                      {formFieldValidation.securityManager ? (
                        <FormHelperText className="error-msg">
                          Please select security manager{" "}
                        </FormHelperText>
                      ) : (
                        ""
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      <label
                        htmlFor="password"
                        className="input-label required"
                      >
                        Security Lead
                      </label>
                      <Autocomplete
                        id="tags-outlined"
                        options={siteLead}
                        getOptionLabel={(option) => option.name}
                        onChange={handleChangeSiteLead}
                        defaultValue={siteSelectedLead}
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select security lead"
                            required
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <label
                        htmlFor="password"
                        className="input-label required"
                      >
                        Site BHR
                      </label>
                      <Autocomplete
                        id="tags-outlined"
                        options={siteBHR}
                        getOptionLabel={(option) => option.name}
                        onChange={handleChangeSiteBHR}
                        defaultValue={siteSelectedBHR}
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select site BHR"
                            required
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <label htmlFor="password" className="input-label">
                        Description
                      </label>
                      <TextValidator
                        variant="outlined"
                        validators={["matchRegexp:^.{0,150}$"]}
                        errorMessages={["Maximum 150 characters"]}
                        fullWidth
                        id="description"
                        placeholder="Add Description"
                        name="description"
                        onChange={handleChange}
                        value={formData.description}
                        multiline
                        rows={2}
                        className="global-input global-input-multiline"
                        InputLabelProps={{ shrink: false }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <label
                        htmlFor="password"
                        className="input-label required"
                      >
                        Address 1
                      </label>
                      <TextValidator
                        variant="outlined"
                        validators={["required", "matchRegexp:^.{0,150}$"]}
                        errorMessages={[
                          "Please enter address",
                          "Maximum 150 characters",
                        ]}
                        fullWidth
                        id="address1"
                        placeholder="Enter address"
                        name="address1"
                        onChange={handleChange}
                        value={formData.address1}
                        multiline
                        rows={2}
                        className="global-input global-input-multiline"
                        InputLabelProps={{ shrink: false }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <label htmlFor="password" className="input-label">
                        Address 2
                      </label>
                      <TextValidator
                        variant="outlined"
                        validators={["matchRegexp:^.{0,150}$"]}
                        errorMessages={["Maximum 150 characters"]}
                        fullWidth
                        id="address2"
                        placeholder="Enter address"
                        name="address2"
                        onChange={handleChange}
                        value={formData.address2}
                        multiline
                        rows={2}
                        className="global-input global-input-multiline"
                        InputLabelProps={{ shrink: false }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <label htmlFor="password" className="input-label">
                        City
                      </label>
                      <TextValidator
                        variant="outlined"
                        validators={["matchRegexp:^.{0,60}$"]}
                        errorMessages={["Maximum 60 characters"]}
                        fullWidth
                        id="city"
                        placeholder="Enter city"
                        name="city"
                        onChange={handleChange}
                        value={formData.city}
                        className="global-input"
                        InputLabelProps={{ shrink: false }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <label htmlFor="password" className="input-label">
                        State
                      </label>
                      <TextValidator
                        variant="outlined"
                        validators={["matchRegexp:^.{0,60}$"]}
                        errorMessages={["Maximum 60 characters"]}
                        fullWidth
                        id="state"
                        placeholder="Enter state name"
                        name="state"
                        onChange={handleChange}
                        value={formData.state}
                        className="global-input"
                        InputLabelProps={{ shrink: false }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <label
                        htmlFor="password"
                        className="input-label required"
                      >
                        Country
                      </label>
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                        fullWidth
                      >
                        <InputLabel
                          id="demo-simple-select-outlined-label"
                          shrink={false}
                          className="select-label"
                        >
                          {formData.countryId == "" ? " Select country" : ""}
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          placeholder="Select"
                          name="countryId"
                          value={formData.countryId ? formData.countryId : ""}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: false }}
                          className="global-input single-select"
                          required
                        >
                          <MenuItem value="">None</MenuItem>
                          {CountryMasterData && CountryMasterData.length > 0
                            ? CountryMasterData.map((lan) => {
                                return (
                                  <MenuItem value={lan.id}>{lan.name}</MenuItem>
                                );
                              })
                            : ""}
                        </Select>
                      </FormControl>
                      {formFieldValidation.country ? (
                        <FormHelperText className="error-msg">
                          Please select country{" "}
                        </FormHelperText>
                      ) : (
                        ""
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      <label
                        htmlFor="password"
                        className="input-label required"
                      >
                        Zip Code
                      </label>
                      <TextValidator
                        variant="outlined"
                        validators={["required"]}
                        errorMessages={["Please enter postal code"]}
                        fullWidth
                        id="zipCode"
                        placeholder="Enter postal code"
                        name="zipCode"
                        onChange={handleChange}
                        value={formData.zipCode}
                        className="global-input"
                        InputLabelProps={{ shrink: false }}
                      />
                    </Grid>

                    <Grid item xs={4} className="inline-form-checkbox">
                      <Checkbox
                        checked={formData.isRLAPActive}
                        onChange={handleChangecheckBox}
                        value={formData.isRLAPActive}
                        inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                        id="rlapactive"
                      />
                      <label htmlFor="rlapactive" className="input-label ">
                        RLAP active
                      </label>
                      <TooltipComponent
                        isMarginBottom={false}
                        tooltipMessage={`Indicates if user's real time location tracking  is implemented  in the  Site.`}
                      ></TooltipComponent>
                    </Grid>

                    <Grid item xs={4}>
                      <label
                        className={`input-label ${
                          formData.isRLAPActive ? "required" : ""
                        }`}
                      >
                        RLAP Site ID
                      </label>
                      <TooltipComponent
                        isMarginBottom={true}
                        tooltipMessage={`Unique reference ID  of site as maintained in RLAP  platform . This is required for technical implementation, to fetch the site specific data from RLAP platform.`}
                      ></TooltipComponent>
                      <TextValidator
                        variant="outlined"
                        validators={formData.isRLAPActive ? ["required"] : ""}
                        errorMessages={
                          formData.isRLAPActive
                            ? ["Please enter  Reference ID"]
                            : ""
                        }
                        fullWidth
                        id="rlapReferenceId"
                        disabled={!formData.isRLAPActive}
                        placeholder="Enter Reference ID "
                        name="rlapReferenceId"
                        onChange={handleChange}
                        value={formData.rlapReferenceId}
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

export function getUserSiteById(users, id) {
  return users.find((user) => user.id === id) || null;
}
//Validates the data received from the props
CreateSite.propTypes = {
  SiteData: PropTypes.array.isRequired,
  LoadData: PropTypes.func.isRequired,
  AddData: PropTypes.func.isRequired,
  UpdateData: PropTypes.func.isRequired,
};
//Update redux store and merge them into props
function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const emptyObject = {};
  const userSiteData =
    id && state.SiteState.length > 0
      ? getUserSiteById(state.SiteState, id)
      : emptyObject;
  return {
    userSiteData,
    SiteData: state.SiteState,
  };
}
// Customizing the functions your component receives, and how they dispatch actions
const mapDispatchToProps = {
  LoadData: UserSiteAction.loadSite,
  AddData: UserSiteAction.createSite,
  UpdateData: UserSiteAction.updateSite,
};
//connects the component with redux store
export default connect(mapStateToProps, mapDispatchToProps)(CreateSite);
