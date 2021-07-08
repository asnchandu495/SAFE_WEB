import React, { Fragment, useState, useEffect, useRef } from "react";
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
import { makeStyles } from "@material-ui/core/styles";
import CovidStateApiServices from "../../services/masterDataService";
import * as UserGroupAction from "../../Redux/Action/userGroupAction";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import ReplayIcon from "@material-ui/icons/Replay";
import * as GridAction from "../../Redux/Action/gridAction";

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

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: 25,
  },
  stepButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    marginBottom: -3,
    width: 20,
    height: 20,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
    margin: 0,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  errorSpanMsg: {
    color: "red",
  },
  HideGrid: {
    display: "none",
  },
}));

function AddPrimaryUserToUserGroups(props) {
  const anchorRef = useRef(null);

  const usergroupACM = props.acmData.find((acm) => {
    return acm.module == "userGroup";
  });

  const userId = props.match.params.id;
  const classes = useStyles();
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

  const [Modalsubmit, setModalsubmit] = useState(false);
  const [ShowYesLoadder, setshowYesLoadder] = useState(false);
  const [showsubmitLoadder, setshowsubmitLoadder] = useState(false);
  const [dialogshowLoadder, setdialogshowLoadder] = useState(false);
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

  const [RoleMasterData, setRoleMasterData] = useState([]);

  const [UserGroupData, setUserGroupData] = useState();
  const [covidStatelist, setcovidStatelist] = useState();
  const [BusinessDesingationData, setBusinessDesingationData] = useState();

  const [BusinessSiteMasterData, setBusinessSiteMasterData] = useState();
  const [BusinessGroupData, setBusinessGroupData] = useState();
  const [BusinessCovidStateData, setBusinessCovidStateData] = useState();
  const CovidStateApi = new CovidStateApiServices();

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

  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  useEffect(() => {
    if (userGroupUpdateid) {
      Promise.all([
        UsersApi.ListPrimaryApplicationUsers(),
        masterDataCallApi.getDesignations(),
        masterDataCallApi.getCountries(),
        masterDataCallApi.getTeams(),
        masterDataCallApi.getSites(),
        UserGroupApi.loadUserGroup(),
        CovidStateApi.getCOVIDStates(),
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
            getUserGroup,

            getCovidState,
            getUserRoles,
            groupInfo,
            applicationUsers,
          ]) => {
            let primaryUsers = groupInfo.primaryapplicationuserDetails;
            setuserList(getUserList);
            // setdesignationMasterData(getDesignations);
            // setCountryMasterData(getCountries);
            // setBusinessTeamMasterData(getTeams);
            // setSiteMasterData(getSites);
            // setBusinessUserRoleMasterData(getUserRoles);
            setBusinessUserRoleMasterData(getUserRoles);
            setBusinessDesingationData(getDesignations);
            setBusinessSiteMasterData(getSites);
            setBusinessGroupData(getUserGroup);
            setBusinessCovidStateData(getCovidState);
            setSelectedGroupInfo(groupInfo);

            const newArr1 = applicationUsers.map(v => ({ ...v, isSelected: primaryUsers.some((u) => u.id === v.id) }))

            setApplicationUsers(newArr1);
            var selectedUsersToGroupArray = [];

            applicationUsers.map((user, i) => {
              const found = primaryUsers.some((u) => u.id === user.id);
              if (found) {
                selectedUsersToGroupArray.push(i);
              }
            });
            setSelectedUsersToGroup(selectedUsersToGroupArray);
            setComponentLoadder(false);
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
    jumpToPage: true,
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
      pagination: {
        jumpToPage: "Go to page:",
      },
    },

    customToolbarSelect: (value, tableMeta, updateValue) => { },
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
      label: "selected",
      name: "isSelected",
      options: {
        display: "excluded",
        print: false,
        filter: false,
        sort: true,
        sortDirection: 'asc'
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

  const LoadActions = (props) => {
    return props.modulePermission.map((entity) => {
      switch (entity.entity) {
        case "assignPrimary":
          return entity.isAccess ? (
            <Button
              variant="contained"
              type="button"
              className="global-submit-btn"
              disabled={showLoadder}
              onClick={assignUsers}
            >
              {showsubmitLoadder ? <ButtonLoadderComponent /> : "Submit"}
            </Button>
          ) : (
            ""
          );
          break;

        default:
          return "";
      }
    });
  };

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

  function resetFilterForm() {
    setRoleMasterData([]);
    setdesignationMasterData();
    setSiteMasterData([]);
    setUserGroupData();
    setcovidStatelist();
  }

  function AssignFiltersForm() {
    if (searchformData) {
      submitAssignFilter();
    } else {
      submitAssignFilter(false);
      return false;
    }
  }

  function handleClickViewUsers() {
    let value = userId;
    props.history.push("/usergroups/view-usergroup/" + value);
  }

  function AssignFiltersForm() {
    setshowLoadder(true);
    let userfilterData = searchformData;
    if (RoleMasterData.length > 0) {
      let roleArr = RoleMasterData.map((item) => item.id);
      userfilterData.roleIds = roleArr;
    } else {
      userfilterData.roleIds = [];
    }

    if (SiteMasterData.length > 0) {
      let siteArr = SiteMasterData.map((item) => item.id);
      userfilterData.siteId = siteArr;
    } else {
      userfilterData.siteId = [];
    }

    if (designationMasterData) {
      userfilterData.designationId = designationMasterData.id;
    } else {
      userfilterData.designationId = "";
    }

    if (UserGroupData) {
      userfilterData.primaryGroupId = UserGroupData.id;
    } else {
      userfilterData.primaryGroupId = "";
    }

    if (covidStatelist) {
      userfilterData.covidStateId = covidStatelist.id;
    } else {
      userfilterData.covidStateId = "";
    }

    // setshowLoadder(true);
    setdialogshowLoadder(true);
    props
      .LoadAllUser(userfilterData)
      .then((result) => {
        setshowLoadder(false);
        setdialogshowLoadder(false);
        setApplicationUsers(result);
        setModalOpen(false);
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
        setshowLoadder(false);
      });
  }
  function handleChangeUserRole(e, value) {
    setRoleMasterData(value);
  }
  function handleChangeUserDesignation(e, value) {
    setdesignationMasterData(value);
  }
  function userSelectSite(e, value) {
    setSiteMasterData(value);
  }
  function usergroupSelect(e, value) {
    setUserGroupData(value);
  }
  function covidStateSelect(e, value) {
    setcovidStatelist(value);
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
  const handlesubmitClose = () => {
    setModalsubmit(false);
    setshowLoadder(false);
    setshowsubmitLoadder(false);
  };

  function assignUsers() {
    setshowsubmitLoadder(true);
    setModalsubmit(true);
  }
  function handleClickYes() {
    setshowYesLoadder(true);
    setshowsubmitLoadder(false);
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
        setToasterMessage("Changes updated successfully.");
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
        onClose={handlesubmitClose}
        aria-labelledby="customized-dialog-title"
        open={Modalsubmit}
        className="global-dialog confirmation-dialog global-form"
      >
        <DialogTitle id="customized-dialog-title" onClose={handlesubmitClose}>
          Assign user
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            FAQ, Questionnaire, Emergency Contact and Workflow assigned to this user group, will be applicable for the selected user(s). Are you sure you want to go ahead with the change ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handlesubmitClose}
            className="no-button"
            disabled={showLoadder}
          >
            No
          </Button>
          <Button
            onClick={handleClickYes}
            className="yes-button"
            disabled={showLoadder}
          >
            {ShowYesLoadder ? <ButtonLoadderComponent /> : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>

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
                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className=""> Group</label>
                  </Grid>
                  <Grid item xs={8}>
                    <Autocomplete
                      id="tags-outlined"
                      options={
                        BusinessGroupData && BusinessGroupData.length > 0
                          ? BusinessGroupData
                          : []
                      }
                      getOptionLabel={(option) => option.groupName}
                      defaultValue={UserGroupData}
                      value={UserGroupData ? UserGroupData : ""}
                      onChange={usergroupSelect}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select Group"
                        />
                      )}
                    />
                    {""}
                  </Grid>
                </Grid>
                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="">Roles </label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={
                          BusinessUserRoleMasterData &&
                            BusinessUserRoleMasterData.length > 0
                            ? BusinessUserRoleMasterData
                            : []
                        }
                        getOptionLabel={(option) => option.description}
                        defaultValue={RoleMasterData}
                        value={RoleMasterData.length ? RoleMasterData : []}
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
                      {""}
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label className="">Designation</label>
                  </Grid>
                  <Grid
                    item
                    sm={8}
                  // className={[userId ? classes.HideGrid : ""].join(" ")}
                  >
                    <Autocomplete
                      id="tags-outlined"
                      options={
                        BusinessDesingationData &&
                          BusinessDesingationData.length > 0
                          ? BusinessDesingationData
                          : []
                      }
                      getOptionLabel={(option) => option.name}
                      defaultValue={designationMasterData}
                      value={designationMasterData ? designationMasterData : ""}
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
                    {""}
                  </Grid>
                </Grid>

                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="">Site</label>
                  </Grid>
                  <Grid item xs={8}>
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={
                        BusinessSiteMasterData &&
                          BusinessSiteMasterData.length > 0
                          ? BusinessSiteMasterData
                          : []
                      }
                      getOptionLabel={(option) => option.name}
                      defaultValue={SiteMasterData}
                      value={SiteMasterData.length ? SiteMasterData : []}
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
                    {""}
                  </Grid>
                </Grid>

                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="">Covid State</label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
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
                        value={covidStatelist ? covidStatelist : ""}
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
                      {""}
                    </FormControl>
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
              {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
            </Button>

            <Button onClick={handleClose} className="global-cancel-btn">
              Cancel
            </Button>
          </DialogActions>{" "}
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
              to={`/usergroups/allusergroups`}
              className="inactive"
            >
              User groups
            </LinkTo>
            <LinkTo
              color="textPrimary"
              onClick={handleClickViewUsers}
              className="inactive"
            >
              {selectedGroupInfo.groupName}
            </LinkTo>
            <LinkTo
              color="textPrimary"
              style={{ cursor: "default" }}
              className="active"
            >
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
                {usergroupACM ? <LoadActions
                  modulePermission={usergroupACM.permissions}
                  anchorRef={anchorRef}
                ></LoadActions> : ""}

                {/* <Button
                  variant="contained"
                  type="button"
                  className="global-submit-btn"
                  disabled={showLoadder}
                  onClick={assignUsers}
                >
                  {showsubmitLoadder ? <ButtonLoadderComponent /> : "Submit"}
                </Button> */}
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
  UserGroupData: PropTypes.array.isRequired,
  LoadAllUser: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    UserGroupData: state.usergroup,
    acmData: state.acmData,
  };
}

const mapDispatchToProps = {
  LoadAllUser: UserAction.loadUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPrimaryUserToUserGroups);
