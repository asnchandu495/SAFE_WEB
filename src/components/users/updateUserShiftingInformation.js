import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";
import * as UserAction from "../../Redux/Action/userAction";
import * as globalSettingAction from "../../Redux/Action/globalSettingAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import UserService from "../../services/usersService";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import {
  TimePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  stepButtons: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing(3),
  },
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
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
      <Typography variant="h6">{children}</Typography>
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

function UpdateShiftingInfo(props) {
  const classes = useStyles();

  const usersApiCall = new UserService();

  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);

  const [formData, SetformData] = useState({
    id: "",
    shiftName: "",
    shiftType: "",
    startTime: moment(),
    endTime: moment(),
  });
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    props.loadGlobalSettingWithoutAPICall();
    if (props.SelectedRowId) {
      setSelectedId(props.SelectedRowId);
      usersApiCall
        .getShiftInfo(props.SelectedRowId)
        .then((shiftInfo) => {
          if (shiftInfo) {
            SetformData(shiftInfo);
          }
          setcomponentLoadder(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props]);

  //Method on change of start date calendar feild to bind data
  function handleDateChangeS(currentTime) {
    let thisTime = "startTime";
    SetformData((logInForm) => ({
      ...logInForm,
      [thisTime]: currentTime,
    }));
  }
  //Method on change of end date calendar feild to bind data
  function handleDateChangeE(currentTime) {
    let thisTime = "endTime";
    SetformData((logInForm) => ({
      ...logInForm,
      [thisTime]: currentTime,
    }));
  }
  //Method to close the popup modal
  const handleClose = () => {
    props.setopenshiftInfoModal(false);
  };

  //Method to update the shift timings on click of submit
  function submitUserShiftInform() {
    setshowLoadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    var data = formData;
    data.applicationUserId = selectedId;
    usersApiCall
      .UpdateUserShiftInfo(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Updated user's shift info.");
        settoasterServerity("success");
        setTimeout(() => {
          props.setopenshiftInfoModal(false);
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
  }

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.openshiftInfoModal}
        className={`global-dialog`}
      >
        <ValidatorForm
          className={`global-form`}
          onSubmit={submitUserShiftInform}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Update shift information
          </DialogTitle>
          <DialogContent dividers>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container spacing={3}>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label className="required">Start Time</label>
                  </Grid>
                  <Grid item xs={6} className="date-time-pickers">
                    <KeyboardTimePicker
                      format={
                        props.loadGlobalSettingsData
                          ? props.loadGlobalSettingsData.timeFormat
                          : "hh:mm"
                      }
                      ampm={
                        props.loadGlobalSettingsData
                          ? props.loadGlobalSettingsData.timeFormat &&
                            props.loadGlobalSettingsData.timeFormat.includes(
                              "HH"
                            )
                            ? false
                            : true
                          : "hh:mm"
                      }
                      placeholder="24 hours"
                      value={formData.startTime}
                      name="startTime"
                      onChange={handleDateChangeS}
                      className="global-input report-pickers"
                      required
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={12}>
                  <Grid item xs={4}>
                    <label className="required">End Time</label>
                  </Grid>
                  <Grid item xs={6} className="date-time-pickers">
                    <KeyboardTimePicker
                      format={
                        props.loadGlobalSettingsData
                          ? props.loadGlobalSettingsData.timeFormat
                          : "hh:mm"
                      }
                      ampm={
                        props.loadGlobalSettingsData
                          ? props.loadGlobalSettingsData.timeFormat &&
                            props.loadGlobalSettingsData.timeFormat.includes(
                              "HH"
                            )
                            ? false
                            : true
                          : "hh:mm"
                      }
                      placeholder="24 hours"
                      value={formData.endTime}
                      name="endTime"
                      onChange={handleDateChangeE}
                      className="global-input report-pickers"
                      required
                    />
                  </Grid>
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>
          </DialogContent>
          <DialogActions>
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
          </DialogActions>
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
//Validate the data received from the props
UpdateShiftingInfo.propTypes = {
  UserData: PropTypes.array.isRequired,
  LoadAllUser: PropTypes.func.isRequired,
  UpdateUser: PropTypes.func.isRequired,
  loadGlobalSettingWithoutAPICall: PropTypes.func.isRequired,
};
//To update the redux store and merge into props component
function mapStateToProps(state, ownProps) {
  return {
    UserData: state.user,
    loadGlobalSettingsData: state.loadGlobalSettingsData,
  };
}
// Customizing the functions your component receives, and how they dispatch actions
const mapDispatchToProps = {
  LoadAllUser: UserAction.loadUser,
  UpdateUser: UserAction.UpdateUser,
  loadGlobalSettingWithoutAPICall:
    globalSettingAction.loadGlobalSettingWithoutAPICall,
};
//Connects a React component to a Redux store
export default connect(mapStateToProps, mapDispatchToProps)(UpdateShiftingInfo);
