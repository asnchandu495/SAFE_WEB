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
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import UserService from "../../services/usersService";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
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
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
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
    if (props.SelectedRowId) {
      setSelectedId(props.SelectedRowId);
      usersApiCall
        .getShiftInfo(props.SelectedRowId)
        .then((shiftInfo) => {
          console.log(shiftInfo);
          if (shiftInfo) {
            console.log(shiftInfo);
            SetformData(shiftInfo);
          }
          setcomponentLoadder(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.SelectedRowId]);

  function handleDateChangeS(currentTime) {
    let thisTime = "startTime";
    SetformData((logInForm) => ({
      ...logInForm,
      [thisTime]: currentTime,
    }));
  }

  function handleDateChangeE(currentTime) {
    let thisTime = "endTime";
    SetformData((logInForm) => ({
      ...logInForm,
      [thisTime]: currentTime,
    }));
  }

  const handleClose = () => {
    props.setopenshiftInfoModal(false);
  };

  function submitUserShiftInform() {
    setshowLoadder(true);
    var data = formData;
    data.id = selectedId;
    usersApiCall
      .UpdateUserShiftInfo(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("User's shift information updated");
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
                    <label>Start Time</label>
                  </Grid>
                  <Grid item xs={6}>
                    <TimePicker
                      clearable
                      ampm={false}
                      placeholder="24 hours"
                      value={formData.startTime}
                      name="startTime"
                      onChange={handleDateChangeS}
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={12}>
                  <Grid item xs={4}>
                    <label>End Time</label>
                  </Grid>
                  <Grid item xs={6}>
                    <TimePicker
                      clearable
                      ampm={false}
                      placeholder="24 hours"
                      value={formData.endTime}
                      name="endTime"
                      onChange={handleDateChangeE}
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

UpdateShiftingInfo.propTypes = {
  UserData: PropTypes.array.isRequired,
  LoadAllUser: PropTypes.func.isRequired,
  UpdateUser: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    UserData: state.user,
  };
}

const mapDispatchToProps = {
  LoadAllUser: UserAction.loadUser,
  UpdateUser: UserAction.UpdateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateShiftingInfo);
