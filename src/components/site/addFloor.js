import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import * as AddFloorAction from "../../Redux/Action/addFloorAction";
import * as SiteAction from "../../Redux/Action/siteAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import UserService from "../../services/usersService";
import MasterService from "../../services/masterDataService";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import FormHelperText from "@material-ui/core/FormHelperText";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "0px solid #ffff !imortant",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  stepButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
    margin: 0,
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  errorSpanMsg: {
    color: "red",
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

function AddFloor(props) {
  const classes = useStyles();
  var floorId = props.SelectedRowId;
  const [componentLoadder, setcomponentLoadder] = useState(false);
  const [formData, SetformData] = useState({
    siteId: "",
    id: "",
    floorName: "",
    locationCount: 0,
  });
  const [resetformData, SetresetformData] = useState({
    siteId: "",
    id: "",
    floorName: "",
    locationCount: 0,
  });
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [showLoadder, setshowLoadder] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    if (props.SelectedRowId && props.FloorData.length > 0) {
      // setComponentLoadder(true);
      SetformData(props.selectedFloorData);
      // setComponentLoadder(false);
    } else {
      SetformData(resetformData);
    }
  }, [props]);
  const handleClose = () => {
    resetCovidStateFormData();
    props.setopenaddFloorModal(false);
    setIsDuplicate(false);
  };

  function resetCovidStateFormData() {
    SetformData(resetformData);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name == "floorName") {
      checkUnqueName(value);
    }
    SetformData((logInForm) => ({
      ...logInForm,
      [name]: value,
    }));
  }

  function checkUnqueName(value) {
    if (props.SelectedRowId) {
      if (props.FloorData && props.FloorData.length > 0) {
        let filteredData = props.FloorData.filter((x) => {
          return x.id != props.SelectedRowId;
        });
        let matchedValue = filteredData.find(
          (x) => x.floorName.toLowerCase() == value.toLowerCase()
        );
        if (matchedValue) {
          setIsDuplicate(true);
        } else {
          setIsDuplicate(false);
        }
      }
    } else {
      if (props.FloorData && props.FloorData.length > 0) {
        let matchedValue = props.FloorData.find(
          (x) => x.floorName.toLowerCase() == value.toLowerCase()
        );
        if (matchedValue) {
          setIsDuplicate(true);
        } else {
          setIsDuplicate(false);
        }
      }
    }
  }

  function userCovidInfo() {
    submitUserCovidInformation();
  }

  function submitUserCovidInformation() {
    setshowLoadder(true);
    var data = formData;
    data.siteId = props.siteId;
    if (props.SelectedRowId) {
      props
        .UpdateData(formData)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Updated Floor details.");
          settoasterServerity("success");
          setTimeout(() => {
            props.setopenaddFloorModal(false);
            resetCovidStateFormData();
            setIsDuplicate(false);
            setshowLoadder(false);
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
          setStateSnackbar(true);
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setshowLoadder(false);
        });
    } else {
      props
        .AddData(formData)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Added new Floor to Site.");
          settoasterServerity("success");
          setTimeout(() => {
            setshowLoadder(false);
            props.setopenaddFloorModal(false);
            resetCovidStateFormData();
            setIsDuplicate(false);
            updateSiteFloorData(formData);
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
          setStateSnackbar(true);
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setshowLoadder(false);
        });
    }
  }

  function updateSiteFloorData(value) {
    props
      .UpdateSiteFloor(value)
      .then((result) => {})
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.openaddFloorModal}
        className="global-dialog"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {props.SelectedRowId ? "Update Floor" : "Add Floor"}
        </DialogTitle>
        <ValidatorForm className={`global-form`} onSubmit={userCovidInfo}>
          <DialogContent dividers>
            {!componentLoadder ? (
              <Grid container spacing={3}>
                <Grid item cs={12} container>
                  <Grid item xs={12}>
                    <TextValidator
                      variant="outlined"
                      validators={[
                        "required",
                        "matchRegexp:^[a-zA-Z0-9]*$",
                        "matchRegexp:^.{0,50}$",
                      ]}
                      errorMessages={[
                        "Please enter floor name",
                        "Special charcters are not allowed",
                        "Maximum 60 characters",
                      ]}
                      margin="normal"
                      fullWidth
                      id="floorName"
                      placeholder="Enter floor name"
                      name="floorName"
                      onChange={handleChange}
                      value={formData.floorName}
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
                </Grid>
              </Grid>
            ) : null}
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
              Close
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

export function getFloorById(users, id) {
  return users.find((user) => user.id === id) || null;
}

AddFloor.propTypes = {
  FloorData: PropTypes.array.isRequired,
  LoadData: PropTypes.func.isRequired,
  AddData: PropTypes.func.isRequired,
  UpdateData: PropTypes.func.isRequired,
  UpdateSiteFloor: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const emptyObject = {};
  const selectedFloorData =
    ownProps.SelectedRowId && state.FloorState.length > 0
      ? getFloorById(state.FloorState, ownProps.SelectedRowId)
      : emptyObject;
  return {
    selectedFloorData,
    FloorData: state.FloorState,
  };
}

const mapDispatchToProps = {
  LoadData: AddFloorAction.loadFloor,
  AddData: AddFloorAction.createFloor,
  UpdateData: AddFloorAction.updateFloor,
  UpdateSiteFloor: SiteAction.updateSiteFloor,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFloor);
