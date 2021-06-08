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
import propTypes from "prop-types";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

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

function DensityThreshold(props) {
  const UserGroup = new UserGroupService();
  const siteApiCall = new SiteService();
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
  const [userListDisplay, setuserListDisplay] = useState([]);
  const [allSites, setAllSites] = useState();
  const [selectedSiteData, setselectedSiteData] = useState();
  const [selectedLocationData, setselectedLocationData] = useState();
  const [searchForm, setSearchForm] = useState({
    site: [],
    location: [],
    fromDate: moment().toISOString(),
    toDate: moment().toISOString(),
  });
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const [locationDensityData, setlocationDensityData] = useState([
    {
      id: "001",
      name: "site 0",
      location: { id: "001", name: " Bengaluru" },
      status: "00",
      usersList: [
        {
          id: "08",
          name: "username",
          emailid: "username@gmail.com",
          userid: "UID001",
          timestamp: "1-9-2020: 10:32",
        },
        {
          id: "09",
          name: "username",
          emailid: "username@gmail.com",
          userid: "UID001",
          timestamp: "1-9-2020: 10:32",
        },
      ],
    },
    {
      id: "002",
      name: "Site 1",
      location: { id: "001", name: " Hyderabad" },
      status: "02",
      usersList: [
        {
          id: "08",
          name: "username",
          emailid: "username@gmail.com",
          userid: "UID001",
          timestamp: "1-9-2020: 10:32",
        },
        {
          id: "09",
          name: "username",
          emailid: "username@gmail.com",
          userid: "UID001",
          timestamp: "1-9-2020: 10:32",
        },
      ],
    },
    {
      id: "001",
      name: "site2",
      location: { id: "001", name: " Chennai" },
      status: "00",
      usersList: [
        {
          id: "08",
          name: "username",
          emailid: "username@gmail.com",
          userid: "UID001",
          timestamp: "1-9-2020: 10:32",
        },
        {
          id: "09",
          name: "username",
          emailid: "username@gmail.com",
          userid: "UID001",
          timestamp: "1-9-2020: 10:32",
        },
      ],
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
      label: "Site ",
      name: "name",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      label: "Location",
      name: "location",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return <span>{thisRowData[2].name}</span>;
          }
        },
      },
    },
    {
      name: "usersList",
      label: "UsersList",
      options: {
        display: "excluded",
        print: false,
        filter: false,
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
  ];

  const options = {
    filter: false,
    onFilterChange: (changedColumn, filterList) => {
      console.log(changedColumn, filterList);
    },
    selectableRows: false,
    filterType: "dropdown",
    responsive: "scrollMaxHeight",
    rowsPerPage: 5,
    expandableRows: true,
    expandableRowsHeader: false,
    renderExpandableRow: (rowData, rowMeta) => {
      console.log(rowData);
      return (
        <tr>
          <td colSpan={6}>
            <TableContainer className="inner-table">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>User Name</TableCell>
                    <TableCell>User ID&nbsp;</TableCell>
                    <TableCell>Email ID&nbsp;</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowData[3]
                    ? rowData[3].map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.userid}</TableCell>
                          <TableCell>{row.emailid}</TableCell>
                          <TableCell>{row.timestamp}</TableCell>
                        </TableRow>
                      ))
                    : []}
                </TableBody>
              </Table>
            </TableContainer>
          </td>
        </tr>
      );
    },
    page: 1,
    print: false,
    viewColumns: false,
    download: false,
    customToolbarSelect: (value, tableMeta, updateValue) => {},
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
  function selectedLocation(e, value) {
    setselectedLocationData(value);
  }

  useEffect(() => {
    setuserListDisplay(locationDensityData.usersList);
    setComponentLoadder(true);
    Promise.all([
      siteApiCall.getListSite(),
      siteApiCall.getLocationManagers(),
      //   props.LoadData(),
    ])

      .then(([getAllSites, result]) => {
        setComponentLoadder(false);
        setAllSites(getAllSites);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  function submitForm(e) {
    e.preventDefault();
    if (selectedSiteData) {
      searchForm.site = selectedSiteData;
    }
    if (selectedLocation) {
      searchForm.location = selectedLocationData;
    }
    console.log(searchForm);
    settoasterServerity("");
    settoasterErrorMessageType("");
    setComponentLoadder(true);
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
                          multiple
                          id="tags-outlined"
                          options={
                            allSites && allSites.length > 0 ? allSites : []
                          }
                          getOptionLabel={(option) => option.name}
                          defaultValue={selectedSiteData}
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
                      <label className="">Location</label>
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
                            locationData && locationData.length > 0
                              ? locationData
                              : []
                          }
                          getOptionLabel={(option) => option.name}
                          defaultValue={selectedLocationData}
                          onChange={selectedLocation}
                          filterSelectedOptions
                          className="global-input autocomplete-select"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              placeholder="Select Location"
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
                    <Grid item xs={8} className="date-time-pickers">
                      <KeyboardDatePicker
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
                      <KeyboardDatePicker
                        fullWidth
                        name="toDate"
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
          Density Threshold Breaches
        </LinkTo>
      </Breadcrumbs>

      <MUIDataTable
        title={""}
        data={locationDensityData}
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
export default DensityThreshold;
