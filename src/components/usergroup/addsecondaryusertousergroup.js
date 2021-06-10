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
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogContent from "@material-ui/core/DialogContent";
import CovidStateApiServices from "../../services/masterDataService";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";
import MasterService from "../../services/masterDataService";
import ReplayIcon from "@material-ui/icons/Replay";
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

function AddSecondaryUserToUserGroups(props) {
  const userGroupUpdateid = props.match.params.id;
  const userId = props.match.params.id;
  const classes = useStyles();

  const UserGroupApi = new UserGroupApiServices();
  const masterDataCallApi = new MasterService();
  const CovidStateApi = new CovidStateApiServices();
  const UsersApi = new UserService();

  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("300px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formData, setFormData] = useState({
    groupId: "",
    isPrimary: false,
    isSecondary: true,
    applicationUserIds: [],
  });
  const [searchformData, setsearchformData] = useState({
    primaryGroupId: "",
    designationId: "",
    covidStateId: "",
    roleIds: [],
    siteId: [],
  });
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [dialogshowLoadder, setdialogshowLoadder] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [showsubmitLoadder, setshowsubmitLoadder] = useState(false);

  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [Modalopen, setModalOpen] = useState(false);
  const [applicationUsers, setApplicationUsers] = useState([]);
  const [selectedGroupInfo, setSelectedGroupInfo] = useState();
  const [selectedUsersToGroup, setSelectedUsersToGroup] = useState([]);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);
  const [designationMasterData, setdesignationMasterData] = useState();
  const [RoleMasterData, setRoleMasterData] = useState([]);
  const [SiteMasterData, setSiteMasterData] = useState([]);
  const [UserGroupData, setUserGroupData] = useState();
  const [covidStatelist, setcovidStatelist] = useState();
  const [BusinessDesingationData, setBusinessDesingationData] = useState();
  const [BusinessUserRoleMasterData, setBusinessUserRoleMasterData] =
    useState();
  const [BusinessSiteMasterData, setBusinessSiteMasterData] = useState();
  const [BusinessGroupData, setBusinessGroupData] = useState();
  const [BusinessCovidStateData, setBusinessCovidStateData] = useState();
  // const [applicationUsers, setApplicationUsers] = useState([]);
  const [selectedUsersForCovidState, setSelectedUsersForCovidState] = useState(
    []
  );

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
        UserGroupApi.getGroupInfo(userGroupUpdateid),
        UsersApi.ListApplicationUsers(),
        masterDataCallApi.getUserPrimaryRoles(),
        masterDataCallApi.getDesignations(),
        masterDataCallApi.getSites(),
        UserGroupApi.loadUserGroup(),
        CovidStateApi.getCOVIDStates(),
      ])
        .then(
          ([
            groupInfo,
            applicationUsers,
            getUserRoles,
            getDesignations,
            getSites,
            getUserGroup,
            getCovidState,
          ]) => {
            let primaryUsers = groupInfo.secondaryapplicationuserDetails;
            setSelectedGroupInfo(groupInfo);
            setApplicationUsers(applicationUsers);
            setBusinessUserRoleMasterData(getUserRoles);
            setBusinessDesingationData(getDesignations);
            setBusinessSiteMasterData(getSites);
            setBusinessGroupData(getUserGroup);
            setBusinessCovidStateData(getCovidState);
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
  const handleClickOpenModal = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  function usergroupSelect(e, value) {
    setUserGroupData(value);
  }

  function handleRowsPerPageChange(rowsPerPage) {
    setCurrentRowsPerPage(rowsPerPage);
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
  function covidStateSelect(e, value) {
    setcovidStatelist(value);
  }
  function resetFilterForm() {
    setRoleMasterData([]);
    setdesignationMasterData();
    setSiteMasterData([]);
    setUserGroupData();
    setcovidStatelist();
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
        setApplicationUsers(result);
        // setshowLoadder(false);
        setdialogshowLoadder(false);
        setModalOpen(false);
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
        setshowLoadder(false);
      });
  }

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
        jumpToPage: "Goto page:",
      },
    },

    customToolbarSelect: (value, tableMeta, updateValue) => {},
    customToolbar: (value, tableMeta, updateValue) => {
      console.log("id");
      console.log(selectedUsersForCovidState);
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
          {/* {RowsSelected.length ? (
            <Tooltip title="Delete">
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                className={`delete-icon`}
                onClick={() =>
                  handleClickOpenConfirmationModalDelete(
                    selectedUsersForCovidState
                  )
                }
              ></Button>
            </Tooltip>
          ) : (
            ""
          )}
          {RowsSelected.length ? (
            <Tooltip title="covidstate">
              <Button
                variant="contained"
                startIcon={<LocalHospitalIcon />}
                className={`edit-icon`}
                // onClick={() => handleClickOpenConfirmationModal(thisRowData)}
              ></Button>
            </Tooltip>
          ) : (
            ""
          )} */}
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

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  function assignUsers() {
    setshowsubmitLoadder(true);
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
        setToasterMessage("Assigned User Group as Secondary Group of users.");
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
                      onChange={handleChangeUserDesignation}
                      value={designationMasterData ? designationMasterData : ""}
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
              to={`usergroups/allusergroups`}
              className="inactive"
            >
              User groups
            </LinkTo>
            <LinkTo color="textPrimary" href="#" className="inactive">
              {selectedGroupInfo.groupName}
            </LinkTo>
            <LinkTo color="textPrimary" href="#" className="active">
              Assign Secondary Users
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
                  {showsubmitLoadder ? <ButtonLoadderComponent /> : "Submit"}
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

AddSecondaryUserToUserGroups.propTypes = {
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
)(AddSecondaryUserToUserGroups);
