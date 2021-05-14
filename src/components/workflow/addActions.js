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

  useEffect(() => {
    setComponentLoadder(true);
    Promise.all([
      workflowApiCall.getAllMasterOptionsForActivity(uActivityId),
      workflowApiCall.GetWorkFlowById(workflowId),
    ])
      .then(([allMasterOptionsForActivity, getWorkflowDetails]) => {
        setWorkflowDetails(getWorkflowDetails);
        setAllActivityOptions(allMasterOptionsForActivity);
        setComponentLoadder(false);
        setReloadPage("NO");
      })
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
      name: "name",
      label: "Action Name ",
      options: {
        filter: false,
        sort: true,
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
        <LinkTo color="textPrimary" href="#" to="#" className="inactive">
          Activity name
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
    </div>
  );
}

export default withRouter(AddActions);
