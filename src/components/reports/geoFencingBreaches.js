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
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import moment from "moment";

import propTypes from "prop-types";
import { connect } from "react-redux";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
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

function GeoFencingBreaches(props) {
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

  const [allSites, setAllSites] = useState();
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const [selectedSiteData, setselectedSiteData] = useState();
  const [selectedLocationData, setselectedLocationData] = useState();
  const [searchForm, setSearchForm] = useState({
    fromDate: moment().toISOString(),
    toDate: moment().toISOString(),
    users: "",
  });
  const [selectedValue, setSelectedValue] = React.useState("a");
  const [locationDensityData, setlocationDensityData] = useState([
    {
      id: "001",
      name: "User1",
      location: { id: "001", name: " Bengaluru" },
      status: "00",
      userid: "567899",
      emailid: "user1@sutherland.com",
    },
    {
      id: "002",
      name: "User 2",
      location: { id: "001", name: " Hyderabad" },
      status: "02",
      userid: "124643",
      emailid: "user2@sutherland.com",
    },
    {
      id: "001",
      name: "User 3",
      location: { id: "001", name: " Chennai" },
      status: "00",
      userid: "098765",
      emailid: "user3@sutherland.com",
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
      label: "User Name ",
      name: "name",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "User ID",
      name: "userid",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Email ID",
      name: "emailid",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: " # of instances ",
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

  // const handleChange = (event) => {
  //   setSelectedValue(event.target.value);
  // };
  function selectedSite(e, value) {
    setselectedSiteData(value);
  }
  function selectedLocation(e, value) {
    setselectedLocationData(value);
  }
  function handleChange(e) {
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
                  <Grid item xs={12} container>
                    <Grid item xs={4} className="">
                      <label>Select User</label>
                    </Grid>

                    <Grid item xs={8} className="">
                      <Radio
                        label=""
                        checked={selectedValue === "a"}
                        onChange={handleChange}
                        value="a"
                        name="users"
                        inputProps={{ "aria-label": "A" }}
                      />
                      <label className=""> All users reporting to me </label>
                      <Radio
                        checked={selectedValue === "b"}
                        onChange={handleChange}
                        value="b"
                        name="users"
                        label=""
                        inputProps={{ "aria-label": "B" }}
                      />
                      <label className=""> Specific users </label>
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
                      {/* {formData.isActive != "" ? "Select status" : ""} */}

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
          Geo Fencing Threshold Breaches
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

export default GeoFencingBreaches;
