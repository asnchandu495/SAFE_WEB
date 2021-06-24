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
import PublishIcon from "@material-ui/icons/Publish";
import CovidStateApiServices from "../../services/masterDataService";
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
import ChangeStatusIcon from "@material-ui/icons/SyncAlt";
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
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  DateTimePicker,
} from "@material-ui/pickers";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

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
  const CovidStateApi = new CovidStateApiServices();

  const siteApiCall = new SiteService();
  const [userGroupList, setuserGroupList] = useState();
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);
  const [Modalopen, setModalOpen] = useState(false);
  const [BulkModalOpen, setBulkModalOpen] = useState(false);
  const [ChangeModalOpen, setChangeModalOpen] = useState(false);

  const [modalChangeValue, setmodalChangeValue] = useState();
  const [showLoadder, setshowLoadder] = useState(false);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
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
  const [RowsSelected, setRowsSelected] = useState([]);
  const [selectedUsersForCovidState, setSelectedUsersForCovidState] = useState(
    []
  );
  const [allSites, setAllSites] = useState();
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const [covidStatelist, setcovidStatelist] = useState();
  const [BusinessCovidStateData, setBusinessCovidStateData] = useState();
  const [searchForm, setSearchForm] = useState({
    userid: "",
    reportType: "",
    fromDate: moment().toISOString(),
    toDate: moment().toISOString(),
  });
  const [locationDensityData, setlocationDensityData] = useState([
    {
      id: "001",
      user: "User 1",
      contact: { id: "001", name: " level1" },
      status: "00",
      userid: "676768",
    },
    {
      id: "002",
      user: "User 2",
      contact: { id: "001", name: " level1" },
      status: "02",
      userid: "123456",
    },
    {
      id: "001",
      user: "User 3",
      contact: { id: "001", name: " level1" },
      status: "00",
      userid: "345673",
    },
  ]);
  const locationData = [
    { id: "01", name: "Reception Area" },
    { id: "02", name: "Parking lot" },
    { id: "03", name: "Cafetaria lot" },
  ];

  const [locationDensityBulkData, setlocationDensityBulkData] = useState([
    {
      id: "001",
      user: "User 1",
      contact: { id: "001", name: " level1" },
      status: "00",
      userid: "676768",
      covidstate: "safe",
    },
    {
      id: "002",
      user: "User 2",
      contact: { id: "001", name: " level1" },
      status: "02",
      userid: "123456",
      covidstate: "confirmed",
    },
  ]);
  const bulkcolumns = [
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
      label: "Name ",
      name: "user",
      options: {
        filter: false,
        sort: true,
      },
      setCellProps: (value) => {
        return {
          style: { width: "50px", minWidth: "50px", textAlign: "center" },
        };
      },
    },
    {
      label: "User ID ",
      name: "userid",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Covid State ",
      name: "covidstate",
      options: {
        filter: false,
        sort: true,
      },
    },
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
      label: "Name ",
      name: "user",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "User ID ",
      name: "userid",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Contact Trace Level",
      name: "contact",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          console.log(thisRowData);
          if (thisRowData) {
            return <span>{thisRowData[3].name}</span>;
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
          if (thisRowData) {
            return (
              <div className={`action-buttons-container`}>
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

                <Tooltip title="Change Covid State">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<ChangeStatusIcon />}
                    className={`edit-icon`}
                    onClick={() =>
                      // handleClickOpenChangeStatusModal(thisRowData)
                      handleChangeState(thisRowData)
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

  function handleRowsPerPageChange(rowsPerPage) {
    setCurrentRowsPerPage(rowsPerPage);
  }

  const options = {
    filter: false,
    filterType: "dropdown",
    responsive: "scroll",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: currentRowsPerPage,
    onChangeRowsPerPage: handleRowsPerPageChange,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: "multiple",
    disableToolbarSelect: true,

    onRowSelectionChange: (currentRowSelected, allRowsSelected) => {
      console.log("rows");
      console.log(currentRowSelected);
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
        finalUsers.push({ id: user.id });
      });
      console.log(finalUsers);
      setSelectedUsersForCovidState(finalUsers);
    },

    textLabels: {
      body: {
        noMatch: "There are no reports",
      },
    },
    customToolbarSelect: (value, tableMeta, updateValue) => { },
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
            <Tooltip title="Change Covid State">
              <Button
                variant="contained"
                startIcon={<ChangeStatusIcon />}
                className={`edit-icon`}
                onClick={() =>
                  handleClickOpenBulkModal(selectedUsersForCovidState)
                }
              ></Button>
            </Tooltip>
          ) : (
            ""
          )}
        </div>
      );
    },
  };

  const bulkoptions = {
    filter: false,
    filterType: "dropdown",
    responsive: "scroll",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: currentRowsPerPage,
    onChangeRowsPerPage: handleRowsPerPageChange,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: false,
    disableToolbarSelect: true,

    textLabels: {
      body: {
        noMatch: "There are no reports",
      },
    },
    customToolbarSelect: (value, tableMeta, updateValue) => { },
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

  const handleClickOpenBulkModal = () => {
    setBulkModalOpen(true);
  };

  const handleClickCloseBulkModal = () => {
    setBulkModalOpen(false);
  };

  const handleChangeState = (row) => {
    console.log(row[0]);
    setmodalChangeValue(row[0]);
    setChangeModalOpen(true);
  };

  const handleChangeStateClose = () => {
    setChangeModalOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  function covidStateSelect(e, value) {
    setcovidStatelist(value);
  }
  function handleChange(e) {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    setSearchForm((logInForm) => ({
      ...logInForm,
      [name]: value,
    }));
  }

  useEffect(() => {
    setComponentLoadder(true);
    Promise.all([
      siteApiCall.getListSite(),
      siteApiCall.getLocationManagers(),
      CovidStateApi.getCOVIDStates(),
      //   props.LoadData(),
    ])

      .then(([getAllSites, result, getCovidStates]) => {
        setComponentLoadder(false);
        setBusinessCovidStateData(getCovidStates);
        setAllSites(getAllSites);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function submitForm(e) {
    e.preventDefault();
    var formData = searchForm;
    console.log(formData);
    settoasterServerity("");
    settoasterErrorMessageType("");
    setComponentLoadder(true);
  }

  const handleClickOpenChangeStatusModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("ChangeDocStatus");
    setConfirmationHeaderTittle("Change emergency contact doc status");

    setConfirmationDialogContextText(
      `By changing the status to “Inactive”, users of the user group will not be able to access any Emergency Contact documents. Are you sure you want to change status ?`
    );
  };

  const handleClickOpenConfirmationModal = (value) => {
    var user = value[1];
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("alertreport");
    setConfirmationHeaderTittle("Alert");
    setConfirmationDialogContextText(
      `Alert! ${user} has been reported as Covid positive. As a precautionary step, please WFH for next 2 week. Contact your supervisor for more information.`
    );
  };

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
        <ValidatorForm className={`global-form`} onSubmit="#">
          <DialogContent dividers>
            {!componentLoadder ? (
              <Grid container spacing={3}>
                <Grid item xs={12} container>
                  <Table
                    aria-label="simple table"
                    className="flag-details-table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email ID</TableCell>
                        <TableCell>COVID state</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>User 1</TableCell>
                        <TableCell>User1@gmail.com</TableCell>
                        <TableCell>Safe</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>User 2</TableCell>
                        <TableCell>User2@gmail.com</TableCell>
                        <TableCell>Confirmed</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
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
              {showLoadder ? <ButtonLoadderComponent /> : "Save"}
            </Button>
            <Button onClick={handleClose} className="global-cancel-btn">
              Cancel
            </Button>
          </DialogActions>
        </ValidatorForm>{" "}
      </Dialog>

      <Dialog
        onClose={handleChangeStateClose}
        aria-labelledby="customized-dialog-title"
        className="global-dialog confirmation-dialog global-form modal-min-width"
        aria-labelledby="form-dialog-title"
        open={ChangeModalOpen}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleChangeStateClose}
        >
          Change State
        </DialogTitle>
        <ValidatorForm className={`global-form`} onSubmit="#">
          <DialogContent dividers>
            {!componentLoadder ? (
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <label className="">Covid State</label>
                </Grid>
                <Grid item xs={8}>
                  <Autocomplete
                    fullWidth
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
            ) : null}
          </DialogContent>
          <DialogActions>
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
                      <label className="">User ID </label>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl variant="outlined" fullWidth>
                        <TextValidator
                          variant="outlined"
                          fullWidth
                          placeholder="User Id"
                          id="userid"
                          name="userid"
                          onChange={handleChange}
                          value={searchForm.userid}
                          className="global-input"
                          InputLabelProps={{ shrink: false }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} container>
                    <Grid item xs={4}>
                      <label className="">First Name</label>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl variant="outlined" fullWidth>
                        <TextValidator
                          variant="outlined"
                          //   validators={[
                          //     "matchRegexp:^[0-9]*$",
                          //     "maxNumber:9999999",
                          //   ]}
                          //   errorMessages={[
                          //     "Only numbers are allowed",
                          //     "Maximum allowed digits",
                          //   ]}
                          fullWidth
                          placeholder="First Name "
                          id="firstname"
                          name="firstname"
                          onChange={handleChange}
                          value={searchForm.firstname}
                          className="global-input"
                          InputLabelProps={{ shrink: false }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} container>
                    <Grid item xs={4}>
                      <label className="">Last Name</label>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl variant="outlined" fullWidth>
                        <TextValidator
                          variant="outlined"
                          //   validators={[
                          //     "matchRegexp:^[0-9]*$",
                          //     "maxNumber:9999999",
                          //   ]}
                          //   errorMessages={[
                          //     "Only numbers are allowed",
                          //     "Maximum allowed digits",
                          //   ]}
                          fullWidth
                          placeholder="Last Name"
                          id="lastname"
                          name="lastname"
                          onChange={handleChange}
                          value={searchForm.lastname}
                          className="global-input"
                          InputLabelProps={{ shrink: false }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} container>
                    <Grid item xs={4}>
                      <label className="">From</label>
                    </Grid>
                    <Grid item xs={8} className="date-time-pickers">
                      {/* {formData.isActive != "" ? "Select status" : ""} */}

                      <DateTimePicker
                        fullWidth
                        name="fromDate"
                        id=""
                        format="dd/MM/yyyy"
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
                      {/* {formData.isActive != "" ? "Select status" : ""} */}

                      <DateTimePicker
                        fullWidth
                        name="fromDate"
                        id=""
                        format="dd/MM/yyyy"
                        value={selectedDate}
                        className="global-input"
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
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
          Contact Trace History
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

export default ContactTracing;
