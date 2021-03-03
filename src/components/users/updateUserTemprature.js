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
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import UserService from "../../services/usersService";

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

function UpdateTempearture(props) {
  const classes = useStyles();

  const usersApiCall = new UserService();

  const [componentLoadder, setcomponentLoadder] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [showLoadder, setshowLoadder] = useState(false);
  const [formData, SetformData] = useState({
    id: "",
    temperature: "",
    temperatureUnit: "F",
    covidStateId: "",
  });

  const [resetformData, SetresetformData] = useState({
    id: "",
    temperature: 0,
    temperatureUnit: "F",
    covidStateId: "",
  });

  useEffect(() => {
    if (props.SelectedRowId) {
      usersApiCall
        .getCovidStateInfo(props.SelectedRowId)
        .then((getCovidInfo) => {
          if (getCovidInfo) {
            SetformData(getCovidInfo);
          }
          setcomponentLoadder(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.openuserTemepratureModal == true]);

  function getUserInfomationById(users, id) {
    return users.find((user) => user.id === id) || null;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    SetformData((logInForm) => ({
      ...logInForm,
      [name]: value,
    }));
  }

  const handleClose = () => {
    props.setopenuserTemepratureModal(false);
    setcomponentLoadder(true);
    resetUserTemeatureFormData();
  };

  function resetUserTemeatureFormData() {
    SetformData(resetformData);
  }
  function submitUserShiftInform() {
    setshowLoadder(true);
    var data = formData;
    data.id = props.SelectedRowId;
    // data.temperature = parseFloat(data.temperature).toFixed(2);
    data.temperature = parseInt(data.temperature);
    usersApiCall
      .UpdateUserCovidTempearture(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("User's tempearture updated");
        settoasterServerity("success");
        setTimeout(() => {
          props.setopenuserTemepratureModal(false);
          setcomponentLoadder(true);
          resetUserTemeatureFormData();
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
        open={props.openuserTemepratureModal}
        className={`global-dialog covid-state-modal`}
      >
        <ValidatorForm
          className={`global-form`}
          onSubmit={submitUserShiftInform}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Update user tempearture
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <TextValidator
                  variant="outlined"
                  fullWidth
                  validators={["required"]}
                  errorMessages={["Please enter tempeature"]}
                  validators={["required", "matchRegexp:^d{0,3}(.d{1,2})?$"]}
                  errorMessages={[
                    "Please enter tempeature",
                    "Enter numbers not valid",
                  ]}
                  id="temperature"
                  placeholder="Temperature"
                  name="temperature"
                  autoComplete="temperature"
                  onChange={handleChange}
                  value={formData.temperature}
                  className="global-input"
                  InputLabelProps={{ shrink: false }}
                />
              </Grid>
            </Grid>
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

UpdateTempearture.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateTempearture);
