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
    const [showLoadder, setshowLoadder] = useState(false);

    const handleClickYes = () => {
        props.settoasterServerity("");
    };

    const handleClickNo = () => {
        props.setOpenConfirmationModal(false);
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
                        Hi
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClickNo}
                        className="no-button"
                        disabled={showLoadder}
                    >
                        No
                    </Button>
                    <Button
                        onClick={handleClickYes}
                        className="yes-button"
                        disabled={showLoadder}
                    >
                        {showLoadder ? <ButtonLoadderComponent /> : "Yes"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SurveyQuestionUpdate;
