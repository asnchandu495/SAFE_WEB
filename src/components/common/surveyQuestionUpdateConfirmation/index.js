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

function SurveyQuestionUpdate(props) {
    const questionaireApiCall = new questionaireService();
    const [showLoadderConfirmation, setshowLoadderConfirmation] = useState(false);

    const handleClickYes = () => {
        setshowLoadderConfirmation(true);
        switch (props.sendQuestionType) {
            case "Boolean":
                questionaireApiCall
                    .UpdateBoolenQuestion(props.questionData)
                    .then((res) => {
                        props.setisAlertBoxOpened(false);
                        props.setStateSnackbar(true);
                        props.setToasterMessage("Question Details Updated.");
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
                    .UpdateDateQuestion(props.questionData)
                    .then((res) => {
                        props.setisAlertBoxOpened(false);
                        props.setStateSnackbar(true);
                        props.setToasterMessage("Question Details Updated.");
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
                    .UpdateMultiChoiceQuestion(props.questionData)
                    .then((res) => {
                        props.setisAlertBoxOpened(false);
                        props.setStateSnackbar(true);
                        props.setToasterMessage("Question Details Updated.");
                        props.settoasterServerity("success");
                        setTimeout(() => {
                            props.history.push(
                                `/questionaires/add-questions/${props.surveyIdURL}/${props.questionData.id}?type=MultiChoice`
                            );
                            props.setOpenConfirmationModal(false);
                            props.setshowLoadder(false);
                            props.setshowLoadderFlag(false);
                            setshowLoadderConfirmation(false);
                        }, 10000);
                    })
                    .catch((err) => {
                        setshowLoadderConfirmation(false);
                        props.setshowLoadderFlag(false);
                        props.setOpenConfirmationModal(false);
                        props.setToasterMessage(err.data.errors);
                        props.settoasterServerity("error");
                        props.setStateSnackbar(true);
                        props.setshowLoadder(false);
                    });
                break;
            case "MultiChoiceFlag":
                questionaireApiCall
                    .UpdateMultiChoiceFlags(props.questionData)
                    .then((res) => {
                        props.setisAlertBoxOpened(false);
                        props.setStateSnackbar(true);
                        props.setToasterMessage("Question Details Updated.");
                        props.settoasterServerity("success");
                        setTimeout(() => {
                            props.history.push(
                                `/questionaires/view-questions/${props.surveyIdURL}`
                            );
                            props.setOpenConfirmationModal(false);
                            props.setshowLoadder(false);
                            props.setshowLoadderFlag(false);
                            setshowLoadderConfirmation(false);
                        }, 10000);
                    })
                    .catch((err) => {
                        setshowLoadderConfirmation(false);
                        props.setshowLoadderFlag(false);
                        props.setOpenConfirmationModal(false);
                        props.setToasterMessage(err.data.errors);
                        props.settoasterServerity("error");
                        props.setStateSnackbar(true);
                        props.setshowLoadder(false);
                    });
                break;
            case "Numeric":
                questionaireApiCall
                    .UpdateNumericQuestion(props.questionData)
                    .then((res) => {
                        props.setisAlertBoxOpened(false);
                        props.setStateSnackbar(true);
                        props.setToasterMessage("Question Details Updated.");
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
                    .UpdateSingleChoiceQuestion(props.questionData)
                    .then((res) => {
                        props.setisAlertBoxOpened(false);
                        props.setStateSnackbar(true);
                        props.setToasterMessage("Question Details Updated.");
                        props.settoasterServerity("success");
                        setTimeout(() => {
                            props.history.push(
                                `/questionaires/add-questions/${props.surveyIdURL}/${props.questionData.id}?type=SingleChoice`
                            );
                            props.setOpenConfirmationModal(false);
                            props.setshowLoadder(false);
                            props.setshowLoadderFlag(false);
                            setshowLoadderConfirmation(false);
                        }, 10000);
                    })
                    .catch((err) => {
                        setshowLoadderConfirmation(false);
                        props.setshowLoadderFlag(false);
                        props.setOpenConfirmationModal(false);
                        props.setToasterMessage(err.data.errors);
                        props.settoasterServerity("error");
                        props.setStateSnackbar(true);
                        props.setshowLoadder(false);
                    });
                break;
            case "SingleChoiceFlag":
                questionaireApiCall
                    .UpdateBoolenQuestion(props.questionData)
                    .then((res) => {
                        props.setisAlertBoxOpened(false);
                        props.setStateSnackbar(true);
                        props.setToasterMessage("Question Details Updated.");
                        props.settoasterServerity("success");
                        setTimeout(() => {
                            props.history.push(
                                `/questionaires/view-questions/${props.surveyIdURL}`
                            );
                            props.setOpenConfirmationModal(false);
                            props.setshowLoadder(false);
                            props.setshowLoadderFlag(false);
                            setshowLoadderConfirmation(false);
                        }, 10000);
                    })
                    .catch((err) => {
                        setshowLoadderConfirmation(false);
                        props.setshowLoadderFlag(false);
                        props.setOpenConfirmationModal(false);
                        props.setToasterMessage(err.data.errors);
                        props.settoasterServerity("error");
                        props.setStateSnackbar(true);
                        props.setshowLoadder(false);
                    });
                break;
            case "Time":
                questionaireApiCall
                    .UpdateTimeQuestion(props.questionData)
                    .then((res) => {
                        props.setisAlertBoxOpened(false);
                        props.setStateSnackbar(true);
                        props.setToasterMessage("Question Details Updated.");
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
                console.log('none');
                break;
        }
    };

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
                    <Typography gutterBottom>
                        {props.warningMessage}
                    </Typography>
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

export default withRouter(SurveyQuestionUpdate);
