import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import * as UserAction from "../../Redux/Action/userAction";
import * as UserGroupAction from "../../Redux/Action/userGroupAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import * as AssignmentEmergencycontactAction from "../../Redux/Action/assignemergencycontactAction";
import * as EmergencyContactAction from "../../Redux/Action/emergencyContactAction";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ReplayIcon from "@material-ui/icons/Replay";
import TooltipComponent from "../common/tooltip";

const userStatusData = [
  { id: "001", name: "Active" },
  { id: "002", name: "Inactive" },
];

//Styling
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  stepButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function AssignEmergencyContactToUserGroup(props) {
  const classes = useStyles();
  const [componentLoadder, setcomponentLoadder] = useState(false);
  const [formData, SetformData] = useState({
    id: "",
    groupName: "",
    groupId: "",
    emergencyContactId: "",
    emergencyContactName: "",
    isActive: "",
  });
  const [resetformData, SetresetformData] = useState({
    id: "",
    groupName: "",
    groupId: "",
    emergencyContactId: "",
    emergencyContactName: "",
    isActive: "",
  });
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [validEmergencyContactForm, setvalidEmergencyContactForm] =
    useState(true);
  const [showLoadder, setshowLoadder] = useState(false);

  useEffect(() => {
    props
      .LoadAllUserGroup()
      .then((result) => {})
      .catch((err) => {
        console.log(err);
      });
    props
      .LoadAllEmergencyContactList([])
      .then((result) => {})
      .catch((err) => {
        console.log(err);
      });
    setvalidEmergencyContactForm(true);
  }, []);
  /**
  Handle close 
  * Method to close the popup modal and reset the form data
   */
  const handleClose = () => {
    props.setopenAssignEmergencyContactModal(false);
    resetEmergencyContactFormData();
  };
  /**
   * Reset Emergency Contact Form Data
   * Method to reset the form data
   */
  function resetEmergencyContactFormData() {
    SetformData(resetformData);
  }

  /**
   * Handle Change
   * Method data binding with the  form fields
   * @param  {} e
   */
  function handleChange(e) {
    let selectedText = e.nativeEvent.target.childNodes[0].data;
    const { name, value } = e.target;
    if (name == "groupId") {
      let thisName = "groupName";

      SetformData((logInForm) => ({
        ...logInForm,
        [thisName]: selectedText,
      }));
    }

    if (name == "emergencyContactId") {
      let thisName = "emergencyContactName";

      SetformData((logInForm) => ({
        ...logInForm,
        [thisName]: selectedText,
      }));
    }

    SetformData((logInForm) => ({
      ...logInForm,
      [name]: value,
    }));
  }
  /**
  Reset filter form
   * Method to reset
   */
  function resetFilterForm() {
    SetformData(resetformData);
  }

  /**
   * Assign Emergency contactform
   * After form submit validate and call the methos submitAssignEmergencyContact()
   */
  function AssignEmegencyContactForm() {
    if (
      formData.groupId &&
      formData.emergencyContactId &&
      formData.isActive !== ""
    ) {
      submitAssignEmergencyContact();
    } else {
      setvalidEmergencyContactForm(false);
      return false;
    }
  }
  /**
   * Submit Assign emergency contact
   * Method to swtich the status for a emergency contact
   */
  function submitAssignEmergencyContact() {
    setshowLoadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    var data = formData;
    data.isActive = data.isActive == "001" ? true : false;
    props
      .CreateAssignEmegencyContact(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Emergency Contacts assigned to User Group.");
        settoasterServerity("success");
        setTimeout(() => {
          props.setopenAssignEmergencyContactModal(false);
          resetEmergencyContactFormData();
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

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.openAssignEmergencyContactModal}
        className="global-dialog assign-emergency-contact"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Assign Emergency Contact To Group
          <TooltipComponent
            isMarginBottom={true}
            tooltipMessage={`Emergency Contacts  assigned to a user group in "Active" state will be available for users for whom the selected user group is primary user group. Only One Emergency Contacts list can be assigned in active state to a user group.`}
          ></TooltipComponent>
        </DialogTitle>
        <ValidatorForm
          className={`global-form`}
          onSubmit={AssignEmegencyContactForm}
        >
          <DialogContent dividers>
            {!componentLoadder ? (
              <Grid container spacing={3}>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label className="required">Group</label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        id="demo-simple-select-outlined-label"
                        shrink={false}
                        className="select-label"
                      >
                        {formData.groupId == "" ? "Select group name" : ""}
                      </InputLabel>

                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        placeholder="Select user group"
                        name="groupId"
                        value={formData.groupId}
                        onChange={handleChange}
                        className="global-input single-select"
                      >
                        <MenuItem value="">None</MenuItem>
                        {props.UserGroupData.length > 0
                          ? props.UserGroupData.map((userGroup) => {
                              return (
                                <MenuItem
                                  key={userGroup.id}
                                  value={userGroup.id}
                                >
                                  {userGroup.groupName}
                                </MenuItem>
                              );
                            })
                          : ""}
                      </Select>
                    </FormControl>
                    {!validEmergencyContactForm && !formData.groupName ? (
                      <FormHelperText className="error-message-select">
                        Please select group name{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="required">Emergency Contact</label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        id="demo-simple-select-outlined-label"
                        shrink={false}
                        className="select-label"
                      >
                        {formData.emergencyContactId == ""
                          ? "Select emergency contact"
                          : ""}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        placeholder="Select emergency contact"
                        name="emergencyContactId"
                        value={formData.emergencyContactId}
                        onChange={handleChange}
                        className="global-input single-select"
                      >
                        <MenuItem value="">None</MenuItem>
                        {props.loadEmergencyContacts.length > 0
                          ? props.loadEmergencyContacts.map(
                              (emergencyContact) => {
                                return (
                                  <MenuItem value={emergencyContact.id}>
                                    {emergencyContact.title}
                                  </MenuItem>
                                );
                              }
                            )
                          : ""}
                      </Select>
                    </FormControl>
                    {!validEmergencyContactForm &&
                    !formData.emergencyContactName ? (
                      <FormHelperText className="error-message-select">
                        Please select emergency contact{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="required">Status</label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        id="demo-simple-select-outlined-label"
                        shrink={false}
                        className="select-label"
                      >
                        {formData.isActive == "" ? "Select status" : ""}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        placeholder="Select status"
                        name="isActive"
                        value={formData.isActive}
                        onChange={handleChange}
                        className="global-input single-select"
                      >
                        <MenuItem value="">None</MenuItem>
                        {userStatusData.length > 0
                          ? userStatusData.map((UserStatus) => {
                              return (
                                <MenuItem value={UserStatus.id}>
                                  {UserStatus.name}
                                </MenuItem>
                              );
                            })
                          : ""}
                      </Select>
                    </FormControl>
                    {!validEmergencyContactForm && formData.isActive === "" ? (
                      <FormHelperText className="error-message-select">
                        Please select status{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={resetFilterForm}
              className="global-filter-reset-btn"
            >
              <ReplayIcon></ReplayIcon>
            </Button>
            <Button
              variant="contained"
              type="submit"
              className="global-submit-btn"
              disabled={showLoadder}
            >
              {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
            </Button>
            <Button onClick={handleClose} className="global-cancel-btn">
              Cancel
            </Button>
          </DialogActions>{" "}
        </ValidatorForm>
      </Dialog>
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

//Validate the data recieved from the props
AssignEmergencyContactToUserGroup.propTypes = {
  UserData: PropTypes.array.isRequired,
  LoadAllUser: PropTypes.func.isRequired,
  UpdateUser: PropTypes.func.isRequired,
  CreateAssignEmegencyContact: PropTypes.func.isRequired,
  UpdateAssignEmegencyContactr: PropTypes.func.isRequired,
  UserGroupData: PropTypes.array.isRequired,
  LoadAllUserGroup: PropTypes.func.isRequired,
  loadEmergencyContacts: PropTypes.array.isRequired,
  LoadAllEmergencyContactList: PropTypes.func.isRequired,
};

//Update the redux the store and merge them into props
function mapStateToProps(state, ownProps) {
  return {
    UserData: state.user,
    UserGroupData: state.usergroup,
    loadEmergencyContacts: state.loadEmergencyContacts,
  };
}

// Customizing the functions your component receives, and how they dispatch actions
const mapDispatchToProps = {
  LoadAllUser: UserAction.loadUser,
  UpdateAssignEmegencyContactr:
    AssignmentEmergencycontactAction.UpdateAssignEmergencyContact,
  CreateAssignEmegencyContact:
    AssignmentEmergencycontactAction.CreateNewAssignEmergencyContact,
  LoadAllUserGroup: UserGroupAction.loadUserGroup,
  LoadAllEmergencyContactList:
    EmergencyContactAction.LoadAllEmergencyContactList,
};

//Connect the component with redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignEmergencyContactToUserGroup);
