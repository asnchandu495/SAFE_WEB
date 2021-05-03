import React, { Fragment, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { connect } from "react-redux";
import * as TeamAction from "../../Redux/Action/teamAction";
import PropTypes from "prop-types";
import AlertBoxComponent from "../common/alert";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import Autocomplete from "@material-ui/lab/Autocomplete";
import questionaireService from "../../services/questionaireService";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogActions from "@material-ui/core/DialogActions";

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

function PublishQuestionnaire(props) {
  const questionnaireId = props.match.params.id;
  const [componentLoadder, setComponentLoadder] = useState(true);
  const questionaireApiCall = new questionaireService();
  const [showLoadder, setshowLoadder] = useState(false);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [ViewQuestionaireDetails, setViewQuestionaireDetails] = useState([]);
  const [
    ConfirmationDialogContextText,
    setConfirmationDialogContextText,
  ] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  const [formData, SetformData] = useState({
    id: questionnaireId,
    isSaveAsDraft: true,
  });
  useEffect(() => {
    questionaireApiCall
      .getSurveyById(questionnaireId)
      .then((questionaireInfo) => {
        setComponentLoadder(false);
        setViewQuestionaireDetails(questionaireInfo);
        console.log(questionaireInfo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handlePublish() {
    setshowLoadder(true);
    var publishData = formData;
    questionaireApiCall
      .PublishQuestionnaire(publishData)
      .then((result) => {
        setisAlertBoxOpened(false);
        setshowLoadder(false);
        setStateSnackbar(true);
        setToasterMessage("Questionnaire is Published");
        settoasterServerity("success");
        setTimeout(() => {
          props.history.push("/questionaires/allquestionaires");
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
    <div className="innerpage-container">
      <AlertBoxComponent />
      <Breadcrumbs aria-label="breadcrumb" className="global-breadcrumb">
        <LinkTo
          color="inherit"
          href="#"
          to={`/home/dashboard`}
          className="inactive"
        >
          Home
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/teams/allteams`}
          className="inactive"
        >
          List
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="inactive">
          {ViewQuestionaireDetails.name}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Review Questionnaire
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <Paper className="main-paper">
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Publish
          </Button>
          <Dialog
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            open={open}
          >
            <DialogTitle id="form-dialog-title" onClose={handleClose}>
              Publish
            </DialogTitle>

            <DialogContent dividers>
              <Typography gutterBottom>
                Are you sure you want to publish this changes?
              </Typography>
            </DialogContent>
            <DialogActions>
              <div className={`form-buttons-container`}>
                <Button
                  variant="contained"
                  onClick={handlePublish}
                  color="primary"
                  className="global-submit-btn"
                  disabled={showLoadder}
                >
                  {" "}
                  {showLoadder ? <ButtonLoadderComponent /> : "Yes"}
                </Button>
              </div>
              <div className={`form-buttons-container`}>
                <Button
                  variant="contained"
                  onClick={handleClose}
                  color="secondary"
                  className="global-danger-btn"
                >
                  No
                </Button>
              </div>
            </DialogActions>
          </Dialog>
        </Paper>
      ) : (
        <ComponentLoadderComponent />
      )}
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

export default PublishQuestionnaire;
