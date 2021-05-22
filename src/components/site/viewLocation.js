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
import clsx from "clsx";
import { connect } from "react-redux";
import * as UserLocationAction from "../../Redux/Action/addLocationAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import SiteService from "../../services/siteService";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

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
  DefineDensitySpan: {
    textDecorationLine: "underline",
    fontWeight: 600,
  },

  temperatureRange: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  temperatureRangeLabel: {
    position: "absolute",
    top: "30%",
    // position: absolute;
    // top: 30%
  },
  dilaogBox: {
    minWidth: "800px",
    // maxWidth:"800px"
  },
  temperatureRangeView: {
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
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

function ViewLocation(props) {
  const classes = useStyles();
  const siteApiCall = new SiteService();

  const [componentLoadder, setcomponentLoadder] = useState(false);
  const [isFormSubmit, setisFormSubmit] = useState(false);

  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [floorInfoData, setfloorInfoData] = useState([]);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    setcomponentLoadder(false);
    console.log(props.selectedLocationDetails);
  }, [props.selectedLocationDetails]);

  const handleClose = () => {
    props.setopenViewLocationModal(false);
    props.setSelectedLocationDetails();
  };

  return (
    <div>
      {!componentLoadder ? (
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={props.openViewLocationModal}
          maxWidth="md"
          className="global-dialog add-location-dialog"
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            View Location
          </DialogTitle>
          <ValidatorForm className={`global-form`}>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item cs={12} container>
                  <Grid item xs={3}>
                    <label>Floor</label>
                  </Grid>
                  <Grid item xs={6}>
                    {props.selectedLocationDetails
                      ? props.selectedLocationDetails[1]
                      : ""}
                  </Grid>
                </Grid>
                <Grid item cs={12} container>
                  <Grid item xs={3}>
                    <label>Location Name</label>
                  </Grid>
                  <Grid item xs={6}>
                    {props.selectedLocationDetails
                      ? props.selectedLocationDetails[2]
                      : ""}
                  </Grid>
                </Grid>
                <Grid
                  item
                  cs={12}
                  container
                  className="location-pin-micro-checkbox"
                >
                  <Grid item xs={3}>
                    RLAP Active
                  </Grid>
                  <Grid item xs={7}>
                    {props.selectedLocationDetails &&
                    props.selectedLocationDetails[3]
                      ? "Active"
                      : "Inactive"}
                  </Grid>
                </Grid>
                {props.selectedLocationDetails &&
                props.selectedLocationDetails[3] ? (
                  <>
                    <Grid item cs={12} container>
                      <Grid item xs={12}>
                        <label className={classes.DefineDensitySpan}>
                          Define density thershold:
                        </label>
                      </Grid>
                    </Grid>
                    <Grid item cs={12} container>
                      <Grid item xs={3}>
                        <label>Low</label>
                      </Grid>
                      <Grid item xs={1}>
                        {props.selectedLocationDetails
                          ? props.selectedLocationDetails[4]
                          : ""}
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        className={classes.temperatureRangeView}
                      >
                        <label>to</label>
                      </Grid>
                      <Grid item xs={1}>
                        {props.selectedLocationDetails
                          ? props.selectedLocationDetails[5]
                          : ""}
                      </Grid>
                    </Grid>
                    <Grid item cs={12} container>
                      <Grid item xs={3}>
                        <label>Medium</label>
                      </Grid>
                      <Grid item xs={1}>
                        {props.selectedLocationDetails
                          ? props.selectedLocationDetails[6]
                          : ""}
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        className={classes.temperatureRangeView}
                      >
                        <label>to</label>
                      </Grid>
                      <Grid item xs={1}>
                        {props.selectedLocationDetails
                          ? props.selectedLocationDetails[7]
                          : ""}
                      </Grid>
                    </Grid>
                    <Grid item cs={12} container>
                      <Grid item xs={3}>
                        <label>High</label>
                      </Grid>
                      <Grid item xs={1}>
                        {props.selectedLocationDetails
                          ? props.selectedLocationDetails[8]
                          : ""}
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        className={classes.temperatureRangeView}
                      >
                        <label>to</label>
                      </Grid>
                      <Grid item xs={1}>
                        {props.selectedLocationDetails
                          ? props.selectedLocationDetails[9]
                          : ""}
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} className="global-cancel-btn">
                Close
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>
      ) : null}
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

export default ViewLocation;
