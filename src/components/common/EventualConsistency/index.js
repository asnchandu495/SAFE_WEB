import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import HomeIcon from "@material-ui/icons/Home";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

/**
 * Material UI  Theme styling
 * @param  {} theme
 */
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

function CustomizedDialogs(props) {
  const [showLoadder, setshowLoadder] = useState(false);
  const history = useHistory();

  /**
   * Handle click yes
   * Delay the redirection of certain common components using setTimeout()
   * setTimeout calls function after certain ms
   */
  const handleClickYes = () => {
    if (props.ConfirmationModalActionType == "Usersuccess") {
      props.setshowEventualLoadder(true);
      props.setcomponentLoadder(true);
      // props.setReloadPage("YES");
      // history.push(`/users/allusers`);
      setTimeout(() => {
        props.setReloadPage("YES");
        // history.push(`/users/allusers`);
        // window.location.reload(false);
        props.setshowEventualLoadder(false);
        props.setOpenConfirmationModal(false);
      }, 10000);
    } else if (
      props.ConfirmationModalActionType == "UserUpdatecovidstatesuccess"
    ) {
      props.setshowEventualLoadder(true);
      props.setcomponentLoadder(true);
      setTimeout(() => {
        props.setReloadPage("YES");
        props.setshowEventualLoadder(false);
        props.setOpenConfirmationModal(false);
      }, 10000);
    } else if (
      props.ConfirmationModalActionType == "UserImportHistorysuccess"
    ) {
      props.setshowEventualLoadder(true);
      props.setcomponentLoadder(true);

      setTimeout(() => {
        history.push(`/users/import-users-history`);
        props.setshowEventualLoadder(false);
        props.setOpenConfirmationModal(false);
      }, 10000);
    } else if (props.ConfirmationModalActionType == "GlobalsettingsSuccess") {
      props.setshowEventualLoadder(true);
      props.setcomponentLoadder(true);
      setTimeout(() => {
        props.setReloadPage("YES");
        props.setshowEventualLoadder(false);
        props.setOpenConfirmationModal(false);
        props.setcomponentLoadder(false);
      }, 6000);
    } else if (
      props.ConfirmationModalActionType == "TemperatureRangesettingsSuccess"
    ) {
      props.setshowEventualLoadder(true);
      props.setComponentLoadder(true);
      setTimeout(() => {
        props.setReloadPage("YES");
        props.setshowEventualLoadder(false);
        props.setOpenConfirmationModal(false);
        props.setComponentLoadder(false);
      }, 6000);
    } else if (
      props.ConfirmationModalActionType == "Questionnaireupdatesuccess"
    ) {
      props.setshowEventualLoadder(true);
      props.setcomponentLoadder(true);
      setTimeout(() => {
        props.setReloadPage("YES");
        props.setshowEventualLoadder(false);
        props.setOpenConfirmationModal(false);
        props.setcomponentLoadder(false);
      }, 10000);
    } else if (
      props.ConfirmationModalActionType == "Questionnaircreatesuccess"
    ) {
      props.setshowEventualLoadder(true);
      props.setcomponentLoadder(true);
      setTimeout(() => {
        props.setReloadPage("YES");
        props.setshowEventualLoadder(false);
        props.setOpenConfirmationModal(false);
        props.setcomponentLoadder(false);
      }, 10000);
    }
  };

  /**
   * Handle Close Success
   * Close the popup or the dialog box if clicked on No or the operation should be performed
   * Redirect to the home screen
   */
  const handleCloseSuccess = () => {
    props.setOpenConfirmationModal(false);
    history.push("/");
  };

  function toasterErrorMessage(errorMessage) {}
  const handleCloseFilter = () => {
    props.setOpenConfirmationModal(false);
  };

  return (
    <div>
      <Dialog
        onClose={handleCloseFilter}
        aria-labelledby="customized-dialog-title"
        open={props.openConfirmationModal}
        className="global-dialog confirmation-dialog global-form"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleCloseFilter}>
          {props.ConfirmationHeaderTittle}
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item cs={12} container>
              <Grid item xs={12}>
                <label className="">
                  {props.ConfirmationDialogContextText}
                </label>
              </Grid>
              <Grid item xs={8}></Grid>
              <Grid item xs={12}>
                <label className="">
                  {props.ConfirmationDialogContextTextNext}
                </label>
              </Grid>
              <Grid item xs={8}></Grid>
            </Grid>
          </Grid>
          <br />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClickYes}
            variant="contained"
            type="submit"
            className="global-submit-btn"
            disabled={props.showEventualLoadder}
          >
            {props.showEventualLoadder ? <ButtonLoadderComponent /> : "OK"}
          </Button>
          <Button onClick={handleCloseSuccess} className="global-cancel-btn">
            GO to &nbsp;
            <HomeIcon />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CustomizedDialogs;
