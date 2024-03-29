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
import DateFnsUtils from "@date-io/date-fns";
import ReplayIcon from "@material-ui/icons/Replay";
import * as GridAction from "../../Redux/Action/gridAction";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MuiTablePagination from "@material-ui/core/TablePagination";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  DateTimePicker,
} from "@material-ui/pickers";
import * as globalSettingAction from "../../Redux/Action/globalSettingAction";
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

function SocailDistancing(props) {
  const UserGroup = new UserGroupService();
  const siteApiCall = new SiteService();
  const userApiCall = new UserService();
  const reportApiCall = new ReportService();

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
    SiteId: "",
    LocationId: [],
    selectedReportType: ""
  });
  const [resetForm, setResetForm] = useState({
    userId: null,
    startDate: moment().toISOString(),
    endDate: moment().toISOString(),
    SiteId: "",
    LocationId: [],
    selectedReportType: ""
  });

  const [selectedValue, setSelectedValue] = React.useState("a");
  const [socialDistancingData, setSocialDistancingData] = useState([]);
  const [applicationUsers, setApplicationUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);
  const [searchFormOld, setSearchFormOld] = useState();
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationBySiteId, setlocationBySiteId] = useState();
  const [selectedReportType, setSelectedReportType] = useState("");
  const [selectedReportTypeDataOld, setselectedReportTypeDataOld] =
    useState("");
  const [selectedSiteDataOld, setselectedSiteDataOld] = useState();
  const [selectedLocationDataOld, setselectedLocationDataOld] = useState([]);
  const [isFilterSelected, setIsFilterSelected] = useState(false);

  useEffect(() => {
    setComponentLoadder(true);

    Promise.all([
      userApiCall.getProfileDetails(),
      props.LoadGridsPage(),
      props.loadGlobalSettingWithoutAPICall(),
      siteApiCall.getListSiteSupervisor(),
    ])
      .then(([loggedinUserDetails, gridResult, result, getAllSites]) => {
        userApiCall
          .ListApplicationUsers(loggedinUserDetails.id)
          .then((getUsers) => {
            let allOption = {
              id: "all",
              firstName: "All Users",
              lastName: "",
              userId: "",
            };
            getUsers.unshift(allOption);
            setApplicationUsers(getUsers);
            setAllSites(getAllSites);
            let reportFilters = sessionStorage.getItem("socialDistancing");
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
      name: "userName",
      label: "User Name",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "User ID ",
      name: "applicationUserId",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Email ID",
      name: "emailId",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "userBreaches",
      label: "usersBreach",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      label: " # Of Instances ",
      name: "numberOfInstance",
      options: {
        filter: false,
        sort: false,
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
    onFilterChange: (changedColumn, filterList) => {
      console.log(changedColumn, filterList);
    },
    selectableRows: false,
    filterType: "dropdown",
    responsive: "scrollMaxHeight",
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: currentRowsPerPage,
    onChangeRowsPerPage: handleRowsPerPageChange,

    expandableRows: true,
    expandableRowsHeader: false,
    sortOrder: {
      name: 'userName',
      direction: 'asc'
    },
    renderExpandableRow: (rowData, rowMeta) => {
      const options = {
        filter: false,
        filterType: "dropdown",
        responsive: "scroll",
        fixedHeader: true,
        rowsPerPageOptions: [5, 10, 15, 100],
        rowsPerPage: 5,
        jumpToPage: true,
        page: 0,
        print: false,
        viewColumns: false,
        download: false,
        selectableRows: false,
        textLabels: {
          body: {
            noMatch: "There are no breaches",
          },
          pagination: {
            jumpToPage: "Go to page:",
          },
        },
        sortOrder: {
          name: 'createdDate',
          direction: 'asc'
        },
      };
      const columns = [
        {
          label: "Location",
          name: "location",
          options: {
            filter: false,
            sort: true,
          },
        },
        {
          name: "createdDate",
          label: "Timestamp",
          options: {
            print: false,
            filter: true,
            customBodyRender: (value, tableMeta, updateValue) => {
              var thisRowData = tableMeta.rowData;

              if (thisRowData && thisRowData[1] != null) {
                return (
                  <span>
                    {moment(thisRowData[1]).format(
                      props.loadGlobalSettingsData
                        ? props.loadGlobalSettingsData.dateFormat +
                        "  " +
                        props.loadGlobalSettingsData.timeFormat
                        : "hh:mm"
                    )}
                  </span>
                );
              } else {
                return <span></span>;
              }
            },
          },
        },
      ];
      return (
        <tr>
          <td colSpan={6}>
            <MUIDataTable
              title={""}
              data={rowData[3]}
              columns={columns}
              options={options}
              className="global-table no-action-table nested-table"
            />
          </td>
        </tr>
      );
    },
    jumpToPage: true,
    print: false,
    viewColumns: false,
    download: false,
    textLabels: {
      body: {
        noMatch: `${isFilterSelected
          ? "There are no reports"
          : "Please select filters to generate report"
          }`,
      },
      pagination: {
        jumpToPage: "Go to page:",
      },
    },
    customToolbarSelect: (value, tableMeta, updateValue) => { },
    customToolbar: () => {
      return (
        <div className={`maingrid-actions`}>
          <Tooltip title="Filter ">
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
    customSearch: (searchQuery, currentRow, columns) => {
      let isFound = false;
      currentRow.forEach((col) => {
        if (typeof col !== "undefined" && col !== null) {
          if (typeof col === "object") {
            if (col.name) {
              if (col.name.toString().toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0) {
                isFound = true;
              }
            }
            if (col.stateName) {
              if (col.stateName.toString().toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0) {
                isFound = true;
              }
            }
          } else {
            if (col.toString().toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0) {
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
    // onTableInit: tableInitiate,
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
//Method to open the popup modal
  const handleClickOpenModal = () => {
    if (searchFormOld) {
      setSearchForm((searchForm) => ({
        ...searchForm,
        ["userId"]: searchFormOld.userId,
        ["startDate"]: searchFormOld.startDate,
        ["endDate"]: searchFormOld.endDate,
      }));
    }
    setModalOpen(true);
  };
//method to close the popup modal
  const handleClose = () => {
    setModalOpen(false);
  };
//Method to bind the data with input feidls
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
//Method to reset the form
  function resetFilterForm() {
    setselectedSiteData();
    setselectedLocationData();
    setSelectedReportType("");
    setSearchForm(resetForm);
  }
//WHEN the page load inside the useffect after api call to calll the function
  function submitFiltersFromSession() {
    let reportFilters = sessionStorage.getItem("socialDistancing");
    let selectedReportFilter = JSON.parse(reportFilters);

    setSearchFormOld((searchFormOld) => ({
      ...searchFormOld,
      ["userId"]: selectedReportFilter.userId,
      ["startDate"]: selectedReportFilter.startDate,
      ["endDate"]: selectedReportFilter.endDate,
      ["selectedReportType"]: selectedReportFilter.selectedReportType
    }));

    setSearchForm((searchForm) => ({
      ...searchForm,
      ["userId"]: selectedReportFilter.userId,
      ["startDate"]: selectedReportFilter.startDate,
      ["endDate"]: selectedReportFilter.endDate,
      ["selectedReportType"]: selectedReportFilter.selectedReportType
    }));

    setselectedSiteDataOld(selectedReportFilter.selectedSiteData);
    setselectedLocationDataOld(selectedReportFilter.selectedLocationData);

    setselectedSiteData(selectedReportFilter.selectedSiteData);
    setselectedLocationData(selectedReportFilter.selectedLocationData);

    let searchForm = {
      startDate: selectedReportFilter.startDate,
      endDate: selectedReportFilter.endDate,
      userId: selectedReportFilter.userId,
    };

    setSelectedReportType(selectedReportFilter.selectedReportType);
    setselectedReportTypeDataOld(selectedReportFilter.selectedReportType);

    if (selectedReportFilter.selectedReportType == 'indoor') {
      if (selectedReportFilter.selectedSiteData) {
        searchForm.SiteId = selectedReportFilter.selectedSiteData.id;
      }

      if (selectedReportFilter.selectedLocationData.length > 0) {
        let locationArr = selectedReportFilter.selectedLocationData.map((item) => item.id);
        searchForm.LocationId = locationArr;
      } else {
        searchForm.LocationId = [];
      }

      Promise.all([reportApiCall.getSocialDistancingIndoorReport(searchForm), siteApiCall.getAllLocationsBySiteId(searchForm.SiteId)])
        .then(([result, siteLocations]) => {
          setIsFilterSelected(true);
          setSocialDistancingData(result);
          setlocationBySiteId(siteLocations);
          setTimeout(() => {
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
        .getSocialDistancingReport(searchForm)
        .then((result) => {
          setSocialDistancingData(result);
          setTimeout(() => {
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
//method on click of form submit
  function submitForm(e) {
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    setSearchFormOld(searchForm);
    let storeFilters = {
      userId: searchForm.userId,
      startDate: searchForm.startDate,
      endDate: searchForm.endDate,
      selectedSiteData: selectedSiteData,
      selectedLocationData: selectedLocationData,
      selectedReportType: selectedReportType
    };
    sessionStorage.setItem("socialDistancing", JSON.stringify(storeFilters));
    setshowLoadder(true);
    setIsFilterSelected(true);
    if (selectedReportType == 'indoor') {
      if (selectedSiteData) {
        searchForm.SiteId = selectedSiteData.id;
      }

      if (selectedLocationData.length > 0) {
        let locationArr = selectedLocationData.map((item) => item.id);
        searchForm.LocationId = locationArr;
      } else {
        searchForm.LocationId = [];
      }

      setselectedSiteDataOld(selectedSiteData);
      setselectedLocationDataOld(selectedLocationData);

      reportApiCall
        .getSocialDistancingIndoorReport(searchForm)
        .then((result) => {
          setSocialDistancingData(result);
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
        .getSocialDistancingReport(searchForm)
        .then((result) => {
          setSocialDistancingData(result);
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
//Method on change of dropdown site
  function selectedSite(e, value) {
    setlocationBySiteId([]);
    setselectedLocationData([]);
    setselectedSiteData(value);
    if (value) {
      setIsLocationLoading(true);
      let data = value.id;
      siteApiCall
        .getAllLocationsBySiteId(data)
        .then((getResult) => {
          setlocationBySiteId(getResult);
          setIsLocationLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
//Method on change of location dropdown change
  function selectedLocation(e, value) {
    setselectedLocationData(value);
  }
//Method on change of report type
  const handleChangeReport = (e) => {
    setSelectedReportType(e.target.value);
  };

  return (
    <div className="innerpage-container">
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
                          value="indoor"
                          control={<Radio required />}
                          label="Indoor"
                        />
                        <FormControlLabel
                          value="outdoor"
                          control={<Radio required />}
                          label="Outdoor"
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                  {selectedReportType == 'indoor' ? <>
                    <Grid item xs={12} container>
                      <Grid item xs={4}>
                        <label className={`${selectedReportType == 'indoor' ? "required" : ""}`}>Site </label>
                      </Grid>
                      <Grid item xs={8}>
                        <FormControl variant="outlined" fullWidth>
                          <Autocomplete
                            name="siteId"
                            id="tags-outlined"
                            options={
                              allSites && allSites.length > 0 ? allSites : []
                            }
                            getOptionLabel={(option) => option.name}
                            defaultValue={selectedSiteData}
                            value={selectedSiteData ? selectedSiteData : ""}
                            onChange={selectedSite}
                            filterSelectedOptions
                            className="global-input autocomplete-select"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                inputProps={{
                                  ...params.inputProps,
                                  required: selectedReportType == 'indoor'
                                    ? true
                                    : false,
                                }}
                                variant="outlined"
                                placeholder="Select Site"
                              />
                            )}
                          />{" "}
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} container>
                      <Grid item xs={4}>
                        <label>Location</label>
                      </Grid>
                      <Grid item xs={8}>
                        <FormControl variant="outlined" fullWidth>
                          <Autocomplete
                            multiple
                            loading={isLocationLoading}
                            id="tags-outlined"
                            options={
                              locationBySiteId && locationBySiteId.length > 0
                                ? locationBySiteId
                                : []
                            }
                            name="location"
                            getOptionLabel={(option) => option.locationName}
                            defaultValue={selectedLocationData}
                            value={selectedLocationData ? selectedLocationData : []}
                            onChange={selectedLocation}
                            filterSelectedOptions
                            className="global-input autocomplete-select"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                inputProps={{
                                  ...params.inputProps,
                                }}
                                variant="outlined"
                                placeholder="Select Location"
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </> : ""}
                  {selectedReportType == 'outdoor' ? <>
                    <Grid item cs={12} container>
                      <Grid item xs={4}>
                        <label className={`${selectedReportType == 'outdoor' ? "required" : ""}`}>User ID </label>
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
                                inputProps={{
                                  ...params.inputProps,
                                  required: selectedReportType == 'outdoor'
                                    ? true
                                    : false,
                                }}
                                variant="outlined"
                                placeholder="Select User by UserId or UserName"
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </> : ""}
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
                        value={searchForm.startDate}
                        disableFuture={true}
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
                        value={searchForm.endDate}
                        className="global-input"
                        maxDate={moment(searchForm.startDate).add(1, "months")}
                        minDate={moment(searchForm.startDate)}
                        disableFuture={true}
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
          Social Distancing Breaches
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder ? (
        <ComponentLoadderComponent />
      ) : (
        <MuiThemeProvider theme={theme1}>
          {" "}
          <MUIDataTable
            title={""}
            data={socialDistancingData}
            columns={columns}
            options={options}
            className="global-table reports-table no-action-table"
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
function mapStateToProps(state, ownProps) {
  return {
    GridData: state.gridHistory,
    loadGlobalSettingsData: state.loadGlobalSettingsData,
  };
}

const mapDispatchToProps = {
  LoadGridsPage: GridAction.getGridsPages,
  UpdateGridsPage: GridAction.updateGridsPages,
  loadGlobalSettingWithoutAPICall:
    globalSettingAction.loadGlobalSettingWithoutAPICall,
};

export default connect(mapStateToProps, mapDispatchToProps)(SocailDistancing);
// export default SocailDistancing;
