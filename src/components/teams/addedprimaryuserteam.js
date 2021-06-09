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
import teamService from "../../services/teamService";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";

import ConfirmationDialog from "../common/confirmdialogbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";

import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import Autocomplete from "@material-ui/lab/Autocomplete";
import FormHelperText from "@material-ui/core/FormHelperText";
import MasterService from "../../services/masterDataService";
import UserGroupService from "../../services/userGroupService";
import FormControl from "@material-ui/core/FormControl";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import MuiDialogTitle from "@material-ui/core/DialogTitle";

import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ChangeStatusIcon from "@material-ui/icons/SyncAlt";
import ReplayIcon from "@material-ui/icons/Replay";

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

function AddPrimaryUserTeam(props) {
  const teamApiCall = new teamService();
  const teamId = props.match.params.id;
  const UserGroupApi = new UserGroupApiServices();
  const UsersApi = new UserService();
  const masterDataCallApi = new MasterService();
  const UserGroup = new UserGroupService();

  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("300px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formData, setFormData] = useState({
    teamId: "",
    users: [],
  });
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [applicationUsers, setApplicationUsers] = useState([]);
  const [selectedTeamInfo, setSelectedTeamInfo] = useState();
  const [selectedUsersToGroup, setSelectedUsersToTeam] = useState([]);
  const [openAssignTeamModal, setopenAssignTeamModal] = useState(false);
  const [SelectedRowId, setSelectedRowId] = useState("");

  const [designationMasterData, setdesignationMasterData] = useState();
  const [userGroupList, setuserGroupList] = useState();

  const [Modalopen, setModalOpen] = useState(false);

  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [openAssignEmergencyContactModal, setopenAssignEmergencyContactModal] =
    useState(false);
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");

  const [selectedUserData, setselectedUserData] = useState();
  const [selectedUserDesignation, setselectedUserDesignation] = useState();
  const [searchformData, setsearchformData] = useState({
    primaryGroupId: "",
    designationId: "",
    covidStateId: "",
    roleIds: [],
    siteId: [],
  });

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
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
    if (teamId) {
      Promise.all([
        teamApiCall.viewApplicationUserByTeamId(teamId),
        UsersApi.ListApplicationUsersForTeams(searchformData),
        masterDataCallApi.getDesignations(),
        UserGroup.loadUserGroup(),
      ])
        .then(([teamInfo, applicationUsers, getDesignations, getUserList]) => {
          let primaryUsers = teamInfo.users;
          setApplicationUsers(applicationUsers);
          setSelectedTeamInfo(teamInfo);
          setdesignationMasterData(getDesignations);
          setuserGroupList(getUserList);
          setComponentLoadder(false);
          var selectedUsersToGroupArray = [];

          applicationUsers.map((user, i) => {
            const found = primaryUsers.some((u) => u.id === user.id);
            if (found) {
              selectedUsersToGroupArray.push(i);
            } else {
              console.log("error");
            }
          });
          setSelectedUsersToTeam(selectedUsersToGroupArray);
          setComponentLoadder(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const options = {
    filter: false,
    filterType: "dropdown",
    responsive: "scroll",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: 5,
    jumpToPage: true,
    print: false,
    viewColumns: false,
    download: false,
    disableToolbarSelect: true,
    selectableRows: "multiple",
    rowsSelected: selectedUsersToGroup,
    onRowSelectionChange: (currentRowSelected, allRowsSelected) => {
      setSelectedUsers(allRowsSelected);
      var selectedUsersToGroupArray = [];
      allRowsSelected.map((user, i) => {
        selectedUsersToGroupArray.push(user.dataIndex);
      });
      setSelectedUsersToTeam(selectedUsersToGroupArray);
    },

    textLabels: {
      selectedRows: {
        text: "user(s) added to team",
      },
      body: {
        noMatch: "There are no users",
      },
      pagination: {
        jumpToPage: "Goto page:",
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
      name: "firstName",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      label: "User ID",
      name: "userId",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "emailID",
      label: "Email ID",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  const handleClickOpenModal = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  function resetFilterForm() {}
  function assignUsers() {
    setshowLoadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    let finalUsers = [];
    selectedUsers.map((user) => {
      finalUsers.push({ id: applicationUsers[user.dataIndex].id });
    });
    var data = formData;

    data.teamId = teamId;
    data.users = finalUsers;

    teamApiCall
      .assignUserGroups(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Users added to Team");
        settoasterServerity("success");
        setTimeout(() => {
          props.history.push("/teams/allteams");
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

  function selectedUser(e, value) {
    setselectedUserData(value);
  }

  function selectedDesignation(e, value) {
    setselectedUserDesignation(value);
  }

  // function AssignFiltersForm() {
  //   if (searchformData) {
  //     submitAssignTeams();
  //   } else {
  //     submitAssignTeams(false);
  //     return false;
  //   }
  // }

  function AssignFiltersForm() {
    settoasterServerity("");
    settoasterErrorMessageType("");
    var teamData = searchformData;

    if (selectedUserDesignation) {
      teamData.designationId = selectedUserDesignation.id;
    }
    if (selectedUserData) {
      teamData.primaryGroupId = selectedUserData.id;
    }
    setshowLoadder(true);
    UsersApi.ListApplicationUsersForTeams(teamData)
      .then((result) => {
        setApplicationUsers(result);
        setshowLoadder(false);
        setModalOpen(false);
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
      {/* <Dialog open={Modalopen} onClose={handleClose} aria-labelledby="form-dialog-title"> */}
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
                    <label className="">User Group </label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <Autocomplete
                        id="tags-outlined"
                        options={
                          userGroupList && userGroupList.length > 0
                            ? userGroupList
                            : []
                        }
                        getOptionLabel={(option) => option.groupName}
                        defaultValue={selectedUserData}
                        onChange={selectedUser}
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select usergroup"
                          />
                        )}
                      />{" "}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label className="">Designation</label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <Autocomplete
                        id="tags-outlined"
                        options={
                          designationMasterData &&
                          designationMasterData.length > 0
                            ? designationMasterData
                            : []
                        }
                        getOptionLabel={(option) => option.name}
                        defaultValue={selectedUserDesignation}
                        onChange={selectedDesignation}
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select designation"
                          />
                        )}
                      />{" "}
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
              to={`/teams/allteams`}
              className="inactive"
            >
              Teams
            </LinkTo>
            <LinkTo color="textPrimary" href="#" className="inactive">
              {selectedTeamInfo.name}
            </LinkTo>
            <LinkTo color="textPrimary" href="#" className="active">
              Assign Users
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
                  onClick={() => BreadcrumbNavigation("/teams/allteams")}
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

AddPrimaryUserTeam.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(AddPrimaryUserTeam);
