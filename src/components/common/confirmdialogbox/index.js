import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import * as EmergencyContactAction from "../../../Redux/Action/emergencyContactAction";
import * as UserAction from "../../../Redux/Action/userAction";
import * as DesignationAction from "../../../Redux/Action/designationAction";
import * as CovidStateAction from "../../../Redux/Action/covidStateAction";
import * as UserGroupAction from "../../../Redux/Action/userGroupAction";
import * as AssignEmergencyContactAction from "../../../Redux/Action/assignemergencycontactAction";
import * as FaqAction from "../../../Redux/Action/faqAction";
import * as AssignFaqAction from "../../../Redux/Action/assignFaqAction";
import * as SiteAction from "../../../Redux/Action/siteAction";
import * as AddLocationAction from "../../../Redux/Action/addLocationAction";
import * as AddFloorAction from "../../../Redux/Action/addFloorAction";
import PropTypes from "prop-types";
import FaqService from "../../../services/faqService";

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
  const faqApiCall = new FaqService();

  const handleClickYes = () => {
    if (props.ConfirmationModalActionType == "RemoveProfilePhoto") {
      props.setImageBinaryData("");
      props.setStateSnackbar(true);
      props.setToasterMessage("Profile picture removed");
      props.settoasterServerity("success");
      props.setOpenConfirmationModal(false);
    } else if (props.ConfirmationModalActionType == "DeactiveUser") {
      var thisId = props.SelectedRowDetails[0];
      props
        .DeleteUser(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("User deleted");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
        })
        .catch((error) => {
          console.log(error);
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteUserGroup") {
      var thisId = props.SelectedRowDetails[0];
      props
        .DelteUserGroup(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("User group deleted");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
        })
        .catch((error) => {
          console.log(error);
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteEmergencyContacts") {
      var thisId = props.SelectedRowDetails[0];
      props
        .DeletEmergencyContactList(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Emergency contact  deleted");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
        })
        .catch((error) => {
          console.log(error);
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "EmergencyContactCancel") {
      var thisId = props.SelectedRowDetails;
      props
        .DeletAssignEmergencyContactList(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Assign emergency contact details cancelled");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
        })
        .catch((error) => {
          console.log(error);
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "ChangeDocStatus") {
      var thisId = props.SelectedRowDetails[0];
      var data = {
        emergencyContactId: props.SelectedRowDetails[1],
        userGroupId: props.SelectedRowDetails[2],
        isActive: "",
      };
      var changeStatus = "";
      var userStatus = props.SelectedRowDetails[5];
      if (userStatus == true) {
        data.isActive = false;
        changeStatus = false;
      } else {
        data.isActive = true;
        changeStatus = true;
      }

      props
        .ChangeAssignEmergencyContactStatus(thisId, changeStatus, data)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Emergency contact doc status updated");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
        })
        .catch((error) => {
          console.log(error);
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeactiveDesignation") {
      var thisId = props.SelectedRowDetails[0];
      props
        .DelteUserDesignation(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Designation is deleted");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
        })
        .catch((error) => {
          console.log(error);
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteCovidState") {
      var thisId = props.SelectedRowDetails[0];
      props
        .DelteCovidState(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Covid state is deleted");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
        })
        .catch((error) => {
          console.log(error);
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteFaq") {
      var thisId = props.SelectedRowDetails[0];
      props
        .DeleteFaq(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Faq is deleted");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
        })
        .catch((error) => {
          console.log(error);
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteSite") {
      var thisId = props.SelectedRowDetails[0];
      props
        .DeleteSite(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Site is deleted");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
        })
        .catch((error) => {
          console.log(error);
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteFloor") {
      var thisId = props.SelectedRowDetails[0];
      console.log(thisId);
      props
        .DeleteFloor(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Floor is deleted");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          // props.DeleteSiteFloor(thisId).then(result=>{
          //   console.log(result);
          // }).catch(err=>{
          //   console.log(err);
          // })
        })
        .catch((error) => {
          console.log(error);
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DisassociateFaq") {
      var thisId = props.SelectedRowDetails[0];
      props
        .DeleteAssignFaq(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Faq is disassociated");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
        })
        .catch((error) => {
          console.log(error);
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "ChangeStatusFaq") {
      var thisId = props.SelectedRowDetails[0];
      let activeValue = props.SelectedRowDetails[3] ? false : true;
      let sendData = {
        id: props.SelectedRowDetails[0],
        groupId: props.SelectedRowDetails[4],
        isActive: activeValue,
      };
      props
        .ChangAssignFaqStatus(sendData)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Status is updated");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
        })
        .catch((error) => {
          console.log(error);
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteLocation") {
      var thisId = props.SelectedRowDetails[0];
      props
        .DeleteLocation(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Location is deleted");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
        })
        .catch((error) => {
          console.log(error);
          toasterErrorMessage(error);
        });
    }
  };

  const handleClickNo = () => {
    props.setOpenConfirmationModal(false);
  };

  function toasterErrorMessage(errorMessage) {
    props.setToasterMessage(errorMessage.data.errors);
    props.settoasterServerity("error");
    props.setStateSnackbar(true);
  }

  return (
    <div>
      <Dialog
        onClose={handleClickNo}
        aria-labelledby="customized-dialog-title"
        open={props.openConfirmationModal}
        className="global-dialog confirmation-dialog"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClickNo}>
          {props.ConfirmationHeaderTittle}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            {props.ConfirmationDialogContextText}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickNo} className="no-button">
            No
          </Button>
          <Button onClick={handleClickYes} className="yes-button">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

CustomizedDialogs.propTypes = {
  DeletEmergencyContactList: PropTypes.func.isRequired,
  DeleteUser: PropTypes.func.isRequired,
  DelteUserGroup: PropTypes.func.isRequired,
  ChangeAssignEmergencyContactStatus: PropTypes.func.isRequired,
};
function mapStateToProps(state, ownProps) {}

const mapDispatchToProps = {
  DeletEmergencyContactList: EmergencyContactAction.DeletEmergencyContactList,
  DeletAssignEmergencyContactList:
    AssignEmergencyContactAction.DeletAssignEmergencyContactList,
  ChangeAssignEmergencyContactStatus:
    AssignEmergencyContactAction.UpdateAssignEmergencyContact,
  DeleteUser: UserAction.deleteUser,
  DelteUserGroup: UserGroupAction.deleteUserGroup,
  DelteUserDesignation: DesignationAction.deleteUserDesignation,
  DelteCovidState: CovidStateAction.deleteCovidState,
  DeleteFaq: FaqAction.deleteFaq,
  DeleteSite: SiteAction.deleteSite,
  DeleteAssignFaq: AssignFaqAction.deleteAssignFaq,
  ChangAssignFaqStatus: AssignFaqAction.UpdateFaqAssign,
  DeleteLocation: AddLocationAction.DeleteLocation,
  DeleteFloor: AddFloorAction.DeleteFloor,
  DeleteSiteFloor: SiteAction.deleteSiteFloor,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomizedDialogs);
