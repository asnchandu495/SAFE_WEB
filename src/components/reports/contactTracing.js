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
import UserGroupService from "../../services/userGroupService";
import ConfirmationDialog from "../common/confirmdialogbox";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ToasterMessageComponent from "../common/toaster";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import SiteService from "../../services/siteService";
import UserService from "../../services/usersService";
import CovidStateApiServices from "../../services/masterDataService";
import ReportService from "../../services/reportService";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import moment from "moment";
import propTypes from "prop-types";
import { connect } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import NotificationImportantIcon from "@material-ui/icons/NotificationImportant";
import ChangeStatusIcon from "@material-ui/icons/SyncAlt";
import DateFnsUtils from "@date-io/date-fns";
import ReplayIcon from "@material-ui/icons/Replay";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  DateTimePicker,
} from "@material-ui/pickers";
import * as GridAction from "../../Redux/Action/gridAction";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MuiTablePagination from "@material-ui/core/TablePagination";
import TooltipComponent from "../common/tooltip";

const theme1 = createMuiTheme({
  overrides: {
    MUIDataTable: {
      responsiveScroll: {
        overflowX: "none",
        height: "auto",
        maxHeight: "calc(100vh - 290px) !important",
      },
    },
  },
});

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

function ContactTracing(props) {
  const UserGroup = new UserGroupService();
  const siteApiCall = new SiteService();
  const userApiCall = new UserService();
  const reportApiCall = new ReportService();
  const mastersApiCall = new CovidStateApiServices();

  const [userGroupList, setuserGroupList] = useState();
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
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const [selectedSiteData, setselectedSiteData] = useState();
  const [selectedLocationData, setselectedLocationData] = useState();
  const [searchForm, setSearchForm] = useState({
    userId: null,
    startDate: moment().toISOString(),
    endDate: moment().toISOString(),
  });
  const [resetForm, setResetForm] = useState({
    userId: null,
    startDate: moment().toISOString(),
    endDate: moment().toISOString(),
  });
  const [selectedValue, setSelectedValue] = React.useState("a");
  const [contactTracingData, setContactTracingData] = useState([]);
  const [applicationUsers, setApplicationUsers] = useState([]);
  const [RowsSelected, setRowsSelected] = useState([]);
  const [selectedUsersForCovidState, setSelectedUsersForCovidState] = useState(
    []
  );
  const [modalChangeValue, setmodalChangeValue] = useState();
  const [ChangeModalOpen, setChangeModalOpen] = useState(false);
  const [BulkModalOpen, setBulkModalOpen] = useState(false);
  const [BusinessCovidStateData, setBusinessCovidStateData] = useState();
  const [covidStatelist, setcovidStatelist] = useState();
  const [selectedReportType, setSelectedReportType] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);
  const [searchFormOld, setSearchFormOld] = useState();
  const [selectedReportTypeDataOld, setselectedReportTypeDataOld] =
    useState("");
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const [rowClickCovidState, setRowClickCovidState] = useState();

  useEffect(() => {
    setComponentLoadder(true);
    Promise.all([userApiCall.getProfileDetails(), props.LoadGridsPage()])

      .then(([loggedinUserDetails, gridResult]) => {
        Promise.all([
          userApiCall.ListApplicationUsers(loggedinUserDetails.id),
          mastersApiCall.getCOVIDStates(),
        ])
          .then(([getUsers, getCovidStates]) => {
            setApplicationUsers(getUsers);
            setBusinessCovidStateData(getCovidStates);
            let reportFilters = sessionStorage.getItem("contactTracing");
            if (reportFilters) {
              submitFiltersFromSession();
            }
            setComponentLoadder(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const columns = [
    {
      label: "Name",
      name: "name",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "User ID",
      name: "userId",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "userBaseAccountId",
      label: "# Of Instances",
      options: {
        display: "excluded",
        filter: false,
        sort: true,
      },
    },
    {
      label: "Actions",
      name: "",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return (
              <div className={`action-buttons-container`}>
                <Tooltip title="Change Covid State">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<ChangeStatusIcon />}
                    className={["edit-icon"].join(" ")}
                    onClick={() => handleClickOpenBulkModal(thisRowData)}
                  ></Button>
                </Tooltip>
                <Tooltip title="Alert">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<NotificationImportantIcon />}
                    className={["delete-icon"].join(" ")}
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

  const tableInitiate = () => {
    let thisPage = props.GridData.find((g) => {
      console.log(thisPage);
      return g.name == "report";
    });

    if (thisPage) {
      setCurrentPage(thisPage.page - 1);
    } else {
      return 0;
    }
  };

  const options = {
    filter: false,
    onFilterChange: (changedColumn, filterList) => {},
    selectableRows: false,
    filterType: "dropdown",
    responsive: "scrollMaxHeight",
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsSelected: RowsSelected,
    rowsPerPage: currentRowsPerPage,
    onChangeRowsPerPage: handleRowsPerPageChange,
    jumpToPage: true,
    textLabels: {
      body: {
        noMatch: `${
          isFilterSelected
            ? "There are no reports"
            : "Please select filters to generate report"
        }`,
      },
      pagination: {
        jumpToPage: "Go to page:",
      },
    },
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: "multiple",
    disableToolbarSelect: true,
    onRowSelectionChange: (currentRowSelected, allRowsSelected) => {
      var setRowsSelectedArray = [];
      allRowsSelected.map((user, i) => {
        setRowsSelectedArray.push(user.dataIndex);
      });

      setRowsSelected(setRowsSelectedArray);
      var selectedUsersToCovidStateArray = [];
      allRowsSelected.map((user, i) => {
        selectedUsersToCovidStateArray.push(user.dataIndex);
      });
      let finalUsers = [];
      selectedUsersToCovidStateArray.map((user) => {
        finalUsers.push({ id: contactTracingData[user].userBaseAccountId });
      });

      setSelectedUsersForCovidState(finalUsers);
    },
    customSearch: (searchQuery, currentRow, columns) => {
      let isFound = false;
      currentRow.forEach((col) => {
        if (typeof col !== "undefined" && col !== null) {
          if (typeof col === "object") {
            if (col.name) {
              if (col.name.toString().indexOf(searchQuery) >= 0) {
                isFound = true;
              }
            }
            if (col.stateName) {
              if (col.stateName.toString().indexOf(searchQuery) >= 0) {
                isFound = true;
              }
            }
          } else {
            if (col.toString().indexOf(searchQuery) >= 0) {
              isFound = true;
            }
          }
        }
      });

      return isFound;
    },
    page: currentPage,
    onChangePage: (currentPage) => {
      setCurrentPage(currentPage);
      let sendData = { name: "report", page: currentPage + 1 };
      props.UpdateGridsPage(sendData);
    },
    onTableInit: tableInitiate,
    customToolbarSelect: (value, tableMeta, updateValue) => {},
    customToolbar: () => {
      return (
        <div className={`maingrid-actions action-buttons-container`}>
          <Tooltip title="Filter ">
            <Button
              variant="contained"
              startIcon={<FilterListIcon />}
              className={`add-icon`}
              onClick={handleClickOpenModal}
            ></Button>
          </Tooltip>
          {RowsSelected.length ? (
            <>
              <Tooltip title="Alert">
                <Button
                  variant="contained"
                  color="default"
                  startIcon={<NotificationImportantIcon />}
                  className={["delete-icon"].join(" ")}
                  onClick={() =>
                    handleClickOpenConfirmationModal(selectedUsersForCovidState)
                  }
                ></Button>
              </Tooltip>
              <Tooltip title="Change Covid State">
                <Button
                  variant="contained"
                  startIcon={<ChangeStatusIcon />}
                  className={`edit-icon`}
                  onClick={() => handleClickOpenBulkModal()}
                ></Button>
              </Tooltip>
            </>
          ) : (
            ""
          )}
        </div>
      );
    },
  };
  const CustomFooter = (props) => {
    return (
      <div className="custom-pagination-report">
        <MuiTablePagination
          component="div"
          count={props.count}
          rowsPerPage={props.rowsPerPage}
          page={props.page}
          rowsPerPageOptions={[5, 10, 20, 100]}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowChange}
        />
      </div>
    );
  };

  const handlePageChange = (_, page) => {
    console.log(page);
    setCurrentPage(page);
  };
  function handleRowsPerPageChange(rowsPerPage) {
    setCurrentRowsPerPage(rowsPerPage);
  }
  const handleRowChange = (e) => {
    console.log(e.target.value);
    setCurrentRowsPerPage(e.target.value);
  };

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  const handleClickOpenModal = () => {
    if (searchFormOld) {
      setSearchForm((searchForm) => ({
        ...searchForm,
        ["userId"]: searchFormOld.userId,
        ["startDate"]: searchFormOld.startDate,
        ["endDate"]: searchFormOld.endDate,
      }));
    }
    setSelectedReportType(selectedReportTypeDataOld);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleChangeSearchForm = (getSelectedVal, name) => {
    if (name == "userId") {
      setSearchForm((searchForm) => ({
        ...searchForm,
        [name]: getSelectedVal,
      }));
    } else {
      let thisValue = moment(getSelectedVal).toISOString();
      setSearchForm((searchForm) => ({
        ...searchForm,
        [name]: thisValue,
      }));
    }
  };
  function resetFilterForm() {
    setselectedSiteData();
    setselectedLocationData([]);
    setSelectedReportType("");
    setSearchForm(resetForm);
  }

  function submitFiltersFromSession() {
    let reportFilters = sessionStorage.getItem("contactTracing");
    let selectedReportFilter = JSON.parse(reportFilters);

    setSearchFormOld((searchFormOld) => ({
      ...searchFormOld,
      ["userId"]: selectedReportFilter.userId,
      ["startDate"]: selectedReportFilter.startDate,
      ["endDate"]: selectedReportFilter.endDate,
    }));

    setSearchForm((searchForm) => ({
      ...searchForm,
      ["userId"]: selectedReportFilter.userId,
      ["startDate"]: selectedReportFilter.startDate,
      ["endDate"]: selectedReportFilter.endDate,
    }));

    let searchForm = {
      startDate: selectedReportFilter.startDate,
      endDate: selectedReportFilter.endDate,
      userId: selectedReportFilter.userId,
    };

    if (selectedReportType == "rlap") {
      reportApiCall
        .getContactTracingRlapReport(searchForm)
        .then((result) => {
          setIsFilterSelected(true);
          setContactTracingData(result);
          setTimeout(() => {
            setModalOpen(false);
            setshowLoadder(false);
          }, 3000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      reportApiCall
        .getContactTracingBleReport(searchForm)
        .then((result) => {
          setIsFilterSelected(true);
          setContactTracingData(result);
          setTimeout(() => {
            setModalOpen(false);
            setshowLoadder(false);
          }, 3000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    }
  }

  function submitForm(e) {
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    setSearchFormOld(searchForm);
    setselectedReportTypeDataOld(selectedReportType);
    let storeFilters = {
      userId: searchForm.userId,
      startDate: searchForm.startDate,
      endDate: searchForm.endDate,
    };
    sessionStorage.setItem("contactTracing", JSON.stringify(storeFilters));
    setshowLoadder(true);

    if (selectedReportType == "rlap") {
      reportApiCall
        .getContactTracingRlapReport(searchForm)
        .then((result) => {
          setIsFilterSelected(true);
          setContactTracingData(result);
          setTimeout(() => {
            setModalOpen(false);
            setshowLoadder(false);
          }, 3000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      reportApiCall
        .getContactTracingBleReport(searchForm)
        .then((result) => {
          setIsFilterSelected(true);
          setContactTracingData(result);
          setTimeout(() => {
            setModalOpen(false);
            setshowLoadder(false);
          }, 3000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    }
  }

  const filterOptions = createFilterOptions({
    stringify: ({ firstName, lastName, userId }) =>
      `${firstName} ${lastName} ${userId}`,
  });

  const handleClickOpenConfirmationModal = (value) => {
    let selecteduserDtails = applicationUsers.find(
      (usr) => usr.id == searchForm.userId.id
    );
    // selectedUsersForCovidState
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("alertreport");
    setConfirmationHeaderTittle("Alert");
    setConfirmationDialogContextText(
      `Alert! ${selecteduserDtails.firstName} ${selecteduserDtails.lastName} has been reported as ${selecteduserDtails.covidStateDetails.stateName}. As a precautionary step, please WFH for next 2 week. Contact your supervisor for more information.`
    );
  };

  const handleChangeState = (row) => {
    setmodalChangeValue(row[0]);
    setChangeModalOpen(true);
  };

  const handleClickOpenBulkModal = (thisRowData) => {
    if (thisRowData) {
      setRowClickCovidState({ id: thisRowData[2] });
      let selecteduserDtails = applicationUsers.find(
        (usr) => usr.id == thisRowData[2]
      );
      setcovidStatelist(selecteduserDtails.covidStateDetails);
    }
    setBulkModalOpen(true);
  };

  const handleClickCloseBulkModal = () => {
    setBulkModalOpen(false);
  };

  function covidStateSelect(e, value) {
    setcovidStatelist(value);
  }

  const handleChangeReport = (e) => {
    setSelectedReportType(e.target.value);
  };

  function submitUserCovidInformation() {
    setshowLoadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    if (covidStatelist) {
      if (rowClickCovidState) {
        let sendData = {
          id: rowClickCovidState.id,
          covidStateId: covidStatelist.id,
        };

        userApiCall
          .UpdateUserCovidState(sendData)
          .then((result) => {
            setStateSnackbar(true);
            setToasterMessage("Covid state updated");
            settoasterServerity("success");
            setTimeout(() => {
              setRowClickCovidState();
              setBulkModalOpen(false);
              setSelectedUsersForCovidState([]);
              setRowsSelected([]);
              setshowLoadder(false);
            }, 6000);
          })
          .catch((err) => {
            setToasterMessage(err.data.errors);
            settoasterServerity("error");
            setStateSnackbar(true);
            setshowLoadder(false);
          });
      } else {
        let updateCOVIDStatusbyUsersList = [];
        selectedUsersForCovidState.map((user) => {
          updateCOVIDStatusbyUsersList.push({
            id: user.id,
            covidStateId: covidStatelist.id,
          });
        });

        let sendData = {
          updateCOVIDStatusbyUsersList: updateCOVIDStatusbyUsersList,
        };

        userApiCall
          .UpdateUserCovidStateBulk(sendData)
          .then((result) => {
            setStateSnackbar(true);
            setToasterMessage("Covid state update to the selected users");
            settoasterServerity("success");
            setTimeout(() => {
              setBulkModalOpen(false);
              setSelectedUsersForCovidState([]);
              setRowsSelected([]);
              setshowLoadder(false);
            }, 6000);
          })
          .catch((err) => {
            setToasterMessage(err.data.errors);
            settoasterServerity("error");
            setStateSnackbar(true);
            setshowLoadder(false);
          });
      }
    }
  }
  return (
    <div className="innerpage-container">
      <Dialog
        onClose={handleClickCloseBulkModal}
        aria-labelledby="customized-dialog-title"
        className="global-dialog confirmation-dialog global-form bulk-covidstate-update-reports"
        aria-labelledby="form-dialog-title"
        open={BulkModalOpen}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleClickCloseBulkModal}
        >
          Change covid state of users
        </DialogTitle>
        <ValidatorForm
          className={`global-form`}
          onSubmit={submitUserCovidInformation}
        >
          <DialogContent dividers>
            {!componentLoadder ? (
              <Grid container spacing={3}>
                <Grid item xs={12} container>
                  <Grid item xs={3}>
                    <label className="">Covid State</label>
                  </Grid>
                  <Grid item xs={9}>
                    <Autocomplete
                      id="tags-outlined"
                      options={
                        BusinessCovidStateData &&
                        BusinessCovidStateData.length > 0
                          ? BusinessCovidStateData
                          : []
                      }
                      getOptionLabel={(option) => option.stateName}
                      onChange={covidStateSelect}
                      defaultValue={covidStatelist}
                      name="covidState"
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select  covid state"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              className="global-submit-btn"
              disabled={showLoadder}
            >
              {showLoadder ? <ButtonLoadderComponent /> : "Update"}
            </Button>
            <Button
              onClick={handleClickCloseBulkModal}
              className="global-cancel-btn"
            >
              Cancel
            </Button>
          </DialogActions>
        </ValidatorForm>{" "}
      </Dialog>

      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        className="global-dialog confirmation-dialog global-form"
        aria-labelledby="form-dialog-title"
        open={Modalopen}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Filter
        </DialogTitle>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <ValidatorForm className={`global-form`} onSubmit={submitForm}>
            <DialogContent dividers>
              {!componentLoadder ? (
                <Grid container spacing={3}>
                  <Grid item cs={12} container>
                    <Grid item xs={4}>
                      <label className="required">Data Source</label>
                    </Grid>
                    <Grid item xs={8}>
                      <RadioGroup
                        row
                        aria-label="gender"
                        name="report_type"
                        value={selectedReportType}
                        onChange={handleChangeReport}
                      >
                        <FormControlLabel
                          value="rlap"
                          control={<Radio required />}
                          label="RLAP"
                        />
                        <FormControlLabel
                          value="ble"
                          control={<Radio required />}
                          label="BLE"
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                  <Grid item cs={12} container>
                    <Grid item xs={4}>
                      <label className="required">User</label>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl variant="outlined" fullWidth>
                        <Autocomplete
                          name="userId"
                          id="tags-outlined"
                          options={
                            applicationUsers && applicationUsers.length > 0
                              ? applicationUsers
                              : []
                          }
                          getOptionLabel={({ firstName, lastName }) => {
                            return `${firstName} ${lastName}`;
                          }}
                          defaultValue={searchForm.userId}
                          value={searchForm.userId ? searchForm.userId : null}
                          onChange={(e, v) =>
                            handleChangeSearchForm(v, "userId")
                          }
                          filterSelectedOptions
                          className="global-input autocomplete-select"
                          filterOptions={filterOptions}
                          renderOption={({ firstName, lastName, userId }) => {
                            return (
                              <div>
                                <div>
                                  {`${firstName} `}
                                  {lastName}
                                </div>
                                <span>{userId}</span>
                              </div>
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              variant="outlined"
                              placeholder="Select User by UserId or UserName"
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} container>
                    <Grid item xs={4}>
                      <label className="required">From</label>
                      <TooltipComponent
                        isMarginBottom={true}
                        tooltipMessage={`This report is available for a maximum period of 6 months .`}
                      ></TooltipComponent>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      className="date-time-pickers report-pickers"
                    >
                      <DateTimePicker
                        fullWidth
                        name="startDate"
                        id=""
                        format="dd/MM/yyyy hh:mm a"
                        disableFuture={true}
                        value={searchForm.startDate}
                        className="global-input"
                        minDate={moment(searchForm.startDate).subtract(
                          6,
                          "months"
                        )}
                        onChange={(date, event, e) =>
                          handleChangeSearchForm(date, "startDate")
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        required
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} container>
                    <Grid item xs={4}>
                      <label className="required">To</label>

                      <TooltipComponent
                        isMarginBottom={true}
                        tooltipMessage={`This report is available for a maximum period of 6 months .`}
                      ></TooltipComponent>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      className="date-time-pickers report-pickers"
                    >
                      <DateTimePicker
                        fullWidth
                        name="endDate"
                        id=""
                        format="dd/MM/yyyy hh:mm a"
                        disableFuture={true}
                        maxDate={moment(searchForm.startDate).add(1, "months")}
                        minDate={moment(searchForm.startDate)}
                        value={searchForm.endDate}
                        className="global-input"
                        onChange={(date, event, e) =>
                          handleChangeSearchForm(date, "endDate")
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        required
                        minDateMessage="To date must be greater than FROM date"
                        maxDateMessage="Select max 1 month duration"
                      />
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
                {showLoadder ? <ButtonLoadderComponent /> : "Generate"}
              </Button>
              <Button onClick={handleClose} className="global-cancel-btn">
                Cancel
              </Button>
            </DialogActions>
          </ValidatorForm>{" "}
        </MuiPickersUtilsProvider>
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
        <LinkTo color="textPrimary" href="#" to="#" className="inactive">
          Reports
        </LinkTo>
        <LinkTo color="textPrimary" href="#" to="#" className="inactive">
          Contact Trace History
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder ? (
        <ComponentLoadderComponent />
      ) : (
        <MuiThemeProvider theme={theme1}>
          {" "}
          <MUIDataTable
            title={""}
            data={contactTracingData}
            columns={columns}
            options={options}
            className="global-table reports-table"
          />{" "}
        </MuiThemeProvider>
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
        selectedUsersForCovidState={selectedUsersForCovidState}
        searchUserId={searchForm.userId ? searchForm.userId.id : ""}
        setSelectedUsersForCovidState={setSelectedUsersForCovidState}
        setRowsSelected={setRowsSelected}
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

// export default ContactTracing;
function mapStateToProps(state, ownProps) {
  return {
    GridData: state.gridHistory,
  };
}

const mapDispatchToProps = {
  LoadGridsPage: GridAction.getGridsPages,
  UpdateGridsPage: GridAction.updateGridsPages,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactTracing);
