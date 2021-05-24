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
import UserGroupApiServices from "../../services/userGroupService";
import UserService from "../../services/usersService";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogContent from "@material-ui/core/DialogContent";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogActions from "@material-ui/core/DialogActions";
import MasterService from "../../services/masterDataService";
import FormHelperText from "@material-ui/core/FormHelperText";

const theme1 = createMuiTheme({
  overrides: {
    MUIDataTable: {
      responsiveScroll: {
        overflowX: "none",
        height: "auto",
        maxHeight: "calc(100vh - 310px) !important",
      },
    },
  },
});

function AddPrimaryUserToUserGroups(props) {
  const userGroupUpdateid = props.match.params.id;
  // const usersApiCall = new UserService();
  const UserGroupApi = new UserGroupApiServices();
  const masterDataCallApi = new MasterService();
  const UsersApi = new UserService();
  const [Modalopen, setModalOpen] = useState(false);
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("300px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formData, setFormData] = useState({
    groupId: "",
    isPrimary: true,
    isSecondary: false,
    applicationUserIds: [],
  });
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [applicationUsers, setApplicationUsers] = useState([]);
  const [selectedGroupInfo, setSelectedGroupInfo] = useState();
  const [selectedUsersToGroup, setSelectedUsersToGroup] = useState([]);
  const [formFieldValidation, setformFieldValidation] = useState({
    roleIds: false,
    siteId: false,
  });

  const [designationMasterData, setdesignationMasterData] = useState();
  const [CountryMasterData, setCountryMasterData] = useState();
  const [SiteMasterData, setSiteMasterData] = useState([]);
  const [BusinessTeamMasterData, setBusinessTeamMasterData] = useState();
  const [userList, setuserList] = useState();
  const [BusinessUserRoleMasterData, setBusinessUserRoleMasterData] = useState(
    []
  );
  const [UserPrimaryGroupMasterData, setUserPrimaryGroupMasterData] =
    useState();
  // const [formFieldValidation, setformFieldValidation] = useState({});
  const [searchformData, setsearchformData] = useState({
    primaryGroupId: "",
    designationId: "",
    covidStateId: "",
    roleIds: [],
    siteId: [],
  });
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);
  const [userSelectedUser, setUserSelectedUser] = useState();
  const [userSelectedRole, setUserSelectedRole] = useState();
  const [userSelectedTeam, setUserSelectedTeam] = useState();
  const [userSelectedDesignation, setUserSelectedDesignation] = useState();
  const [userSelectedSite, setUserSelectedSite] = useState();
  const [userSelectedCountry, setUserSelectedCountry] = useState();

  useEffect(() => {
    if (userGroupUpdateid) {
      Promise.all([
        UsersApi.ListPrimaryApplicationUsers(),
        masterDataCallApi.getDesignations(),
        masterDataCallApi.getCountries(),
        masterDataCallApi.getTeams(),
        masterDataCallApi.getSites(),
        masterDataCallApi.getUserPrimaryRoles(),
        UserGroupApi.getGroupInfo(userGroupUpdateid),
        UsersApi.ListApplicationUsers(),
      ])
        .then(
          ([
            getUserList,
            getDesignations,
            getCountries,
            getTeams,
            getSites,
            getUserRoles,
            groupInfo,
            applicationUsers,
          ]) => {
            let primaryUsers = groupInfo.primaryapplicationuserDetails;
            setuserList(getUserList);
            setdesignationMasterData(getDesignations);
            setCountryMasterData(getCountries);
            setBusinessTeamMasterData(getTeams);
            setSiteMasterData(getSites);
            setBusinessUserRoleMasterData(getUserRoles);
            setSelectedGroupInfo(groupInfo);
            setApplicationUsers(applicationUsers);
            setComponentLoadder(false);
            var selectedUsersToGroupArray = [];

            applicationUsers.map((user, i) => {
              const found = primaryUsers.some((u) => u.id === user.id);
              if (found) {
                selectedUsersToGroupArray.push(i);
              }
            });
            setSelectedUsersToGroup(selectedUsersToGroupArray);
          }
        )
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

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
    disableToolbarSelect: true,
    // customToolbar: () => {
    //     return <UserGroupAddButton />;
    //   },
    selectableRows: "multiple",
    rowsSelected: selectedUsersToGroup,
    onRowSelectionChange: (currentRowSelected, allRowsSelected) => {
      setSelectedUsers(allRowsSelected);
      var selectedUsersToGroupArray = [];
      allRowsSelected.map((user, i) => {
        selectedUsersToGroupArray.push(user.dataIndex);
      });
      setSelectedUsersToGroup(selectedUsersToGroupArray);
    },

    textLabels: {
      selectedRows: {
        text: "user(s) added to usergroups",
      },
      body: {
        noMatch: "There are no users",
      },
    },

    customToolbarSelect: (value, tableMeta, updateValue) => {},
    customToolbar: () => {
      return (
        <div className={`maingrid-actions`}>
          <Tooltip title="Filter By User">
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

  const columns = [
    {
      label: "Id",
      name: "id",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      name: "firstName",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "emailID",
      label: "Email Id",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "contactNumber",
      label: "Contact Number",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  const handleClickOpenModal = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  function selectedUser(e, value) {
    setuserList(value);
  }

  function handleChangeUserRole(e, value) {
    setBusinessUserRoleMasterData(value);
  }

  function roleDetails() {
    if (BusinessUserRoleMasterData.length > 0) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["roleIds"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["roleIds"]: true,
      }));
    }
  }

  function siteDetails() {
    if (SiteMasterData.length > 0) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["siteId"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["siteId"]: true,
      }));
    }
  }

  function handleChangeTeam(e, value) {
    setBusinessTeamMasterData(value);
  }

  function userSelectSite(e, value) {
    setSiteMasterData(value);
  }

  function handleChangeCountry(e, value) {
    setCountryMasterData(value);
  }

  function handleChangeUserDesignation(e, value) {
    setdesignationMasterData(value);
  }

  function AssignFiltersForm() {
    if (searchformData) {
      submitAssignFilter();
    } else {
      submitAssignFilter(false);
      return false;
    }
  }

  function submitAssignFilter() {
    roleDetails();
    siteDetails();
    settoasterServerity("");
    settoasterErrorMessageType("");
    var filterData = searchformData;
    filterData.designationId = designationMasterData.id;
    // filterData.primaryGroupId = CountryMasterData.id;
    filterData.siteId = SiteMasterData;
    // filterData.primaryGroupId = BusinessTeamMasterData.id;
    // filterData.primaryGroupId = userList.id;
    filterData.primaryGroupId = "39fb08236ef55c92cc584c03875a6007";
    filterData.roleIds = BusinessUserRoleMasterData;
    console.log(filterData);
    return false;
    setshowLoadder(true);
    UsersApi.ListApplicationUsersForTeams(filterData)
      .then((result) => {
        setApplicationUsers(result);
        setshowLoadder(false);
        setModalOpen(false);
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
        setshowLoadder(false);
      });
  }

  function assignUsers() {
    setshowLoadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    let finalUsers = [];
    selectedUsers.map((user) => {
      finalUsers.push({ id: applicationUsers[user.dataIndex].id });
    });
    var data = formData;
    data.groupId = userGroupUpdateid;
    data.applicationUserIds = finalUsers;

    UserGroupApi.assignUserGroups(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Assigned User Group as Primary Group of users.");
        settoasterServerity("success");
        setTimeout(() => {
          props.history.push("/usergroups/allusergroups");
          setshowLoadder(false);
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
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
        aria-labelledby="form-dialog-title"
        open={Modalopen}
      >
        <DialogTitle id="form-dialog-title" onClose={handleClose}>
          Filters
        </DialogTitle>
        <ValidatorForm className={`global-form`} onSubmit={AssignFiltersForm}>
          <DialogContent dividers>
            {!componentLoadder ? (
              <Grid container spacing={3}>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label className="">User</label>
                  </Grid>
                  <Grid item sm={8}>
                    <Autocomplete
                      id="tags-outlined"
                      options={userList && userList.length > 0 ? userList : []}
                      getOptionLabel={(option) => option.firstName}
                      // defaultValue={UserSelectedDesignationValue}
                      onChange={selectedUser}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select User"
                        />
                      )}
                    />
                    {/* {formFieldValidation.designation ? (
                      <FormHelperText className="error-msg">
                        Please select designation{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )} */}
                  </Grid>
                </Grid>
                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="">Role</label>
                  </Grid>
                  <Grid item xs={8}>
                    <Autocomplete
                      id="tags-outlined"
                      options={
                        BusinessUserRoleMasterData &&
                        BusinessUserRoleMasterData.length > 0
                          ? BusinessUserRoleMasterData
                          : []
                      }
                      getOptionLabel={(option) => option.description}
                      // defaultValue={UserSelectedRoleValue}
                      onChange={handleChangeUserRole}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select user roles"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="">Team</label>
                  </Grid>
                  <Grid item xs={8}>
                    <Autocomplete
                      id="tags-outlined"
                      options={
                        BusinessTeamMasterData &&
                        BusinessTeamMasterData.length > 0
                          ? BusinessTeamMasterData
                          : []
                      }
                      getOptionLabel={(option) => option.name}
                      // defaultValue={UserSelectedTeamValue}
                      onChange={handleChangeTeam}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select user team"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label className="">Designation</label>
                  </Grid>
                  <Grid item sm={8}>
                    <Autocomplete
                      id="tags-outlined"
                      options={
                        designationMasterData &&
                        designationMasterData.length > 0
                          ? designationMasterData
                          : []
                      }
                      getOptionLabel={(option) => option.name}
                      // defaultValue={UserSelectedDesignationValue}
                      onChange={handleChangeUserDesignation}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select designation"
                        />
                      )}
                    />
                    {/* {formFieldValidation.designation ? (
                      <FormHelperText className="error-msg">
                        Please select designation{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )} */}
                  </Grid>
                </Grid>
                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="">Site</label>
                  </Grid>
                  <Grid item xs={8}>
                    <Autocomplete
                      id="tags-outlined"
                      options={
                        SiteMasterData && SiteMasterData.length > 0
                          ? SiteMasterData
                          : []
                      }
                      getOptionLabel={(option) => option.name}
                      // defaultValue={UserSelectSiteValue}
                      onChange={userSelectSite}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select site"
                        />
                      )}
                    />
                    {/* {formFieldValidation.designation ? (
                      <FormHelperText className="error-msg">
                        Please select designation{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )} */}
                  </Grid>
                </Grid>
                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="">Country</label>
                  </Grid>
                  <Grid item xs={8}>
                    <Autocomplete
                      id="tags-outlined"
                      options={CountryMasterData}
                      getOptionLabel={(option) => option.name}
                      onChange={handleChangeCountry}
                      // defaultValue={UserSelectCountrsy}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Country of Residence"
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
              {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
            </Button>
            <Button onClick={handleClose} className="global-cancel-btn">
              Cancel
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
      {componentLoadder ? (
        <ComponentLoadderComponent />
      ) : (
        <>
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
              to={`usergroups/allusergroups`}
              className="inactive"
            >
              User groups
            </LinkTo>
            <LinkTo color="textPrimary" href="#" className="inactive">
              {selectedGroupInfo.groupName}
            </LinkTo>
            <LinkTo color="textPrimary" href="#" className="active">
              Assign Primary Users
            </LinkTo>
          </Breadcrumbs>
          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              title={""}
              data={applicationUsers ? applicationUsers : []}
              columns={columns}
              options={options}
              className="global-table table-wo-action"
            />
          </MuiThemeProvider>

          <Grid container>
            <Grid item xs={12} className={`global-form inner-table-buttons`}>
              <div className={`form-buttons-container`}>
                <Button
                  variant="contained"
                  type="button"
                  className="global-submit-btn"
                  disabled={showLoadder}
                  onClick={assignUsers}
                >
                  {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
                </Button>
                <Button
                  variant="contained"
                  type="reset"
                  onClick={() =>
                    BreadcrumbNavigation("/usergroups/allusergroups")
                  }
                  className="global-cancel-btn"
                >
                  Cancel
                </Button>
              </div>
            </Grid>
          </Grid>
        </>
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

AddPrimaryUserToUserGroups.propTypes = {
  UserData: PropTypes.array.isRequired,
  LoadAllUser: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    UserData: state.user,
  };
}

const mapDispatchToProps = {
  LoadAllUser: UserAction.loadUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPrimaryUserToUserGroups);
