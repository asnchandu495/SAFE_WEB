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
import moment from "moment";

import Dialog from "@material-ui/core/Dialog";

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
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
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import InputAdornment from "@material-ui/core/InputAdornment";
import MasterService from "../../services/masterDataService";
import ReplayIcon from "@material-ui/icons/Replay";
import * as GridAction from "../../Redux/Action/gridAction";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MuiTablePagination from "@material-ui/core/TablePagination";

import propTypes from "prop-types";
import { connect } from "react-redux";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  DateTimePicker,
} from "@material-ui/pickers";
import TooltipComponent from "../common/tooltip";
import ReportService from "../../services/reportService";
import * as globalSettingAction from "../../Redux/Action/globalSettingAction";

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

function OfficeStaff(props) {
  const UserGroup = new UserGroupService();
  const siteApiCall = new SiteService();
  const masterDataCallApi = new MasterService();
  const [userGroupList, setuserGroupList] = useState();
  const reportApiCall = new ReportService();

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
  const [selectedTeamData, setselectedTeamData] = useState([]);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [officeStaffeData, setOfficeStaffeData] = useState([]);
  const [searchForm, setSearchForm] = useState({
    site: "",
    team: [],
    FilterDate: moment().toISOString(),
    frequency: 1,
  });

  const [resetForm, setresetForm] = useState({
    site: "",
    team: [],
    FilterDate: moment().toISOString(),
    frequency: 1,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);
  const [searchFormOld, setSearchFormOld] = useState();
  const [selectedSiteDataOld, setselectedSiteDataOld] = useState();
  const [selectedTeamDataOld, setselectedTeamDataOld] = useState([]);
  const [frequencyJSON, setFrequencyJson] = useState([
    {
      id: "1", value: "1",
    },
    { id: 2, value: "2" },
    { id: 3, value: "3" },
    { id: 4, value: "4" },
    { id: 5, value: "5" },
    { id: 6, value: "6" },
    { id: 7, value: "7" },
    { id: 8, value: "8" },
    { id: 9, value: "9" },
    { id: 10, value: "10" },
    { id: 11, value: "11" },
    { id: 12, value: "12" },
    { id: 13, value: "13" },
    { id: 14, value: "14" },
    { id: 15, value: "15" },
    { id: 16, value: "16" },
    { id: 17, value: "17" },
    { id: 18, value: "18" },
    { id: 19, value: "19" },
    { id: 20, value: "20" },
    { id: 21, value: "21" },
    { id: 22, value: "22" },
    { id: 23, value: "23" },
    { id: 24, value: "24" },
  ]);
  const [frequencyValue, setfrequencyValue] = useState("");
  const [isFilterSelected, setIsFilterSelected] = useState(false);

  useEffect(() => {
    Promise.all([
      siteApiCall.getListSiteSupervisor(),
      masterDataCallApi.getTeams(),
      props.LoadGridsPage(),
      props.loadGlobalSettingWithoutAPICall(),
    ])
      .then(([getAllSites, getTeamsData, gridResult, result]) => {
        setAllSites(getAllSites);
        setTeamData(getTeamsData);
        setComponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = [
    {
      label: "Date",
      name: "createdDate",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          return (
            <div>
              {moment(thisRowData[0]).format(
                props.loadGlobalSettingsData
                  ? props.loadGlobalSettingsData.dateFormat
                  : "hh:mm"
              )}
            </div>
          );
        },
      },
    },
    {
      label: "Time",
      name: "time",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Site",
      name: "siteName",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Team",
      name: "teamName",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "# of staff",
      name: "numberOfStaff",
      options: {
        filter: false,
        sort: true,
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
    filterType: "dropdown",
    responsive: "scroll",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],

    rowsPerPage: currentRowsPerPage,
    onChangeRowsPerPage: handleRowsPerPageChange,
    jumpToPage: true,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: `${isFilterSelected ? 'There are no reports' : 'Please select filters to generate report'}`,
      },
      pagination: {
        jumpToPage: "Go to page:",
      },
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
    customToolbarSelect: (value, tableMeta, updateValue) => { },
    customToolbar: () => {
      return (
        <div className={`maingrid-actions`}>
          <Tooltip title="Filter">
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
        ["frequency"]: searchFormOld.frequency,
        ["FilterDate"]: searchFormOld.FilterDate,
      }));
    }
    if (selectedSiteDataOld) {
      setselectedSiteData(selectedSiteDataOld);
    }
    if (selectedTeamDataOld.length > 0) {
      setselectedTeamData(selectedTeamDataOld);
    }
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  function selectedSite(e, value) {
    setselectedSiteData(value);
  }

  function selectedTeam(e, value) {
    setselectedTeamData(value);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setSearchForm((searchForm) => ({
      ...searchForm,
      [name]: value,
    }));
    // setfrequencyValue(value);
  }

  const handleChangeSearchForm = (getSelectedVal, name) => {
    let thisValue = moment(getSelectedVal).toISOString();
    setSearchForm((searchForm) => ({
      ...searchForm,
      [name]: thisValue,
    }));
  };

  function resetFilterForm() {
    setselectedSiteData();
    setselectedTeamData([]);
    setSearchForm(resetForm);
  }

  function submitForm(e) {
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    setSearchFormOld(searchForm);
    setselectedSiteDataOld(selectedSiteData);
    setselectedTeamDataOld(selectedTeamData);
    setshowLoadder(true);
    if (selectedSiteData) {
      searchForm.site = selectedSiteData.id;
    }

    if (selectedTeamData.length > 0) {
      let teamArr = selectedTeamData.map((item) => item.id);
      searchForm.Teams = teamArr;
    } else {
      searchForm.Teams = [];
    }
    if (frequencyValue) {
      searchForm.frequency = frequencyValue.id;
    }

    reportApiCall
      .getOfficeStaffReport(searchForm)
      .then((result) => {
        setIsFilterSelected(true);
        setOfficeStaffeData(result);
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
                      <label className="required">Site </label>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl variant="outlined" fullWidth>
                        <Autocomplete
                          id="tags-outlined"
                          options={
                            allSites && allSites.length > 0 ? allSites : []
                          }
                          getOptionLabel={(option) => option.name}
                          defaultValue={selectedSiteData}
                          value={selectedSiteData ? selectedSiteData : []}
                          onChange={selectedSite}
                          filterSelectedOptions
                          className="global-input autocomplete-select"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              variant="outlined"
                              placeholder="Select Site"
                              required
                            />
                          )}
                        />{" "}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} container>
                    <Grid item xs={4}>
                      <label className="required">Teams</label>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel
                          id="demo-simple-select-outlined-label"
                          shrink={false}
                          className="select-label"
                        ></InputLabel>

                        <Autocomplete
                          multiple
                          id="tags-outlined"
                          options={
                            TeamData && TeamData.length > 0 ? TeamData : []
                          }
                          getOptionLabel={(option) => option.name}
                          defaultValue={selectedTeamData}
                          value={selectedTeamData ? selectedTeamData : []}
                          onChange={selectedTeam}
                          filterSelectedOptions
                          className="global-input autocomplete-select"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              inputProps={{
                                ...params.inputProps,
                                required: selectedTeamData.length === 0,
                              }}
                              variant="outlined"
                              placeholder="Select Teams"
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} container>
                    <Grid item xs={4}>
                      <label className="">Date</label>
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
                      <KeyboardDatePicker
                        fullWidth
                        name="FilterDate"
                        id=""
                        format="dd/MM/yyyy"
                        minDate={moment(searchForm.startDate).subtract(
                          3,
                          "months"
                        )}
                        disableFuture={true}
                        value={searchForm.FilterDate}
                        className="global-input"
                        onChange={(date, event, e) =>
                          handleChangeSearchForm(date, "FilterDate")
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
                      <label className="">Frequency</label>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel
                          id="demo-simple-select-outlined-label"
                          shrink={false}
                          className="select-label"
                        ></InputLabel>

                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          name="frequency"
                          required
                          value={searchForm.frequency}
                          onChange={handleChange}
                          className="global-input single-select"
                        >
                          {frequencyJSON.map((data) => {
                            return (
                              <MenuItem key={data.id} value={data.value}>
                                {data.value}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      {/* <TextValidator
                        fullWidth
                        variant="outlined"
                        validators={[
                          "required",
                          "matchRegexp:^[0-9]*$",
                          `minNumber:1`,
                        ]}
                        errorMessages={[
                          "Please enter frequencey ",
                          "Only numbers are allowed",
                          "Minimum  allowed is 1",
                        ]}
                        name="frequency"
                        type={"number"}
                        value={searchForm.frequency}
                        onChange={handleChange}
                        className="global-input"
                        // InputLabelProps={{ shrink: false }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              Every
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">Hour</InputAdornment>
                          ),
                        }}
                      /> */}
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
          Number of staff in office
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder ? (
        <ComponentLoadderComponent />
      ) : (
        <MuiThemeProvider theme={theme1}>
          {" "}
          <MUIDataTable
            title={""}
            data={officeStaffeData}
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
// export default OfficeStaff;
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

export default connect(mapStateToProps, mapDispatchToProps)(OfficeStaff);
