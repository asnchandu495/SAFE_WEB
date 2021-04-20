import React, { Fragment, useState, useEffect, useRef } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import ConfirmationDialog from "../common/confirmdialogbox";
import CovidStateInfo from "./updateCovidState";
import ShiftingInfo from "./updateUserShiftingInformation";
import UserTemprature from "./updateUserTemprature";
import ToasterMessageComponent from "../common/toaster";
import { connect } from "react-redux";
import * as UserAction from "../../Redux/Action/userAction";
import PropTypes from "prop-types";
import MoreHorizIcon from "@material-ui/icons/MoreVert";
import VisibilityIcon from "@material-ui/icons/Visibility";
import UserService from "../../services/usersService";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import FilterListIcon from "@material-ui/icons/FilterList";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogContent from "@material-ui/core/DialogContent";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormHelperText from "@material-ui/core/FormHelperText";
import MasterService from "../../services/masterDataService";
import UserGroupService from "../../services/userGroupService";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import CovidStateApiServices from "../../services/masterDataService";
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

function Users(props) {
  const usersApiCall = new UserService();
  const masterDataCallApi = new MasterService();
  const UserGroupApi = new UserGroupService();
  const CovidStateApi = new CovidStateApiServices();
  const [openMoreMenu, setOpenMoreMenu] = useState(false);
  const anchorRef = useRef(null);
  const prevOpen = useRef(openMoreMenu);

  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("300px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openCovidStateInfoModal, setopenCovidStateInfoModal] = useState(false);
  const [openshiftInfoModal, setopenshiftInfoModal] = useState(false);
  const [openuserTemepratureModal, setopenuserTemepratureModal] = useState(
    false
  );
  const [BusinessUserRoleMasterData, setBusinessUserRoleMasterData] = useState(
    []
  );
  const [showLoadder, setshowLoadder] = useState(false);
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [
    ConfirmationDialogContextText,
    setConfirmationDialogContextText,
  ] = useState("");
  const [Modalopen, setModalOpen] = useState(false);
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [SelectedRowId, setSelectedRowId] = useState("");
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [
    ConfirmationModalActionType,
    setConfirmationModalActionType,
  ] = useState("");
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [reloadPage, setReloadPage] = useState("NO");
  const [selectedUsersForCovidState, setSelectedUsersForCovidState] = useState(
    []
  );
  const [designationMasterData, setdesignationMasterData] = useState();
  const [SiteMasterData, setSiteMasterData] = useState([]);
  const [userGroupList, setuserGroupList] = useState();
  const [UserGroupData, setUserGroupData] = useState([]);
  const [covidStatelist, setcovidStatelist] = useState([]);
  useEffect(() => {
    if (prevOpen.current === true && openMoreMenu === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = openMoreMenu;
    setcomponentLoadder(true);
    Promise.all([
      props.LoadAllUser(),
      masterDataCallApi.getUserPrimaryRoles(),
      masterDataCallApi.getDesignations(),
      masterDataCallApi.getSites(),
      UserGroupApi.loadUserGroup(),
      CovidStateApi.getCOVIDStates(),
    ])
      .then(
        ([
          result,
          getUserRoles,
          getDesignations,
          getSites,
          getUserGroup,
          getCovidState,
        ]) => {
          setReloadPage("NO");
          setBusinessUserRoleMasterData(getUserRoles);
          setdesignationMasterData(getDesignations);
          setSiteMasterData(getSites);
          setUserGroupData(getUserGroup);
          setcovidStatelist(getCovidState);
          setcomponentLoadder(false);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  }, [reloadPage]);

  const handleToggleMoreMenu = (thisRowData) => {
    setSelectedRowDetails(thisRowData);
    setOpenMoreMenu((prevOpen) => !prevOpen);
  };

  const handleClickOpenModal = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleCloseMoreMenu = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenMoreMenu(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenMoreMenu(false);
    }
  }

  function handleClickUpdateUser(value) {
    var userId = value[0];
    props.history.push("/users/update-user/" + userId);
  }
  function handleClickViewUsers(value) {
    props.history.push("/users/view-user/" + value);
  }

  function handleClickUpdateUserDetails() {
    var userId = SelectedRowDetails[0];
    props.history.push("/users/update-user-details/" + userId);
  }

  function handleChangeUserRole(e, value) {
    setBusinessUserRoleMasterData(value);
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
    selectableRows: "multiple",
    disableToolbarSelect: true,
    // rowsSelected: selectedUsersForCovidState,
    onRowSelectionChange: (currentRowSelected, allRowsSelected) => {
      var selectedUsersToCovidStateArray = [];
      allRowsSelected.map((user, i) => {
        selectedUsersToCovidStateArray.push(user.dataIndex);
      });
      let finalUsers = [];
      selectedUsersToCovidStateArray.map((user) => {
        finalUsers.push({ id: props.UserData[user].id });
      });
      setSelectedUsersForCovidState(finalUsers);
    },
    textLabels: {
      body: {
        noMatch: "There are no users",
      },
    },

    customToolbar: () => {
      return (
        <span>
          {selectedUsersForCovidState.length > 0 ? (
            <div className={`maingrid-actions`}>
              <Tooltip title="Update covid state">
                <Button
                  variant="contained"
                  startIcon={<LocalHospitalIcon />}
                  className={`update-icon-with-text`}
                  onClick={handleClickOpenCovidStateInfoModal}
                >
                  Update
                </Button>
              </Tooltip>
            </div>
          ) : (
            ""
          )}
        </span>
      );
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
      name: "emailID",
      label: "Email",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "contactNumber",
      label: "Mobile No",
      options: {
        filter: false,
        sort: true,
      },
    },

    {
      name: "covidState",
      label: "Covid state",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "designation",
      label: "Designation",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return <span>{thisRowData[7].name}</span>;
          }
        },
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
                <Tooltip title="Edit">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<EditIcon />}
                    className={`edit-icon`}
                    onClick={() => handleClickUpdateUser(thisRowData)}
                  ></Button>
                </Tooltip>
                <Tooltip title="View">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<VisibilityIcon />}
                    className={`view-icon`}
                    onClick={() => handleClickViewUsers(thisRowData[0])}
                  ></Button>
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<DeleteIcon />}
                    className={`delete-icon`}
                    onClick={() =>
                      handleClickOpenConfirmationModal(thisRowData)
                    }
                  ></Button>
                </Tooltip>
                <Tooltip title="More">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<MoreHorizIcon />}
                    className={`more-icon`}
                    ref={anchorRef}
                    aria-controls={openMoreMenu ? "menu-list-grow" : undefined}
                    aria-haspopup="true"
                    onClick={() => handleToggleMoreMenu(thisRowData)}
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

  const handleClickOpenConfirmationModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeactiveUser");
    setConfirmationHeaderTittle("Delete User");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${value[3]} ?`
    );
  };

  function handleClickOpenCovidStateInfoModal() {
    setopenCovidStateInfoModal(true);
    setSelectedRowId(SelectedRowDetails[0]);
    setOpenMoreMenu(false);
  }

  function handleClickOpenShiftInfoModal() {
    setopenshiftInfoModal(true);
    setSelectedRowId(SelectedRowDetails[0]);
    setOpenMoreMenu(false);
  }

  function handleClickOpenUserTempInfoModal() {
    setopenuserTemepratureModal(true);
    setSelectedRowId(SelectedRowDetails[0]);
    setOpenMoreMenu(false);
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
        <ValidatorForm className={`global-form`} onSubmit="#">
          <DialogContent dividers>
            {!componentLoadder ? (
              <Grid container spacing={3}>
                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="">Roles </label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
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
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label className="">Designation</label>
                  </Grid>
                  <Grid item sm={8}>
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      multiple
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
                    <label className="">User Group</label>
                  </Grid>
                  <Grid item xs={8}>
                    <Autocomplete
                      id="tags-outlined"
                      options={
                        UserGroupData && UserGroupData.length > 0
                          ? UserGroupData
                          : []
                      }
                      getOptionLabel={(option) => option.groupName}
                      // defaultValue={UserSelectSiteValue}
                      onChange={usergroupSelect}
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
                    <label className="">Covid State</label>
                  </Grid>
                  <Grid item xs={8}>
                    <Autocomplete
                      id="tags-outlined"
                      // /options={teamManagers}
                      options={
                        covidStatelist && covidStatelist.length > 0
                          ? covidStatelist
                          : []
                      }
                      getOptionLabel={(option) => option.stateName}
                      onChange={covidStateSelect}
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
              {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
            </Button>
            <Button onClick={handleClose} className="global-cancel-btn">
              Cancel
            </Button>
          </DialogActions>
        </ValidatorForm>
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
        <LinkTo
          color="textPrimary"
          href="#"
          aria-current="page"
          className="active"
        >
          Users
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder ? (
        <ComponentLoadderComponent />
      ) : (
        <MuiThemeProvider theme={theme1}>
          {" "}
          <MUIDataTable
            title={""}
            data={
              props.UserData && props.UserData.length > 0 ? props.UserData : []
            }
            columns={columns}
            options={options}
            className="global-table"
          />
        </MuiThemeProvider>
      )}
      <CovidStateInfo
        openCovidStateInfoModal={openCovidStateInfoModal}
        SelectedRowId={SelectedRowId}
        setopenCovidStateInfoModal={setopenCovidStateInfoModal}
        selectedUsersForCovidState={selectedUsersForCovidState}
        setSelectedUsersForCovidState={setSelectedUsersForCovidState}
        setReloadPage={setReloadPage}
      />
      <ShiftingInfo
        openshiftInfoModal={openshiftInfoModal}
        setopenshiftInfoModal={setopenshiftInfoModal}
        SelectedRowId={SelectedRowId}
      />
      <UserTemprature
        openuserTemepratureModal={openuserTemepratureModal}
        setopenuserTemepratureModal={setopenuserTemepratureModal}
        SelectedRowId={SelectedRowId}
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
      <Popper
        open={openMoreMenu}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper className="user-list-more-options">
              <ClickAwayListener onClickAway={handleCloseMoreMenu}>
                <MenuList id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={handleClickUpdateUserDetails}>
                    Update other details
                  </MenuItem>
                  <MenuItem onClick={handleClickOpenCovidStateInfoModal}>
                    Update covid state
                  </MenuItem>
                  <MenuItem onClick={handleClickOpenUserTempInfoModal}>
                    Update temperature
                  </MenuItem>
                  <MenuItem onClick={handleClickOpenShiftInfoModal}>
                    Update shift info
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}

Users.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Users);
