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

  const handleClickYes = () => {
    if (props.ConfirmationModalActionType == "Usersuccess") {
      props.setshowLoadder1(true);
      props.setcomponentLoadder(true);
      // props.setReloadPage("YES");
      // history.push(`/users/allusers`);
      setTimeout(() => {
        props.setReloadPage("YES");
        // history.push(`/users/allusers`);
        // window.location.reload(false);
        props.setshowLoadder1(false);
        props.setOpenConfirmationModal(false);
      }, 10000);
    } else if (
      props.ConfirmationModalActionType == "UserImportHistorysuccess"
    ) {
      props.setshowLoadder1(true);
      props.setcomponentLoadder(true);

      setTimeout(() => {
        history.push(`/users/import-users-history`);

        props.setshowLoadder1(false);
        props.setOpenConfirmationModal(false);
      }, 10000);
    }
  };

  const handleClickNo = () => {};

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

        {/* <ValidatorForm className={`global-form`} onSubmit={handleCustomSuccess}> */}
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
            disabled={props.showLoadder1}
          >
            {props.showLoadder1 ? <ButtonLoadderComponent /> : "OK"}
          </Button>
          <Button onClick={handleCloseSuccess} className="global-cancel-btn">
            GO to &nbsp;
            <HomeIcon />
          </Button>
        </DialogActions>
        {/* </ValidatorForm> */}
      </Dialog>
    </div>
  );
}

export default CustomizedDialogs;
