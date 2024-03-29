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

//Styling for mui theme defined here
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
  const anchorRef = useRef(null);
  const teamACM = props.acmData.find((acm) => {
    return acm.module == "team";
  });
  console.log(teamACM ? teamACM.permissions : "kjk");
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
  const [showsubmitLoadder, setshowsubmitLoadder] = useState(false);

  const [applicationUsers, setApplicationUsers] = useState([]);
  const [selectedTeamInfo, setSelectedTeamInfo] = useState();
  const [selectedUsersToGroup, setSelectedUsersToTeam] = useState([]);
  const [openAssignTeamModal, setopenAssignTeamModal] = useState(false);
  const [SelectedRowId, setSelectedRowId] = useState("");

  const [designationMasterData, setdesignationMasterData] = useState();
  const [userGroupList, setuserGroupList] = useState();

  const [Modalopen, setModalOpen] = useState(false);
  const [Modalsubmit, setModalsubmit] = useState(false);
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
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);

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
          // setApplicationUsers(applicationUsers);
          setSelectedTeamInfo(teamInfo);
          setdesignationMasterData(getDesignations);
          setuserGroupList(getUserList);

          const newArr1 = applicationUsers.map((v) => ({
            ...v,
            isSelected: primaryUsers.some((u) => u.id === v.id),
          }));

          setApplicationUsers(newArr1);

          var selectedUsersToGroupArray = [];

          applicationUsers.map((user, i) => {
            const found = primaryUsers.some((u) => u.id === user.id);
            if (found) {
              selectedUsersToGroupArray.push(i);
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

  /**
   * Handle rows per page change
   * Method on display no of rows per page on change of dropdown
   * @param  {} rowsPerPage
   */
  function handleRowsPerPageChange(rowsPerPage) {
    setCurrentRowsPerPage(rowsPerPage);
  }

  //set the options for the MUI datatable
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
        jumpToPage: "Go to page:",
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

  //set the column for the MUI datatable
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
        sortDirection: "asc",
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

  //Method to redirect on click of cancel of breadcrumb link
  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  //Method to open the popup modal
  const handleClickOpenModal = () => {
    setModalOpen(true);
  };
  //Method to close the popup modal
  const handleClose = () => {
    setModalOpen(false);
  };
  //Method to reset the form on click of refresh button
  function resetFilterForm() {
    setselectedUserData("");
    setselectedUserDesignation("");
  }

  //Method to assign a user to  team
  function assignUsers() {
    setModalsubmit(true);
    setshowsubmitLoadder(true);
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
        setToasterMessage(`Users updated to team ${selectedTeamInfo.name}`);
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

  //Method on  change of user dropdown from the form
  function selectedUser(e, value) {
    setselectedUserData(value);
  }
  //Method on change of designation dropdown
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

  /**
   * Load Actions
   * Method to display the table action icons based on permission or user  rights
   * @param  {} props
   */
  const LoadActions = (props) => {
    return props.modulePermission.map((entity) => {
      switch (entity.entity) {
        case "assignUser":
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

  //Method on click of submit to assign a user to team
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
                        value={selectedUserData ? selectedUserData : ""}
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
                        value={
                          selectedUserDesignation ? selectedUserDesignation : ""
                        }
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
                        value={selectedUserData ? selectedUserData : ""}
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
                        value={
                          selectedUserDesignation ? selectedUserDesignation : ""
                        }
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
            <LinkTo
              color="textPrimary"
              href="#"
              to={`/teams/view-team/` + teamId}
              className="inactive"
            >
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
                <LoadActions
                  modulePermission={teamACM.permissions}
                  anchorRef={anchorRef}
                ></LoadActions>

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
//Validates the data received from the props
AddPrimaryUserTeam.propTypes = {
  UserData: PropTypes.array.isRequired,
  LoadAllUser: PropTypes.func.isRequired,
};
//Update redux store and merge them into props
function mapStateToProps(state, ownProps) {
  return {
    UserData: state.user,
    acmData: state.acmData,
  };
}
// Customizing the functions your component receives, and how they dispatch actions
const mapDispatchToProps = {
  LoadAllUser: UserAction.loadUser,
};
//connects the component with redux store
export default connect(mapStateToProps, mapDispatchToProps)(AddPrimaryUserTeam);
