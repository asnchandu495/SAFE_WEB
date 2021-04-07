import React, { Fragment, useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import * as UserAction from "../../Redux/Action/userAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import Tooltip from "@material-ui/core/Tooltip";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import Paper from "@material-ui/core/Paper";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import userService from "../../services/usersService";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

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
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [showLoadder, setshowLoadder] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [SupervisorId, setSupervisorId] = useState();
  const [UserList, setUserList] = useState();
  const [AllUsers, setAllUsers] = useState();
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  //   const columns = [
  //     { name: "Name" },
  //     { name: "Contact Number" },
  //     { name: "Email Id" },
  //     { name: "Date" },
  //     {
  //       label: "Actions",
  //       name: "",
  //       options: {
  //         filter: false,
  //         sort: false,
  //         customBodyRender: (value, tableMeta, updateValue) => {
  //           var thisRowData = tableMeta.rowData;
  //           if (thisRowData) {
  //             return (
  //               <div className={`action-buttons-container`}>
  //                 <Tooltip title="View">
  //                   <Button
  //                     variant="contained"
  //                     color="default"
  //                     startIcon={<VisibilityIcon />}
  //                     className={`view-icon`}
  //                     onClick={() => handleClickView()}
  //                   ></Button>
  //                 </Tooltip>
  //               </div>
  //             );
  //           }
  //         },
  //         setCellProps: (value) => {
  //           return {
  //             style: { width: "250px", minWidth: "250px" },
  //           };
  //         },
  //       },
  //     },
  //   ];

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
      name: "primaryGroup",
      label: "Group",
      options: {
        display: "excluded",
        print: false,
        filter: true,
      },
    },

    {
      name: "site",
      label: "Site",
      options: {
        display: "excluded",
        print: false,
        filter: true,
      },
    },

    {
      name: "firstName",
      label: "Name",
      options: {
        filter: false,
        sort: true,
      },
    },

    {
      name: "contactNumber",
      label: "Contact Number",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "emailID",
      label: "Email ID",
      options: {
        filter: false,
        sort: true,
      },
    },

    {
      name: "",
      label: "Date",
      options: {
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
                <Tooltip title="View">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<VisibilityIcon />}
                    className={`view-icon`}
                    onClick={() => handleClickView()}
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

  const data = [
    ["Gabby George", "0987654321", "Rahul@sutherland.com", "1/7/2020", "1"],
    ["Aiden Lloyd", "1234567890", "Dallas", "1/7/2020", "1"],
    ["Jaden Collins", "7890654321", "Rahul@sutherland.com", "1/7/2020", "1"],
    ["Franky Rees", "2314567890", "Rahul@sutherland.com", "1/7/2020", "1"],
    ["Aaren Rose", "876543210", "Rahul@sutherland.com", "1/7/2020", "1"],
    ["Johnny Jones", "0987654321", "Rahul@sutherland.com", "1/7/2020", "1"],
    ["Jimmy Johns", "9876543210", "Rahul@sutherland.com", "1/7/2020", "1"],
    ["Jack Jackson", "9087654211", "Rahul@sutherland.com", "1/7/2020", "1"],
    ["Joe Jones", "0987654321", "Rahul@sutherland.com", "1/7/2020", "1"],
    ["Jacky Jackson", "7890654321", "Rahul@sutherland.com", "1/7/2020", "1"],
    ["Jo Jo", "9876543210", "Rahul@sutherland.com", "1/7/2020", "1"],
    ["Donna Marie", "876543210", "Rahul@sutherland.com", "1/7/2020", "1"],
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
        noMatch: "There are no questionnaire",
      },
    },
  };

  useEffect(() => {
    Promise.all([
      UserApiCall.getProfileDetails(),
      UserApiCall.ListApplicationUsers(),
    ])
      .then(([userprofileDetails, loadUsersList]) => {
        setSupervisorId(userprofileDetails.id);
        setAllUsers(loadUsersList);
        UserApiCall.GetAllUsersForSupervisor(SupervisorId)
          .then((getUsers) => {
            setUserList(getUsers);
          })
          .catch((err) => {
            console.log(err);
          });
        setComponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function submitForm(e) {
    e.preventDefault();
    // ValidateSubmitForm();
  }
  function handleClickGoBackToPage() {
    props.history.push("/emergencycontacts/view");
  }
  function handleClickView() {
    props.history.push("/selfhealth/heath-declarations/1");
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
          Health
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Configure Self Health Check
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <Paper className="main-paper">
          <ValidatorForm className={`global-form`} onSubmit={submitForm}>
            <Grid container spacing={3}>
              <Grid item container xs={12}>
                <Grid item xs={1}>
                  <label className="">Filters:</label>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="outlined" fullWidth>
                    <Autocomplete
                      id="tags-outlined"
                      label=""
                      options={UserList && UserList.length > 0 ? UserList : []}
                      getOptionLabel={(option) => option.firstName}
                      defaultValue="#"
                      // onChange={selectedfirstName}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
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
                &nbsp; &nbsp;
                <Grid item xs={2}>
                  <TextField
                    id="from"
                    type="date"
                    label="From"
                    defaultValue="2017-05-24"
                    className=""
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                &nbsp; &nbsp;
                <Grid item xs={2}>
                  <TextField
                    id="to"
                    label="To"
                    type="date"
                    defaultValue="2017-05-24"
                    className=""
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={2}>
                  <div className={`form-buttons-container`}>
                    <Button
                      variant="contained"
                      type="submit"
                      className="global-submit-btn"
                      disabled={showLoadder}
                    >
                      {" "}
                      {showLoadder ? <ButtonLoadderComponent /> : "Apply"}
                    </Button>
                  </div>
                </Grid>
              </Grid>

              <Grid item container xs={12}></Grid>
            </Grid>
          </ValidatorForm>
        </Paper>
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
      <MuiThemeProvider theme={theme1}>
        {" "}
        <MUIDataTable
          data={AllUsers && AllUsers.length > 0 ? AllUsers : []}
          columns={columns}
          options={options}
          className="global-table"
        />{" "}
      </MuiThemeProvider>
    </div>
  );
}
export default ConfigureHealth;
