import React, { Fragment, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo, withRouter } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import ActionFormNew from "./actionFormNew";
import ActionList from "./actionsList";
import ConfirmationDialog from "../common/confirmdialogbox";
import workflowService from "../../services/workflowService";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import MUIDataTable from "mui-datatables";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";

function AddActionsNew(props) {
  const workflowId = props.match.params.wid;
  const activityId = props.match.params.aid;
  const uActivityId = props.match.params.uaid;
  const workflowApiCall = new workflowService();

  const [componentLoadder, setComponentLoadder] = useState(true);
  const [reloadPage, setReloadPage] = useState("NO");
  const [allActivityOptions, setAllActivityOptions] = useState([]);
  const [selectedAction, setSelectedAction] = useState();
  const [worlflowDetails, setWorkflowDetails] = useState();
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
  const [selectedActivityDetails, setSelectedActivityDetails] = useState();

  useEffect(() => {
    setComponentLoadder(true);
    Promise.all([
      workflowApiCall.getAllMasterOptionsForActivity(uActivityId),
      workflowApiCall.GetWorkFlowById(workflowId),
      workflowApiCall.GetActivityById(activityId),
    ])
      .then(
        ([
          allMasterOptionsForActivity,
          getWorkflowDetails,
          activityDetails,
        ]) => {
          setWorkflowDetails(getWorkflowDetails);
          setAllActivityOptions(allMasterOptionsForActivity);
          setSelectedActivityDetails(activityDetails);
          setComponentLoadder(false);
          setReloadPage("NO");
        }
      )
      .catch((error) => {
        console.log(error);
      });
  }, [reloadPage]);

  function configureOption(getRowData) {
    props.history.push(
      `/workflow/${workflowId}/${activityId}/${uActivityId}/${getRowData[0]}/configure-action`
    );
  }

  const handleClickOpenConfirmationModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteOption");
    setConfirmationHeaderTittle("Delete Option");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${value[1]} ?`
    );
  };

  return (
    <div className="innerpage-container">
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
          to={`/workflow/allWorkflow`}
          className="inactive"
        >
          Work Flow
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/workflow/view-workflow/${workflowId}`}
          className="inactive"
        >
          {worlflowDetails ? worlflowDetails.name : ""}
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/workflow/${workflowId}/activities`}
          className="inactive"
        >
          {selectedActivityDetails ? selectedActivityDetails.name : ""}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" to="#" className="active">
          Actions
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder ? (
        <ComponentLoadderComponent></ComponentLoadderComponent>
      ) : (
        <Paper className="main-paper main-paper-add-question">
          <Grid container spacing={0}>
            <Grid item xs={12} sm={3} className="list-questions-container">
              <Paper className="list-questions">
                <ActionList
                  allActivityOptions={allActivityOptions}
                  setSelectedAction={setSelectedAction}
                  setReloadPage={setReloadPage}
                  reloadPage={reloadPage}
                ></ActionList>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Paper className="add-new-question">
                {selectedAction ? (
                  <ActionFormNew
                    selectedAction={selectedAction}
                    setReloadPage={setReloadPage}
                    reloadPage={reloadPage}
                  ></ActionFormNew>
                ) : (
                  "Please select an action from the list"
                )}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
}

export default withRouter(AddActionsNew);
