import React, { Fragment, useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ToasterMessageComponent from "../common/toaster";
import Tooltip from "@material-ui/core/Tooltip";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import Paper from "@material-ui/core/Paper";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import userService from "../../services/usersService";
import healthCheckService from "../../services/healthCheckService";
import PropTypes from "prop-types";
import { connect } from "react-redux";
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

function ConfigureHealth(props) {
  const UserApiCall = new userService();
  const HealthCheckApiCall = new healthCheckService();
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [showLoadder, setshowLoadder] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [UserList, setUserList] = useState([]);
  const [selfHealthChecks, setSelfHealthChecks] = useState([]);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [searchForm, setSearchForm] = useState({
    userId: "",
    fromDate: null,
    toDate: null,
  });
  const [selectedUserDetails, setSelectedUserDetails] = useState();

  useEffect(() => {
    props.loadGlobalSettingWithoutAPICall();
    UserApiCall.getProfileDetails()
      .then((loggedinUserDetails) => {
        UserApiCall.GetAllUsersForSupervisor(loggedinUserDetails.id)
          .then((getUsers) => {
            setUserList(getUsers);
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
      name: "id",
      label: "Id",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      name: "userName",
      label: "Name",
      options: {
        print: false,
        filter: true,
      },
    },
    {
      name: "contactNummber",
      label: "Contact Number",
      options: {
        print: false,
        filter: true,
      },
    },
    {
      name: "emailId",
      label: "Email ID",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "createdDate",
      label: "Date",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return (
              <span>
                {moment(thisRowData[4]).format(
                  props.loadGlobalSettingsData
                    ? props.loadGlobalSettingsData.dateFormat
                    : "dd:MM:yyyy"
                )}
              </span>
            );
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
                <Tooltip title="View">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<VisibilityIcon />}
                    className={`view-icon`}
                    onClick={() => handleClickView(thisRowData[0])}
                  ></Button>
                </Tooltip>
              </div>
            );
          }
        },
        setCellProps: (value) => {
          return {
            style: { width: "250px", minWidth: "250px" },
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
        noMatch: "There are no self health checks",
      },
    },
  };

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
    setSearchForm({
      userId: "",
      fromDate: moment().toISOString(),
      toDate: moment().toISOString(),
    });
    setSelectedUserDetails();
    setSelfHealthChecks([]);
  }

  function submitForm(e) {
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    setComponentLoadder(true);
    HealthCheckApiCall.getUserHealthChecks(searchForm)
      .then((healthChecks) => {
        if (healthChecks.length > 0) {
          let newHealthCheck = [];
          healthChecks.forEach((chk) => {
            newHealthCheck.push({
              id: chk.id,
              userName:
                selectedUserDetails.firstName +
                " " +
                selectedUserDetails.lastName,
              contactNummber: selectedUserDetails.contactNumber,
              emailId: selectedUserDetails.emailID,
              createdDate: chk.createdDate,
            });
          });
          setSelfHealthChecks(newHealthCheck);
          setComponentLoadder(false);
        } else {
          setSelfHealthChecks([]);
          setComponentLoadder(false);
        }
      })
      .catch((err) => {
        setComponentLoadder(false);
        console.log(err);
      });
  }

  function handleClickView(getId) {
    props.history.push(`/selfhealth/heath-declarations/${getId}`);
  }

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
          to={`/selfhealthcheck/configurehealth`}
          className="inactive"
        >
          Configure self health-check
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Health Declarations
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <>
          <Paper className="search-form-top-paper">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <ValidatorForm className={`global-form`} onSubmit={submitForm}>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <FormControl variant="outlined" fullWidth>
                      <Autocomplete
                        id="tags-outlined"
                        label=""
                        options={
                          UserList && UserList.length > 0 ? UserList : []
                        }
                        getOptionLabel={(option) => option.firstName}
                        defaultValue={selectedUserDetails}
                        name="userId"
                        onChange={(e, v) => handleChangeSearchForm(v, "userId")}
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        required
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="User"
                          />
                        )}
                      />{" "}
                    </FormControl>
                  </Grid>
                  <Grid item xs={2} className="date-time-pickers">
                    <KeyboardDatePicker
                      format={
                        props.loadGlobalSettingsData
                          ? props.loadGlobalSettingsData.dateFormat
                          : "dd/MM/yyyy"
                      }
                      fullWidth
                      id="from"
                      label="From"
                      name="fromDate"
                      required
                      value={searchForm.fromDate}
                      className="global-input"
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      onChange={(date, event, e) =>
                        handleChangeSearchForm(date, "fromDate")
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    className="date-time-pickers todate-container"
                  >
                    <KeyboardDatePicker
                      // format="MM/dd/yyyy"
                      format={
                        props.loadGlobalSettingsData
                          ? props.loadGlobalSettingsData.dateFormat
                          : "dd/MM/yyyy"
                      }
                      fullWidth
                      id="to"
                      label="To"
                      name="toDate"
                      required
                      value={searchForm.toDate}
                      minDate={searchForm.fromDate}
                      className="global-input"
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      onChange={(date, event, e) =>
                        handleChangeSearchForm(date, "toDate")
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <div className={`form-buttons-container`}>
                      <Button
                        variant="contained"
                        type="submit"
                        className="global-submit-btn global-filter-btn"
                        disabled={showLoadder}
                      >
                        {" "}
                        {showLoadder ? <ButtonLoadderComponent /> : "Apply"}
                      </Button>
                    </div>
                  </Grid>
                  <Grid item xs={2}>
                    <div className={`form-buttons-container`}>
                      <Button
                        variant="contained"
                        type="button"
                        className="global-cancel-btn global-filter-reset-btn"
                        onClick={resetFilterForm}
                      >
                        Reset
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </ValidatorForm>
            </MuiPickersUtilsProvider>
          </Paper>
          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              data={
                selfHealthChecks && selfHealthChecks.length > 0
                  ? selfHealthChecks
                  : []
              }
              columns={columns}
              options={options}
              className="global-table"
            />{" "}
          </MuiThemeProvider>
        </>
      ) : (
        <ComponentLoadderComponent />
      )}
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

ConfigureHealth.propTypes = {
  loadGlobalSettingWithoutAPICall: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    loadGlobalSettingsData: state.loadGlobalSettingsData,
  };
}

const mapDispatchToProps = {
  loadGlobalSettingWithoutAPICall:
    globalSettingAction.loadGlobalSettingWithoutAPICall,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureHealth);
