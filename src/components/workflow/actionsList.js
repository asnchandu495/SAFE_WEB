import React, { useState, Fragment, useEffect } from "react";
import { Link as LinkTo, withRouter } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import Tooltip from "@material-ui/core/Tooltip";
import { useParams } from "react-router-dom";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import workflowService from "../../services/workflowService";
import ConfirmationDialog from "../common/confirmdialogbox";
import ToasterMessageComponent from "../common/toaster";

function ActionList(props) {
  const workflowId = props.match.params.wid;
  const activityId = props.match.params.aid;
  const uActivityId = props.match.params.uaid;
  const actionId = props.match.params.actionId;
  const workflowApiCall = new workflowService();

  const [selectedIndex, setSelectedIndex] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [assignedActivities, setAssignedActivities] = useState([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");

  useEffect(() => {
    workflowApiCall
      .getOptionsByActivityId(activityId)
      .then((result) => {
        setAssignedActivities(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props]);

  function searchActions(e) {
    var input = e.target.value;
    var filter = input.toLowerCase();
    var nodes = document.getElementsByClassName("actionlistitems");

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].innerText.toLowerCase().includes(filter)) {
        nodes[i].style.display = "block";
      } else {
        nodes[i].style.display = "none";
      }
    }
  }
  //Method on change of the list item
  function handleListItemClick(action) {
    props.setSelectedAction(action);
    props.setSelectedActionList(action.uniqueActivityId);
  }
  /**
   * Handle ClickOpen Confirmation modal
   * Set the action type and the message on the dialogbox and also once the modal opens and checks with commom folder 
      confirmdialogbox component 
   * @param  {} value-rowdata to get id
   */
  const handleClickOpenConfirmationModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteOption");
    setConfirmationHeaderTittle("Revert Option");
    setConfirmationDialogContextText(
      `Are you sure you want to revert ${value.name} ?`
    );
  };

  return (
    <>
      <List component="nav">
        <ListItem className="search-list-input">
          <TextField
            variant="outlined"
            fullWidth
            id="groupName"
            placeholder="Search by option..."
            name="groupName"
            onChange={searchActions}
            InputLabelProps={{ shrink: false }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </ListItem>
        {props.allActivityOptions && props.allActivityOptions.length > 0
          ? props.allActivityOptions.map((act, index) => {
              let thisFormData = assignedActivities.find(
                (sAct) => sAct.uniqueActivityId == act.uniqueActivityId
              );
              return (
                <div
                  className={`actionlistitems ${
                    props.disableActions ? "no-pointer-events" : ""
                  }`}
                  key={"action=" + act.uniqueActivityId}
                >
                  <ListItem
                    button
                    selected={props.selectedActionList == act.uniqueActivityId}
                    alignItems="flex-start"
                  >
                    <ListItemText
                      onClick={() => handleListItemClick(act)}
                      secondary={
                        <p className="question-name">{act.friendlyName}</p>
                      }
                    />
                    {thisFormData ? (
                      <>
                        <Tooltip title="Action is configured">
                          <DoneAllIcon className="already-saved"></DoneAllIcon>
                        </Tooltip>
                        <Tooltip title="Revert action">
                          <SettingsBackupRestoreIcon
                            className="already-configured"
                            onClick={() =>
                              handleClickOpenConfirmationModal(thisFormData)
                            }
                          ></SettingsBackupRestoreIcon>
                        </Tooltip>
                      </>
                    ) : (
                      ""
                    )}
                  </ListItem>
                  <Divider component="li" />
                </div>
              );
            })
          : ""}
      </List>
      <ConfirmationDialog
        openConfirmationModal={openConfirmationModal}
        ConfirmationHeaderTittle={ConfirmationHeaderTittle}
        ConfirmationDialogContextText={ConfirmationDialogContextText}
        setOpenConfirmationModal={setOpenConfirmationModal}
        setStateSnackbar={setStateSnackbar}
        setToasterMessage={setToasterMessage}
        settoasterServerity={settoasterServerity}
        ConfirmationModalActionType={ConfirmationModalActionType}
        SelectedRowDetails={SelectedRowDetails}
        setReloadPage={props.setReloadPage}
      />
      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
    </>
  );
}

export default withRouter(ActionList);
