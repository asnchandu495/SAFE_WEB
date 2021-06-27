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
import ReportService from "../../services/reportService";

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
  const [selectedTeamData, setselectedTeamData] = useState();
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [officeStaffeData, setOfficeStaffeData] = useState([
    {
      siteName: "site 0",
      teamName: "Flex",
      numberOfStaff: "00",
      createdDate: "1/9/2020",
      time: "10:00",
    },
  ]);
  const [searchForm, setSearchForm] = useState({
    site: "",
    team: [],
    FilterDate: moment().toISOString(),
    frequency: 0,
  });

  const [resetForm, setresetForm] = useState({
    site: [],
    team: [],
    FilterDate: moment().toISOString(),
    frequency: "",
  });

  useEffect(() => {
    setComponentLoadder(true);
    Promise.all([
      siteApiCall.getListSite(),
      masterDataCallApi.getTeams(),
    ])
      .then(([getAllSites, getTeamsData]) => {
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
  }

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
    console.log(searchForm);
    reportApiCall
      .getOfficeStaffReport(searchForm)
      .then((result) => {
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
                      <label className="">Site </label>
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
                      <label className="">Date</label>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      className="date-time-pickers report-pickers"
                    >
                      <DateTimePicker
                        fullWidth
                        name="FilterDate"
                        id=""
                        format="dd/MM/yyyy hh:mm a"
                        value={searchForm.FilterDate}
                        className="global-input"
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
                      <label className="">Frequency</label>
                    </Grid>
                    <Grid item xs={8} className="">
                      <TextValidator
                        fullWidth
                        variant="outlined"
                        validators={[
                          "required",
                          "matchRegexp:^[0-9]*$",
                        ]}
                        errorMessages={[
                          "Please enter frequencey ",
                          "Only numbers are allowed",
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
        data={officeStaffeData}
        columns={columns}
        options={options}
        className="global-table reports-table no-action-table"
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
