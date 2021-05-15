import React, { Fragment, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo, withRouter } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import ActionForm from "./actionForm";
import ActionList from "./actionsList";
import ConfirmationDialog from "../common/confirmdialogbox";
import workflowService from "../../services/workflowService";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import MUIDataTable from "mui-datatables";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";

function AddActions(props) {
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
  const [
    ConfirmationDialogContextText,
    setConfirmationDialogContextText,
  ] = useState("");
  const [
    ConfirmationModalActionType,
    setConfirmationModalActionType,
  ] = useState("");
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
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

  const columns = [
    {
      name: "uniqueActivityId",
      label: "Id",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      name: "friendlyName",
      label: "Friendly Name",
      options: {
        print: false,
        filter: false,
      },
    },
    {
      label: "Action",
      name: "",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return (
              <div className={`action-buttons-container`}>
                <Tooltip title="Configure">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<AddIcon />}
                    className={`edit-icon`}
                    onClick={() => configureOption(thisRowData)}
                  ></Button>
                </Tooltip>

                <Tooltip title="Delete">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<DeleteIcon />}
                    className={`delete-icon`}
                    onClick={() =>
                      handleClickOpenConfirmationModal(thisRowData)
                    }
                  ></Button>
                </Tooltip>
              </div>
            );
          }
        },

        setCellProps: (value) => {
          return {
            style: { width: "250px", minWidth: "250px", textAlign: "center" },
          };
        },
      },
    },
  ];

  const options = {
    filter: false,
    filterType: "dropdown",
    responsive: "scroll",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: 5,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: "There are no actions",
      },
    },
  };

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
        <MUIDataTable
          title={""}
          data={
            allActivityOptions && allActivityOptions.length > 0
              ? allActivityOptions
              : []
          }
          columns={columns}
          options={options}
          className="global-table"
        />
      )}
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
        setReloadPage={setReloadPage}
      />
    </div>
  );
}

export default withRouter(AddActions);
