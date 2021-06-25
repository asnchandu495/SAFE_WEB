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

import propTypes from "prop-types";
import { connect } from "react-redux";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  DateTimePicker,
} from "@material-ui/pickers";

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
  const [locationDensityData, setlocationDensityData] = useState([
    {
      id: "001",
      name: "site 0",
      location: { id: "001", name: " Bengaluru" },
      status: "00",
      date: "1/9/2020",
      time: "10:00",
      team: "Team 001",
    },
    {
      id: "002",
      name: "Site 1",
      location: { id: "001", name: " Hyderabad" },
      status: "02",
      date: "1/9/2020",
      time: "10:00",
      team: "Audit 360 Dev Team",
    },
    {
      id: "001",
      name: "site2",
      location: { id: "001", name: " Chennai" },
      status: "00",
      date: "1/9/2020",
      time: "10:00",
      team: "New Team",
    },
  ]);
  const locationData = [
    { id: "01", name: "Reception Area" },
    { id: "02", name: "Parking lot" },
    { id: "03", name: "Cafetaria lot" },
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
      label: "Date ",
      name: "date",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Time ",
      name: "time",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Site ",
      name: "name",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Team ",
      name: "team",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Location",
      name: "location",
      options: {
        filter: false,
        display: "excluded",
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return <span>{thisRowData[2].name}</span>;
          }
        },
      },
    },
    {
      label: "# of instances ",
      name: "status",
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
          if (thisRowData) {
            return (
              <div className={`action-buttons-container`}>
                <Tooltip title="View">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<VisibilityIcon />}
                    className={`view-icon`}
                    onClick="#"
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
        noMatch: "There are no reports",
      },
    },
    customToolbarSelect: (value, tableMeta, updateValue) => {},
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

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  const handleClickOpenModal = () => {
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

  const [searchForm, setSearchForm] = useState({
    site: [],
    team: [],
    fromDate: moment().toISOString(),
    toDate: moment().toISOString(),
    frequency: "",
  });
  const [resetForm, setresetForm] = useState({
    site: [],
    team: [],
    fromDate: moment().toISOString(),
    toDate: moment().toISOString(),
    frequency: "",
  });

  function handleChange(e) {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    setSearchForm((logInForm) => ({
      ...logInForm,
      [name]: value,
    }));
  }

  const handleChangeSearchForm = (getSelectedVal, name) => {
    let thisValue = "";
    var nextday = "";
    if (name == "userId") {
      if (getSelectedVal) {
        thisValue = getSelectedVal.id;
        setSelectedUserDetails(getSelectedVal);
      } else {
        thisValue = "";
      }
    } else {
      thisValue = moment(getSelectedVal).toISOString();
    }
    setSearchForm((searchForm) => ({
      ...searchForm,
      [name]: thisValue,
    }));
  };
  function resetFilterForm() {
    setselectedSiteData([]);
    setselectedTeamData([]);
    setSelectedDate();
    setSearchForm(resetForm);
  }
  function submitForm(e) {
    e.preventDefault();
    if (selectedSiteData) {
      searchForm.site = selectedSiteData;
    }
    if (selectedTeamData) {
      searchForm.team = selectedTeamData;
    }
    console.log(searchForm);
    settoasterServerity("");
    settoasterErrorMessageType("");
    setComponentLoadder(true);
  }
  useEffect(() => {
    setComponentLoadder(true);
    Promise.all([
      siteApiCall.getListSite(),
      siteApiCall.getLocationManagers(),
      masterDataCallApi.getTeams(),
      //   props.LoadData(),
    ])

      .then(([getAllSites, result, getTeamsData]) => {
        setComponentLoadder(false);
        setAllSites(getAllSites);
        setTeamData(getTeamsData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
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
                      <label className="">Site </label>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl variant="outlined" fullWidth>
                        <Autocomplete
                          multiple
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
                      <label className="">Teams</label>
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
                      <label className="">From</label>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      className="date-time-pickers fromdate-container"
                    >
                      <DateTimePicker
                        fullWidth
                        name="fromDate"
                        id=""
                        // format="dd/MM/yyyy"
                        value={selectedDate}
                        className="global-input"
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} container>
                    <Grid item xs={4}>
                      <label className="">To</label>
                    </Grid>
                    <Grid item xs={8} className="date-time-pickers">
                      <DateTimePicker
                        fullWidth
                        name="toDate"
                        id=""
                        // format="dd/MM/yyyy"
                        value={selectedDate}
                        className="global-input"
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} container>
                    <Grid item xs={4}>
                      <label className="">Frequency</label>
                    </Grid>
                    <Grid item xs={8} className="">
                      <TextValidator
                        fullWidth
                        variant="outlined"
                        validators={[
                          // "required",
                          "matchRegexp:^[0-9]*$",
                          "maxNumber:999",
                        ]}
                        errorMessages={[
                          // "Please enter frequencey ",
                          "Only numbers are allowed",
                          "Maximum allowed 3 digits",
                        ]}
                        name="frequency"
                        type={"text"}
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
                Reset
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

      <MUIDataTable
        title={""}
        data={locationDensityData}
        columns={columns}
        options={options}
        className="global-table"
      />
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
export default OfficeStaff;
