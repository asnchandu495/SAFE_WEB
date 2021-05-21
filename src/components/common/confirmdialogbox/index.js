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
import teamService from "../../../services/teamService";
import * as TeamAction from "../../../Redux/Action/teamAction";
import * as QuestionaireAction from "../../../Redux/Action/questionaireAction";
import * as QuestionAction from "../../../Redux/Action/questionAction";
import * as AssignquestionaireAction from "../../../Redux/Action/assignquestionaireAction";
import questionaireService from "../../../services/questionaireService";
import * as WorkflowAction from "../../../Redux/Action/workflowAction";
import workflowService from "../../../services/workflowService";
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

function CustomizedDialogs(props) {
  const faqApiCall = new FaqService();
  const teamApiCall = new teamService();
  const questionaireApiCall = new questionaireService();
  const workflowApiCall = new workflowService();
  const [showLoadder, setshowLoadder] = useState(false);

  const handleClickYes = () => {
    if (props.ConfirmationModalActionType == "RemoveProfilePhoto") {
      props.setImageBinaryData("");
      props.setStateSnackbar(true);
      props.setToasterMessage("Profile picture removed");
      props.settoasterServerity("success");
      props.setOpenConfirmationModal(false);
    } else if (props.ConfirmationModalActionType == "DeactiveUser") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];
      props
        .DeleteUser(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted user.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteUserGroup") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];
      props
        .DelteUserGroup(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted User Group.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteTeams") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];
      props
        .DeleteTeam(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          // props.setStateSnackbar(true);
          props.setToasterMessage("Team is deleted");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteWorflow") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];
      props
        .DeleteWorkflow(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Workflow is deleted");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteQuestionaire") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];
      props
        .DeleteQuestion(thisId)
        .then((result) => {
          props.setToasterMessage("Questionaire is deleted");
          props.setStateSnackbar(true);
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteEmergencyContacts") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];
      props
        .DeletEmergencyContactList(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted Emergency Contacts.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "CancelQuestionaire") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];

      props
        .DeleteQuestionaireUsergroup(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted Questionaire.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "EmergencyContactCancel") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails;
      props
        .DeletAssignEmergencyContactList(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage(
            "Disassociated Emergency Contacts from User Group."
          );
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "ChangeDocStatus") {
      setshowLoadder(true);
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
          props.setToasterMessage(
            "Updated Emergency Contact assignment status to User Group."
          );
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (
      props.ConfirmationModalActionType == "ChangeQuestionnaireStatus"
    ) {
      setshowLoadder(true);
      let thisId = props.SelectedRowDetails[0];
      let data = {
        id: props.SelectedRowDetails[0],
        status: props.SelectedRowDetails[3],
      };
      if (data.status == "Active") {
        data.status = "Inactive";
      } else {
        data.status = "Active";
      }
      props
        .ChangeQuestionnaireUserStatus(data)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Updated");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "PublishWorkflow") {
      setshowLoadder(true);
      let data = {
        id: props.SelectedRowDetails[0],
        isActive: props.SelectedRowDetails[3] ? false : true,
      };

      props
        .PublishWorkflow(data)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Published");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeactiveDesignation") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];
      props
        .DelteUserDesignation(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted Designation.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteCovidState") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];
      props
        .DelteCovidState(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted COVID state.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteFaq") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];
      props
        .DeleteFaq(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted FAQ.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteSite") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];
      props
        .DeleteSite(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted Site.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteFloor") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];
      props
        .DeleteFloor(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted Floor.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DisassociateFaq") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];
      props
        .DeleteAssignFaq(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Disassociated FAQ from User Group.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "ChangeStatusFaq") {
      setshowLoadder(true);
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
          props.setToasterMessage(
            "Updated FAQ assignment status to User Group.s"
          );
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteLocation") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];
      props
        .DeleteLocation(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted Location.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteBooleanQuestion") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails.id;
      props
        .DeleteSelectedQuestion(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted Boolean Question.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          props.setSelectedQuestionDetails((selectedQuestionDetails) => ({
            ...props.selectedQuestionDetails,
            ["questionType"]: null,
          }));
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteFreeQuestion") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails.id;
      props
        .DeleteFreetextQuestionData(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted Freetext Question.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          props.setSelectedQuestionDetails((selectedQuestionDetails) => ({
            ...props.selectedQuestionDetails,
            ["questionType"]: null,
          }));
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteTimeQuestion") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails.id;
      questionaireApiCall
        .DeleteTimeQuestion(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted Time Question.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          props.setSelectedQuestionDetails((selectedQuestionDetails) => ({
            ...props.selectedQuestionDetails,
            ["questionType"]: null,
          }));
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteDateQuestion") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails.id;
      questionaireApiCall
        .DeleteDateQuestion(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted date Question.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          props.setSelectedQuestionDetails((selectedQuestionDetails) => ({
            ...props.selectedQuestionDetails,
            ["questionType"]: null,
          }));
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteNumericQuestion") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails.id;
      props
        .DeleteNumericQuestionData(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted numeric Question.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          props.setSelectedQuestionDetails((selectedQuestionDetails) => ({
            ...props.selectedQuestionDetails,
            ["questionType"]: null,
          }));
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (
      props.ConfirmationModalActionType == "DeleteSinglechoiceQuestion"
    ) {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails.id;
      props
        .DeleteSinglechoiceQuestionData(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted singlechoice Question.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          props.setSelectedQuestionDetails((selectedQuestionDetails) => ({
            ...props.selectedQuestionDetails,
            ["questionType"]: null,
          }));
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (
      props.ConfirmationModalActionType == "DeleteMultichoiceQuestion"
    ) {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails.id;
      props
        .DeleteMultiQuestionData(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Deleted Multichoice Question.");
          props.settoasterServerity("success");
          props.setOpenConfirmationModal(false);
          props.setSelectedQuestionDetails((selectedQuestionDetails) => ({
            ...props.selectedQuestionDetails,
            ["questionType"]: null,
          }));
          setshowLoadder(false);
        })
        .catch((error) => {
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteActivity") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails[0];
      workflowApiCall
        .DeleteActivity(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Activity is deleted");
          props.settoasterServerity("success");
          setTimeout(() => {
            props.setOpenConfirmationModal(false);
            setshowLoadder(false);
            props.setReloadPage("YES");
          }, 6000);
          setshowLoadder(false);
        })
        .catch((error) => {
          setshowLoadder(false);
          toasterErrorMessage(error);
        });
    } else if (props.ConfirmationModalActionType == "DeleteOption") {
      setshowLoadder(true);
      var thisId = props.SelectedRowDetails.id;
      workflowApiCall
        .DeleteOption(thisId)
        .then((result) => {
          props.setStateSnackbar(true);
          props.setToasterMessage("Option is reverted");
          props.settoasterServerity("success");
          setTimeout(() => {
            props.setOpenConfirmationModal(false);
            setshowLoadder(false);
            props.setReloadPage("YES");
          }, 6000);
          setshowLoadder(false);
        })
        .catch((error) => {
          setshowLoadder(false);
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
        className="global-dialog confirmation-dialog global-form"
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

CustomizedDialogs.propTypes = {
  DeletEmergencyContactList: PropTypes.func.isRequired,
  DeleteUser: PropTypes.func.isRequired,
  DelteUserGroup: PropTypes.func.isRequired,
  ChangeAssignEmergencyContactStatus: PropTypes.func.isRequired,
  ChangeQuestionnaireUserStatus: PropTypes.func.isRequired,
  DeleteTeam: PropTypes.func.isRequired,
  DeleteQuestion: PropTypes.func.isRequired,
  DeleteSelectedQuestion: PropTypes.func.isRequired,
  DeleteDateQuestionData: PropTypes.func.isRequired,
  // DeleteWorkflow: PropTypes.func.isRequired,
};
function mapStateToProps(state, ownProps) {}

const mapDispatchToProps = {
  DeletEmergencyContactList: EmergencyContactAction.DeletEmergencyContactList,
  DeleteQuestionaireUsergroup:
    AssignquestionaireAction.deleteQuestionaireUsergroupData,
  DeletAssignEmergencyContactList:
    AssignEmergencyContactAction.DeletAssignEmergencyContactList,
  ChangeAssignEmergencyContactStatus:
    AssignEmergencyContactAction.UpdateAssignEmergencyContact,
  ChangeQuestionnaireUserStatus:
    AssignquestionaireAction.ChangeQuestionnaireStatus,
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
  DeleteTeam: TeamAction.deleteTeamData,
  DeleteQuestion: QuestionaireAction.deleteQuestionaireData,
  DeleteSelectedQuestion: QuestionAction.DeleteBooleanQuestion,
  DeleteDateQuestionData: QuestionAction.DeleteDateQuestion,
  DeleteFreetextQuestionData: QuestionAction.DeleteFreeQuestion,
  DeleteMultiQuestionData: QuestionAction.DeleteMultichoiceQuestion,
  DeleteNumericQuestionData: QuestionAction.DeleteNumericQuestion,
  DeleteSinglechoiceQuestionData: QuestionAction.DeleteSinglechoiceQuestion,
  DeleteWorkflow: WorkflowAction.deleteWorkflowData,
  PublishWorkflow: WorkflowAction.PublishWorkflow,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomizedDialogs);
