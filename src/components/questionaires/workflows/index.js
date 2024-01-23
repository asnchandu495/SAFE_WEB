import React, { Fragment, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import BackupIcon from "@material-ui/icons/Backup";
import AddBoxIcon from "@material-ui/icons/AddBox";
import AddIcon from "@material-ui/icons/Add";
import FilterListIcon from "@material-ui/icons/FilterList";
import { withStyles } from "@material-ui/core/styles";
import moment from "moment";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import Dialog from "@material-ui/core/Dialog";

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import ComponentLoadderComponent from "../../common/loadder/componentloadder";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import InputAdornment from "@material-ui/core/InputAdornment";
import ReplayIcon from "@material-ui/icons/Replay";

import propTypes from "prop-types";
import { connect } from "react-redux";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  DateTimePicker,
} from "@material-ui/pickers";
import questionaireService from "../../../services/questionaireService";

function ViewWorkflows(props) {
  const questionaireApiCall = new questionaireService();
  const groupIdURL = props.match.params.id;

  const [Modalopen, setModalOpen] = useState(false);
  const [showLoadder, setshowLoadder] = useState(false);
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");

  const [allSites, setAllSites] = useState();
  const [TeamData, setTeamData] = useState();
  const [selectedUserDetails, setSelectedUserDetails] = useState();
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedSiteData, setselectedSiteData] = useState();
  const [selectedTeamData, setselectedTeamData] = useState();
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [workflowStateDetails, setWorkflowStateDetails] = useState([]);

  useEffect(() => {
    setComponentLoadder(true);
    Promise.all([questionaireApiCall.getGroupStates(groupIdURL)])
      .then(([grupStates]) => {
        setWorkflowStateDetails(grupStates);
        setComponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  //Method to redirect to view the workflow state {value-rowdata(entire row value to fetch the id)}
  function handleClickViewWorkflow(value) {
    var workflowId = value[0];
    props.history.push(
      `/questionaires/workflow-state/${groupIdURL}/${workflowId}`
    );
  }

  const columns = [
    {
      name: "id",
      label: "id",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      label: "Group",
      name: "userGroupName",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Workflow",
      name: "name",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "From State",
      name: "fromState",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "To State",
      name: "toState",
      options: {
        filter: false,
        sort: true,
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
          var isActive = thisRowData[5];
          if (thisRowData) {
            return (
              <div className={`action-buttons-container`}>
                <Tooltip title="View States">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<AccountTreeIcon />}
                    className={`edit-icon`}
                    onClick={() => handleClickViewWorkflow(thisRowData)}
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
        noMatch: "There are no workflow states",
      },
    },
    customToolbarSelect: (value, tableMeta, updateValue) => {},
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
          to={`/questionaires/allquestionaires`}
          className="inactive"
        >
          Questionnaire
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/questionaires/assign`}
          className="inactive"
        >
          Assign Questionnaire To User Group
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Workflow States
        </LinkTo>
      </Breadcrumbs>

      <MUIDataTable
        title={""}
        data={workflowStateDetails}
        columns={columns}
        options={options}
        className="global-table"
      />
    </div>
  );
}
export default ViewWorkflows;
