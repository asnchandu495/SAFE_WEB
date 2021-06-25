import React, { Fragment, useEffect, useState, useRef } from "react";
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
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import FilterListIcon from "@material-ui/icons/FilterList";
import UserGroupService from "../../services/userGroupService";
import ConfirmationDialog from "../common/confirmdialogbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ToasterMessageComponent from "../common/toaster";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import propTypes from "prop-types";
import { connect } from "react-redux";
import * as worlflowAction from "../../Redux/Action/workflowAction";
import workflowService from "../../services/workflowService";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import * as GridAction from "../../Redux/Action/gridAction";
import ReplayIcon from "@material-ui/icons/Replay";
import covidState from "../covidState";

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

function Workflow(props) {
  const anchorRef = useRef(null);
  const UserGroup = new UserGroupService();
  const workflowApiCall = new workflowService();
  const [userGroupList, setuserGroupList] = useState();
  const [componentLoadder, setComponentLoadder] = useState(true);
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
  const [selectedUserData, setselectedUserData] = useState();
  const [selectedStatusData, setselectedStatusData] = useState();
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchformData, setsearchformData] = useState({
    UserGroupId: "",
    IsActive: "",
  });
  const [resetformData, SetresetformData] = useState({
    IsActive: "",
  });

  const userStatusData = [
    { id: true, name: "Active" },
    { id: false, name: "Inactive" },
  ];
  const columns = [
    {
      name: "id",
      label: "Id",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      label: "Workflow Name ",
      name: "name",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "User Group",
      name: "groupName",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return <span>{thisRowData[2]}</span>;
          }
        },
      },
    },
    {
      label: "Status",
      name: "isActive",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return <span>{thisRowData[3] ? "Active" : "Inactive"}</span>;
          }
        },
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
          let worflowACM = props.acmData.find((acm) => {
            return acm.module == "workflow";
          });

          if (thisRowData) {
            return (
              <div className={`action-buttons-container`}>
                <LoadActions
                  thisRowData={thisRowData}
                  modulePermission={worflowACM.permissions}
                  anchorRef={anchorRef}
                ></LoadActions>

                <Tooltip title={thisRowData[3] ? "Deactivate" : "Activate"}>
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={thisRowData[3] ? <ClearIcon /> : <CheckIcon />}
                    className={thisRowData[3] ? "delete-icon" : "view-icon"}
                    onClick={() => handlePublishModal(thisRowData)}
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

  const LoadActions = (props) => {
    return props.modulePermission.map((entity) => {
      switch (entity.entity) {
        case "view":
          return entity.isAccess ? (
            <Tooltip title="View">
              <Button
                variant="contained"
                color="default"
                startIcon={<VisibilityIcon />}
                className={`view-icon`}
                onClick={() => handleClickViewWorkflow(props.thisRowData)}
              ></Button>
            </Tooltip>
          ) : (
            ""
          );
          break;
        case "update":
          return entity.isAccess ? (
            <>
              <Tooltip title="Edit">
                <Button
                  variant="contained"
                  color="default"
                  disabled={props.thisRowData[3]}
                  startIcon={<EditIcon />}
                  className={`edit-icon`}
                  onClick={() => handleClickUpdateWorkflow(props.thisRowData)}
                ></Button>
              </Tooltip>
            </>
          ) : (
            ""
          );
          break;

        case "delete":
          return entity.isAccess ? (
            <Tooltip title="Delete">
              <Button
                variant="contained"
                color="default"
                disabled={props.thisRowData[3]}
                startIcon={<DeleteIcon />}
                className={`delete-icon`}
                onClick={() =>
                  handleClickOpenConfirmationModal(props.thisRowData)
                }
              ></Button>
            </Tooltip>
          ) : (
            ""
          );
          break;
        case "activityList":
          return entity.isAccess ? (
            <Tooltip title="Assign Activity">
              <Button
                variant="contained"
                color="default"
                disabled={props.thisRowData[3]}
                startIcon={<AddIcon />}
                className={`edit-icon`}
                onClick={() => handleViewActivity(props.thisRowData)}
              ></Button>
            </Tooltip>
          ) : (
            ""
          );
          break;
        case props.thisRowData[3] ? "Deactivate" : "Activate":
          return entity.isAccess ? (
            <Tooltip title={props.thisRowData[3] ? "Deactivate" : "Activate"}>
              <Button
                variant="contained"
                color="default"
                startIcon={props.thisRowData[3] ? <ClearIcon /> : <CheckIcon />}
                className={props.thisRowData[3] ? "delete-icon" : "view-icon"}
                onClick={() => handlePublishModal(props.thisRowData)}
              ></Button>
            </Tooltip>
          ) : (
            ""
          );
          break;

        default:
          return "";
      }
    });
  };

  function handleRowsPerPageChange(rowsPerPage) {
    setCurrentRowsPerPage(rowsPerPage);
  }

  const tableInitiate = () => {
    let thisPage = props.GridData.find((g) => {
      return g.name == "questionnaire";
    });

    if (thisPage) {
      setCurrentPage(thisPage.page - 1);
    } else {
      return 0;
    }
  };

  const options = {
    filter: false,
    filterType: "dropdown",
    responsive: "scroll",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: currentRowsPerPage,
    onChangeRowsPerPage: handleRowsPerPageChange,
    jumpToPage: true,
    page: currentPage,
    onChangePage: (currentPage) => {
      setCurrentPage(currentPage);
      let sendData = { name: "questionnaire", page: currentPage + 1 };
      props.UpdateGridsPage(sendData);
    },
    onTableInit: tableInitiate,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: "No matching records found",
      },
      pagination: {
        jumpToPage: "Go to page:",
      },
    },
    customSearch: (searchQuery, currentRow, columns) => {
      let isFound = false;
      currentRow.forEach((col) => {
        if (typeof col != "undefined") {
          let getValue;
          if (typeof col == "boolean") {
            if (col) {
              getValue = "Active";
            } else {
              getValue = "Inactive";
            }
          } else {
            getValue = col;
          }
          if (getValue.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0) {
            isFound = true;
          }
        }
      });
      return isFound;
    },
    customToolbarSelect: (value, tableMeta, updateValue) => {},
    customToolbar: () => {
      return (
        <div className={`maingrid-actions`}>
          <Tooltip title="Advanced Search">
            <Button
              variant="contained"
              startIcon={<FilterListIcon />}
              className={`add-icon`}
              onClick={handleClickOpenModal}
            ></Button>
          </Tooltip>
        </div>
      );
    },
  };

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  const handleClickOpenModal = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  function handleViewActivity(value) {
    var workflowId = value[0];
    props.history.push(`/workflow/${workflowId}/activities`);
  }

  function handleClickUpdateWorkflow(value) {
    var workflowId = value[0];
    props.history.push("/workflow/create-workflow/" + workflowId);
  }
  function handleClickViewWorkflow(value) {
    var workflowId = value[0];
    props.history.push("/workflow/view-workflow/" + workflowId);
  }

  function selectedUser(e, value) {
    setselectedUserData(value);
  }

  function selectedStatus(e, value) {
    setselectedStatusData(value);
  }

  function resetFilterForm() {
    setselectedUserData();
    setsearchformData(resetformData);
  }
  // function resetFilterForm() {
  //   setsearchformData({
  //     UserGroupId: "",
  //     IsActive: "",
  //   });
  //   setComponentLoadder(true);
  //   setselectedUserData();
  //   props.LoadData().then((result) => {
  //     setshowLoadder(false);
  //     setModalOpen(false);
  //     setComponentLoadder(false);
  //   });
  //   handleClose();
  // }

  function handleChange(e) {
    const { name, value } = e.target;
    setsearchformData((logInForm) => ({
      ...logInForm,
      [name]: value,
    }));
  }

  // function AssignFiltersForm() {
  //   console.log(searchformData);
  //   if (searchformData) {
  //     submitAssignWorkflow();
  //   } else {
  //     submitAssignWorkflow(false);
  //     return false;
  //   }
  // }

  function AssignFiltersForm() {
    var workflowData = searchformData;
    if (selectedUserData) {
      workflowData.UserGroupId = selectedUserData.id;
    }

    setshowLoadder(true);
    props
      .LoadData(workflowData)
      .then((result) => {
        setshowLoadder(false);
        setModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
        setshowLoadder(false);
      });
  }

  const handleClickOpenConfirmationModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteWorflow");
    setConfirmationHeaderTittle("Delete Worflow");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${value[1]} ?`
    );
  };

  const handlePublishModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("PublishWorkflow");
    setConfirmationHeaderTittle(value[3] ? "Deactivate" : "Activate");

    setConfirmationDialogContextText(
      value[3]
        ? `Are you sure you want to deactivate workflow-${value[1]} `
        : `Are you sure you want to activate workflow-${value[1]}`
    );
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
  useEffect(() => {
    Promise.all([props.LoadData(), UserGroup.loadUserGroup()])

      .then(([getAllWorkflows, getUsergrouplist]) => {
        // setWorkflowData(getAllWorkflows);
        setuserGroupList(getUsergrouplist);
        setComponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="innerpage-container">
      <Dialog
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        open={Modalopen}
      >
        <DialogTitle id="form-dialog-title" onClose={handleClose}>
          Advanced Search
        </DialogTitle>
        <ValidatorForm className={`global-form`} onSubmit={AssignFiltersForm}>
          <DialogContent dividers>
            {!componentLoadder ? (
              <Grid container spacing={3}>
                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="">User Group </label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <Autocomplete
                        id="tags-outlined"
                        options={
                          userGroupList && userGroupList.length > 0
                            ? userGroupList
                            : []
                        }
                        getOptionLabel={(option) => option.groupName}
                        defaultValue={selectedUserData}
                        value={selectedUserData ? selectedUserData : ""}
                        onChange={selectedUser}
                        name="UserGroupId"
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select usergroup"
                          />
                        )}
                      />
                    </FormControl>{" "}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label className="">Status</label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        id="demo-simple-select-outlined-label"
                        shrink={false}
                        className="select-label"
                      >
                        {searchformData.IsActive === "" ? "Select status" : ""}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        name="IsActive"
                        value={searchformData.IsActive}
                        onChange={handleChange}
                        className="global-input single-select"
                      >
                        <MenuItem value="">None</MenuItem>
                        {userStatusData.length > 0
                          ? userStatusData.map((UserStatus) => {
                              return (
                                <MenuItem value={UserStatus.id}>
                                  {UserStatus.name}
                                </MenuItem>
                              );
                            })
                          : ""}
                      </Select>
                    </FormControl>
                    {""}
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={resetFilterForm}
              className="global-filter-reset-btn"
            >
              <ReplayIcon></ReplayIcon>
            </Button>
            <Button
              variant="contained"
              type="submit"
              className="global-submit-btn"
              disabled={showLoadder}
            >
              {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
            </Button>
            <Button onClick={handleClose} className="global-cancel-btn">
              Cancel
            </Button>
          </DialogActions>{" "}
        </ValidatorForm>
      </Dialog>

      <Breadcrumbs aria-label="breadcrumb" className="global-breadcrumb">
        <LinkTo
          color="inherit"
          href="#"
          to={`/home/dashboard`}
          className="inactive"
        >
          Home
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Workflows
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder ? (
        <ComponentLoadderComponent />
      ) : (
        <MUIDataTable
          title={""}
          data={
            props.WorkflowData && props.WorkflowData.length > 0
              ? props.WorkflowData
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
      />
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

Workflow.propTypes = {
  WorkflowData: propTypes.array.isRequired,
  LoadData: propTypes.func.isRequired,
  getGridsPages: propTypes.func.isRequired,
  gridState: propTypes.array.isRequired,
  updateGridsPages: propTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    WorkflowData: state.workflowState,
    GridData: state.gridHistory,
    acmData: state.acmData,
  };
}

const mapDispatchToProps = {
  LoadData: worlflowAction.loadWorkflow,
  LoadGridsPage: GridAction.getGridsPages,
  UpdateGridsPage: GridAction.updateGridsPages,
};

export default connect(mapStateToProps, mapDispatchToProps)(Workflow);
