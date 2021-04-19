import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import AlertBoxComponent from "../common/alert";
import { connect } from "react-redux";
import * as EmergencyContactAction from "../../Redux/Action/emergencyContactAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import FormHelperText from "@material-ui/core/FormHelperText";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";

const languages = [{ id: "English", language: "English" }];

function CreateNew(props) {
  const getEmergencyContactId = props.match.params.id;

  const [emergencyContact, setEmergencyContact] = useState({
    id: "",
    title: "",
    language: "",
    contactDetails: [
      {
        id: "",
        purpose: "",
        numbers: "",
      },
    ],
  });
  const [emergencyContactId, setEmergencyContactId] = useState(
    getEmergencyContactId
  );
  const [muivalidatorForm, setmuivalidatorForm] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [showLoadder, setshowLoadder] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);

  useEffect(() => {
    if (emergencyContactId != 0) {
      setEmergencyContact(props.emergencyContactData);
    }
  }, []);

  function handleChangeInput(e) {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    if (name == "title") {
      checkUnqueName(value);
    }
    setEmergencyContact((emergencyContact) => ({
      ...emergencyContact,
      [name]: value,
    }));
  }

  const handleInputChangeContacts = (e, index) => {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    const list = {
      ...emergencyContact,
      contactDetails: [
        ...emergencyContact.contactDetails.map((con, conIndex) =>
          conIndex == index ? { ...con, [name]: value } : con
        ),
      ],
    };
    setEmergencyContact(list);
  };

  const handleRemoveClickContacts = (j) => {
    const list = { ...emergencyContact };
    list.contactDetails.splice(j, 1);
    setEmergencyContact(list);
  };

  const handleAddClickContacts = (index, j) => {
    const list = { ...emergencyContact };
    const thiscontactDetails = list.contactDetails;
    list.contactDetails = [
      ...thiscontactDetails,
      {
        emergencyContactId: "",
        purpose: "",
        numbers: "",
      },
    ];
    setEmergencyContact(list);
  };

  function checkUnqueName(value) {
    if (props.match.params.id != 0) {
      if (
        props.loadEmergencyContacts &&
        props.loadEmergencyContacts.length > 0
      ) {
        let filteredData = props.loadEmergencyContacts.filter((x) => {
          return x.id != props.match.params.id;
        });
        let matchedValue = filteredData.find(
          (x) => x.title.toLowerCase() == value.toLowerCase()
        );
        if (matchedValue) {
          setIsDuplicate(true);
        } else {
          setIsDuplicate(false);
        }
      }
    } else {
      if (
        props.loadEmergencyContacts &&
        props.loadEmergencyContacts.length > 0
      ) {
        let matchedValue = props.loadEmergencyContacts.find(
          (x) => x.title.toLowerCase() == value.toLowerCase()
        );
        if (matchedValue) {
          setIsDuplicate(true);
        } else {
          setIsDuplicate(false);
        }
      }
    }
  }

  function handleClickGoBackToPage() {
    props.history.push("/emergencycontacts/view");
  }

  function submitForm(e) {
    e.preventDefault();
    if (emergencyContact.language) {
      ValidateSubmitForm();
    } else {
      setmuivalidatorForm(true);
    }
  }

  function ValidateSubmitForm() {
    setshowLoadder(true);
    if (emergencyContactId != 0) {
      props
        .UpdateEmergencyContact(emergencyContact)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Updated Emergency Contact details.");
          settoasterServerity("success");
          setisAlertBoxOpened(false);
          setTimeout(() => {
            props.history.push("/emergencycontacts/view");
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
      props
        .CreateNewEmergencyContact(emergencyContact)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Added New  Emergency Contact details.");
          settoasterServerity("success");
          setisAlertBoxOpened(false);
          setTimeout(() => {
            props.history.push("/emergencycontacts/view");
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

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
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
          to={`/emergencycontacts/view`}
          className="inactive"
        >
          Emergency contacts
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          {emergencyContactId != 0
            ? "Update Emergency Contact"
            : "Create New Emergency Contact"}
        </LinkTo>
      </Breadcrumbs>
      <Paper className="main-paper">
        <ValidatorForm className={`global-form`} onSubmit={submitForm}>
          <Grid container spacing={3}>
            <Grid item container xs={12}>
              <Grid item xs={3}>
                <label className="required">Title</label>
              </Grid>
              <Grid item xs={3}>
                <TextValidator
                  variant="outlined"
                  validators={[
                    "required",
                    "matchRegexp:^[a-zA-Z ]*$",
                    "matchRegexp:^.{0,60}$",
                  ]}
                  errorMessages={[
                    "Please enter contact title",
                    "Special characters are not allowed",
                    "Maximum 60 characters",
                  ]}
                  fullWidth
                  id="title"
                  placeholder="Emergency contact title"
                  InputLabelProps={{ shrink: false }}
                  name="title"
                  onChange={handleChangeInput}
                  value={emergencyContact.title}
                  className="global-input"
                />
                {isDuplicate ? (
                  <FormHelperText className="error-msg">
                    This title already exists.
                  </FormHelperText>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={3}>
                <label className="required">Language</label>
              </Grid>
              <Grid item xs={3}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel
                    shrink={false}
                    id="demo-simple-select-outlined-label"
                    className="select-label"
                  >
                    {emergencyContact.language == "" ? " Select language" : ""}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    placeholder="Select language"
                    InputLabelProps={{ shrink: false }}
                    name="language"
                    value={emergencyContact.language}
                    onChange={handleChangeInput}
                    className="global-input single-select"
                  >
                    <MenuItem value="">None</MenuItem>
                    {languages.length > 0
                      ? languages.map((lan) => {
                          return (
                            <MenuItem value={lan.id}>{lan.language}</MenuItem>
                          );
                        })
                      : ""}
                  </Select>
                </FormControl>
                {muivalidatorForm ? (
                  !emergencyContact.language ? (
                    <FormHelperText className="error-message-select">
                      Please select language{" "}
                    </FormHelperText>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={3}>
                <label className="required">Contact Details</label>
              </Grid>
              <Grid container item xs={9}>
                {emergencyContact.contactDetails &&
                emergencyContact.contactDetails.length > 0
                  ? emergencyContact.contactDetails.map((x, i) => {
                      return (
                        <Grid
                          container
                          spacing={1}
                          item
                          xs={12}
                          className="dynamic-rows-bottom"
                          key={`contact-container${i}`}
                        >
                          <Grid item xs={10}>
                            <Grid container spacing={1} item xs={12}>
                              <Grid item xs={4}>
                                <TextValidator
                                  variant="outlined"
                                  validators={[
                                    "required",
                                    "matchRegexp:^[a-zA-Z ]*$",
                                    "matchRegexp:^.{0,60}$",
                                  ]}
                                  errorMessages={[
                                    "Please enter purpose",
                                    "Special characters are not allowed",
                                    "Maximum 60 characters",
                                  ]}
                                  fullWidth
                                  id={`purpose_${i}`}
                                  placeholder="Contact Name/Purpose *"
                                  InputLabelProps={{ shrink: false }}
                                  name="purpose"
                                  value={x.purpose}
                                  onChange={(e) =>
                                    handleInputChangeContacts(e, i)
                                  }
                                  className="global-input"
                                />
                              </Grid>
                              <Grid item xs={8}>
                                <TextValidator
                                  variant="outlined"
                                  validators={[
                                    "required",
                                    "matchRegexp:^[0-9 ,]*$",
                                  ]}
                                  errorMessages={[
                                    "Please enter contact numbers",
                                    "Invalid contact number",
                                  ]}
                                  fullWidth
                                  id={`numbers_${i}`}
                                  placeholder="+91 9876543210 , +91 8765432109"
                                  InputLabelProps={{ shrink: false }}
                                  name="numbers"
                                  value={x.numbers}
                                  onChange={(e) =>
                                    handleInputChangeContacts(e, i)
                                  }
                                  className="global-input"
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={2} className="row-icons-container">
                            {emergencyContact.contactDetails.length !== 1 && (
                              <Tooltip title="Remove">
                                <CancelIcon
                                  className={`delete-row-icon`}
                                  onClick={() => handleRemoveClickContacts(i)}
                                ></CancelIcon>
                              </Tooltip>
                            )}
                            {emergencyContact.contactDetails.length - 1 ===
                              i && (
                              <Tooltip title="Add">
                                <AddCircleIcon
                                  className={`add-row-icon`}
                                  onClick={handleAddClickContacts}
                                ></AddCircleIcon>
                              </Tooltip>
                            )}
                          </Grid>
                        </Grid>
                      );
                    })
                  : ""}
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
                    onClick={handleClickGoBackToPage}
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

CreateNew.propTypes = {
  addEmergencyContact: PropTypes.func.isRequired,
  emergencyContactData: PropTypes.object.isRequired,
  loadEmergencyContacts: PropTypes.array.isRequired,
};

export function getEmergencyContactById(loadEmergencyContacts, id) {
  return (
    loadEmergencyContacts.find(
      (emergencyContactData) => emergencyContactData.id === id
    ) || null
  );
}

function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const emptyObject = {};
  const emergencyContactData =
    id && state.loadEmergencyContacts.length > 0
      ? getEmergencyContactById(state.loadEmergencyContacts, id)
      : emptyObject;
  return {
    emergencyContactData,
    loadEmergencyContacts: state.loadEmergencyContacts,
  };
}

const mapDispatchToProps = {
  CreateNewEmergencyContact: EmergencyContactAction.CreateNewEmergencyContact,
  UpdateEmergencyContact: EmergencyContactAction.UpdateEmergencyContact,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateNew);
