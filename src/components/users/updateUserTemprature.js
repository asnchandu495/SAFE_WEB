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
import InputAdornment from "@material-ui/core/InputAdornment";
import { connect } from "react-redux";
import * as UserAction from "../../Redux/Action/userAction";
import * as globalSettingAction from "../../Redux/Action/globalSettingAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import UserService from "../../services/usersService";
import { useHistory } from "react-router-dom";

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

const DisplayFormControl = ({
  validators,
  errorMessages,
  formData,
  handleChange,
  loadGlobalSettingsData,
  SetformData,
  setCheckLowerLimit,
  setCheckUpperLimit,
}) => {
  let globalSettingsTemperature =
    loadGlobalSettingsData.covidStateTemperatures.sort(function IHaveAName(
      a,
      b
    ) {
      // non-anonymous as you ordered...
      return b.lowerLimit < a.lowerLimit
        ? 1 // if b should come earlier, push a to end
        : b.lowerLimit > a.lowerLimit
        ? -1 // if b should come later, push a to begin
        : 0; // a and b are equal
    });
  let lowerLimit = 0;
  let upperLimit = 0;
  let noUpperLimit = false;
  if (globalSettingsTemperature && globalSettingsTemperature.length > 0) {
    if (globalSettingsTemperature.length == 1) {
      lowerLimit = globalSettingsTemperature[0].lowerLimit;
      upperLimit = globalSettingsTemperature[0].upperLimit;
      noUpperLimit = globalSettingsTemperature[0].isNoUpperLimit;
      if (noUpperLimit) {
        if (loadGlobalSettingsData.temperatureUnit == "C") {
          upperLimit = 45;
        } else {
          upperLimit = 113;
        }
      }
      setCheckLowerLimit(lowerLimit);
      setCheckUpperLimit(upperLimit);
    } else {
      lowerLimit = globalSettingsTemperature[0].lowerLimit;
      upperLimit =
        globalSettingsTemperature[globalSettingsTemperature.length - 1]
          .upperLimit;
      noUpperLimit =
        globalSettingsTemperature[globalSettingsTemperature.length - 1]
          .isNoUpperLimit;
      if (noUpperLimit) {
        if (loadGlobalSettingsData.temperatureUnit == "C") {
          upperLimit = 45;
        } else {
          upperLimit = 113;
        }
      }
      setCheckLowerLimit(lowerLimit);
      setCheckUpperLimit(upperLimit);
    }
  } else {
    if (loadGlobalSettingsData.temperatureUnit == "C") {
      lowerLimit = 30;
      upperLimit = 45;
      setCheckLowerLimit(lowerLimit);
      setCheckUpperLimit(upperLimit);
    } else {
      lowerLimit = 86;
      upperLimit = 113;
      setCheckLowerLimit(lowerLimit);
      setCheckUpperLimit(upperLimit);
    }
  }

  return (
    <TextValidator
      variant="outlined"
      fullWidth
      validators={[
        "required",
        "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
        `maxNumber:${upperLimit}`,
        `minNumber:${lowerLimit}`,
      ]}
      errorMessages={[
        "Please enter lower limit",
        "Entered numbers are not valid",
        `Maximum allowed is ${upperLimit}`,
        `Minimum allowed is ${lowerLimit}`,
      ]}
      id="temperature2"
      key="temperature2"
      placeholder="Temperature"
      name="temperature"
      autoComplete="temperature"
      onChange={(e) =>
        SetformData((formData) => ({
          ...formData,
          [e.target.name]: e.target.value,
        }))
      }
      value={formData.temperature}
      className="global-input"
      InputLabelProps={{ shrink: false }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {loadGlobalSettingsData
              ? loadGlobalSettingsData.temperatureUnit
              : ""}
          </InputAdornment>
        ),
      }}
    />
  );
};

function UpdateTempearture(props) {
  const classes = useStyles();

  const usersApiCall = new UserService();
  const history = useHistory();

  const [componentLoadder, setcomponentLoadder] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
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
  const [convertTemp, setconvertTemp] = useState();
  const [checkLowerLimit, setCheckLowerLimit] = useState();
  const [checkUpperLimit, setCheckUpperLimit] = useState();
  const [Modalopen, setModalOpen] = useState(false);
  const [showLoadder1, setshowLoadder1] = useState(false);

  useEffect(() => {
    if (props.SelectedRowId) {
      props.loadGlobalSettingWithoutAPICall();
      usersApiCall
        .getCovidStateInfo(props.SelectedRowId)
        .then((getCovidInfo) => {
          if (getCovidInfo.covidStateId) {
          }
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

  const handleCloseFilter = () => {
    setModalOpen(false);
  };

  const Oksubmit = () => {
    setshowLoadder1(true);
    // props.setReloadPage("YES");
    setTimeout(() => {
      window.location.reload(false);
    }, 10000);

    history.push(`/users/allusers`);
  };

  const handleClose = () => {
    props.setopenuserTemepratureModal(false);
    setcomponentLoadder(true);
    resetUserTemeatureFormData();
  };

  function resetUserTemeatureFormData() {
    SetformData(resetformData);
  }

  function submitUserShiftInform() {
    var data = formData;
    if (
      parseFloat(data.temperature) < checkLowerLimit ||
      parseFloat(data.temperature) > checkUpperLimit
    ) {
      let errorObject = {
        errors: {
          Message: [
            `Please enter temperature between ${checkLowerLimit} to ${checkUpperLimit}`,
          ],
        },
      };
      setToasterMessage(errorObject.errors);
      settoasterServerity("error");
      setStateSnackbar(true);
      return false;
    }
    setshowLoadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");

    data.id = props.SelectedRowId;
    data.temperature = parseFloat(data.temperature);
    data.temperatureUnit = props.loadGlobalSettingsData.temperatureUnit;

    usersApiCall
      .UpdateUserCovidTempearture(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("User's temperature updated");
        settoasterServerity("success");
        setTimeout(() => {
          props.setopenuserTemepratureModal(false);

          setcomponentLoadder(true);
          resetUserTemeatureFormData();
          setshowLoadder(false);
          props.setReloadPage("YES");
          setModalOpen(true);
        }, 6000);
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
        onClose={handleCloseFilter}
        aria-labelledby="form-dialog-title"
        open={Modalopen}
      >
        <DialogTitle id="form-dialog-title" onClose={handleClose}>
          Please wait
        </DialogTitle>
        <ValidatorForm className={`global-form`} onSubmit={Oksubmit}>
          <DialogContent dividers>please wait for sometime</DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              className="global-submit-btn"
              disabled={showLoadder1}
            >
              {showLoadder1 ? <ButtonLoadderComponent /> : "OK"}
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>

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
            Update user temperature
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <DisplayFormControl
                  formData={formData}
                  loadGlobalSettingsData={props.globalData}
                  handleChange={handleChange}
                  validators={[
                    "required",
                    "matchRegexp:^\\d{1,3}(\\.\\d{1,2})?$",
                  ]}
                  errorMessages={[
                    "Please enter tempeature",
                    "Entered numbers are not valid",
                  ]}
                  SetformData={SetformData}
                  setCheckLowerLimit={setCheckLowerLimit}
                  setCheckUpperLimit={setCheckUpperLimit}
                ></DisplayFormControl>
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
  loadGlobalSettingWithoutAPICall: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    UserData: state.user,
    loadGlobalSettingsData: state.loadGlobalSettingsData,
  };
}

const mapDispatchToProps = {
  LoadAllUser: UserAction.loadUser,
  UpdateUser: UserAction.UpdateUser,
  loadGlobalSettingWithoutAPICall:
    globalSettingAction.loadGlobalSettingWithoutAPICall,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateTempearture);
