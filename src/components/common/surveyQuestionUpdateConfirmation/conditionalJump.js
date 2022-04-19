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
import { Link as LinkTo, withRouter } from "react-router-dom";
import questionaireService from "../../../services/questionaireService";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";

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

function ConditionalJump(props) {
  const questionaireApiCall = new questionaireService();

  //Set the states
  const [showLoadderConfirmation, setshowLoadderConfirmation] = useState(false);

  /**
   * Handle Click YES
   Set the toaster messages based on the switch conditions
  *  
  */
  const handleClickYes = () => {
    setshowLoadderConfirmation(true);
    switch (props.sendQuestionType) {
      case "Boolean":
        questionaireApiCall
          .updateBooleanConditionalJump(props.questionData)
          .then((res) => {
            props.setStateSnackbar(true);
            props.setToasterMessage("Conditional jump is updated.");
            props.settoasterServerity("success");
            setTimeout(() => {
              props.history.push(
                `/questionaires/view-questions/${props.surveyIdURL}`
              );
              props.setOpenConfirmationModal(false);
              props.setshowLoadder(false);
              setshowLoadderConfirmation(false);
            }, 10000);
          })
          .catch((err) => {
            setshowLoadderConfirmation(false);
            props.setOpenConfirmationModal(false);
            props.setToasterMessage(err.data.errors);
            props.settoasterServerity("error");
            props.setStateSnackbar(true);
            props.setshowLoadder(false);
          });
        break;
      case "Date":
        questionaireApiCall
          .updateDateConditionalJump(props.questionData)
          .then((res) => {
            props.setisAlertBoxOpened(false);
            props.setStateSnackbar(true);
            props.setToasterMessage("Conditional jump is updated.");
            props.settoasterServerity("success");
            setTimeout(() => {
              props.history.push(
                `/questionaires/view-questions/${props.surveyIdURL}`
              );
              props.setOpenConfirmationModal(false);
              props.setshowLoadder(false);
              setshowLoadderConfirmation(false);
            }, 10000);
          })
          .catch((err) => {
            setshowLoadderConfirmation(false);
            props.setOpenConfirmationModal(false);
            props.setToasterMessage(err.data.errors);
            props.settoasterServerity("error");
            props.setStateSnackbar(true);
            props.setshowLoadder(false);
          });
        break;
      case "MultiChoice":
        questionaireApiCall
          .updateMultiChoiceConditionalJump(props.questionData)
          .then((res) => {
            props.setisAlertBoxOpened(false);
            props.setStateSnackbar(true);
            props.setToasterMessage("Conditional jump is updated.");
            props.settoasterServerity("success");
            setTimeout(() => {
              props.history.push(
                `/questionaires/view-questions/${props.surveyIdURL}`
              );
              props.setOpenConfirmationModal(false);
              props.setshowLoadder(false);
              setshowLoadderConfirmation(false);
            }, 10000);
          })
          .catch((err) => {
            setshowLoadderConfirmation(false);
            props.setOpenConfirmationModal(false);
            props.setToasterMessage(err.data.errors);
            props.settoasterServerity("error");
            props.setStateSnackbar(true);
            props.setshowLoadder(false);
          });
        break;
      case "Numeric":
        questionaireApiCall
          .updateNumericConditionalJump(props.questionData)
          .then((res) => {
            props.setisAlertBoxOpened(false);
            props.setStateSnackbar(true);
            props.setToasterMessage("Conditional jump is updated.");
            props.settoasterServerity("success");
            setTimeout(() => {
              props.history.push(
                `/questionaires/view-questions/${props.surveyIdURL}`
              );
              props.setOpenConfirmationModal(false);
              props.setshowLoadder(false);
              setshowLoadderConfirmation(false);
            }, 10000);
          })
          .catch((err) => {
            setshowLoadderConfirmation(false);
            props.setOpenConfirmationModal(false);
            props.setToasterMessage(err.data.errors);
            props.settoasterServerity("error");
            props.setStateSnackbar(true);
            props.setshowLoadder(false);
          });
        break;
      case "SingleChoice":
        questionaireApiCall
          .updateSingleChoiceConditionalJump(props.questionData)
          .then((res) => {
            props.setisAlertBoxOpened(false);
            props.setStateSnackbar(true);
            props.setToasterMessage("Conditional jump is updated.");
            props.settoasterServerity("success");
            setTimeout(() => {
              props.history.push(
                `/questionaires/view-questions/${props.surveyIdURL}`
              );
              props.setOpenConfirmationModal(false);
              props.setshowLoadder(false);
              setshowLoadderConfirmation(false);
            }, 10000);
          })
          .catch((err) => {
            setshowLoadderConfirmation(false);
            props.setOpenConfirmationModal(false);
            props.setToasterMessage(err.data.errors);
            props.settoasterServerity("error");
            props.setStateSnackbar(true);
            props.setshowLoadder(false);
          });
        break;
      case "Time":
        questionaireApiCall
          .updateTimeConditionalJump(props.questionData)
          .then((res) => {
            props.setisAlertBoxOpened(false);
            props.setStateSnackbar(true);
            props.setToasterMessage("Conditional jump is updated.");
            props.settoasterServerity("success");
            setTimeout(() => {
              props.history.push(
                `/questionaires/view-questions/${props.surveyIdURL}`
              );
              props.setOpenConfirmationModal(false);
              props.setshowLoadder(false);
              setshowLoadderConfirmation(false);
            }, 10000);
          })
          .catch((err) => {
            setshowLoadderConfirmation(false);
            props.setOpenConfirmationModal(false);
            props.setToasterMessage(err.data.errors);
            props.settoasterServerity("error");
            props.setStateSnackbar(true);
            props.setshowLoadder(false);
          });
        break;
      default:
        console.log("none");
        break;
    }
  };

  /**
  * Handle Click No
   Close the popup or the dialog box if clicked on No or the operation should be performed
   */
  const handleClickNo = () => {
    props.setOpenConfirmationModal(false);
    props.setshowLoadder(false);
  };

  return (
    <div>
      <Dialog
        onClose={handleClickNo}
        aria-labelledby="customized-dialog-title"
        open={props.openConfirmationModal}
        className="global-dialog confirmation-dialog global-form"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClickNo}>
          Alert
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>{props.warningMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClickNo}
            className="no-button"
            disabled={showLoadderConfirmation}
          >
            Cancel
          </Button>
          <Button
            onClick={handleClickYes}
            className="yes-button"
            disabled={showLoadderConfirmation}
          >
            {showLoadderConfirmation ? <ButtonLoadderComponent /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withRouter(ConditionalJump);
