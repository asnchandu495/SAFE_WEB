import React, { Fragment, useState, useEffect, useRef } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { makeStyles } from "@material-ui/core/styles";
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
import GlobalSettingService from "../../services/globalSettingService";
import UserGroupService from "../../services/userGroupService";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import CovidStateApiServices from "../../services/masterDataService";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Pagination from "@material-ui/lab/Pagination";
import ReplayIcon from "@material-ui/icons/Replay";
import * as GridAction from "../../Redux/Action/gridAction";

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

const DisplayFormControl = ({
  viewUserDetailsTemp,
  viewUserDetailsTempUnit,
  loadGlobalSettingsDataTemp,
}) => {
  if (
    viewUserDetailsTemp != "" &&
    viewUserDetailsTempUnit != "" &&
    loadGlobalSettingsDataTemp != ""
  ) {
    if (loadGlobalSettingsDataTemp == viewUserDetailsTempUnit) {
      return viewUserDetailsTemp + "-" + viewUserDetailsTempUnit;
    } else if (loadGlobalSettingsDataTemp != viewUserDetailsTempUnit) {
      if (loadGlobalSettingsDataTemp == "C") {
        let convertedTemp = ((viewUserDetailsTemp - 32) * 5) / 9;
        return <span>{convertedTemp.toFixed(2)}-C</span>;
      } else {
        let convertedTemp = viewUserDetailsTemp * (9 / 5) + 32;
        return <span>{convertedTemp.toFixed(2)}-F</span>;
      }
    } else {
      return viewUserDetailsTemp + "-" + viewUserDetailsTempUnit;
    }
  } else {
    return "";
  }
};

function Users(props) {
  const userId = props.match.params.id;
  const classes = useStyles();
  const usersApiCall = new UserService();
  const masterDataCallApi = new MasterService();
  const GlobalSettingApi = new GlobalSettingService();
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
  const [openuserTemepratureModal, setopenuserTemepratureModal] =
    useState(false);

  const [showLoadder, setshowLoadder] = useState(false);
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [Modalopen, setModalOpen] = useState(false);
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [SelectedRowId, setSelectedRowId] = useState("");
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [reloadPage, setReloadPage] = useState("NO");
  const [selectedUsersForCovidState, setSelectedUsersForCovidState] = useState(
    []
  );
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
  const [applicationUsers, setApplicationUsers] = useState([]);
  const [RowsSelected, setRowsSelected] = useState([]);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [globalData, setglobalData] = useState();
  const [searchformData, setsearchformData] = useState({
    primaryGroupId: "",
    designationId: "",
    covidStateId: "",
    roleIds: [],
    siteId: [],
  });
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [userData, setUserData] = useState([]);
  const [modulePermission, setModulePermission] = useState([]);
  const [updateInfo, setUpdateInfo] = useState();
  const [updateShiftInfo, setUpdateShiftInfo] = useState();
  const [updateCovidInfo, setUpdateCovidInfo] = useState();
  const [updateTemperatureInfo, setUpdateTemperatureInfo] = useState();

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
    if (prevOpen.current === true && openMoreMenu === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = openMoreMenu;
    setcomponentLoadder(true);

    Promise.all([
      props.LoadAllUser(searchformData),
      masterDataCallApi.getUserPrimaryRoles(),
      masterDataCallApi.getDesignations(),
      masterDataCallApi.getSites(),
      UserGroupApi.loadUserGroup(),
      CovidStateApi.getCOVIDStates(),
      GlobalSettingApi.getLoadGlobalSetting(),
      props.LoadGridsPage(),
    ])
      .then(
        ([
          result,
          getUserRoles,
          getDesignations,
          getSites,
          getUserGroup,
          getCovidState,
          getLoadGlobalSetting,
          gridResult,
        ]) => {
          setReloadPage("NO");
          setBusinessUserRoleMasterData(getUserRoles);
          setBusinessDesingationData(getDesignations);
          setBusinessSiteMasterData(getSites);
          setBusinessGroupData(getUserGroup);
          setBusinessCovidStateData(getCovidState);
          setglobalData(getLoadGlobalSetting);
          setUserData(props.UserData);
          let usersACM = props.acmData.find((acm) => {
            return acm.module == "user";
          });
          setUpdateInfo(usersACM.permissions.find(ua => ua.entity == 'update'));
          setUpdateShiftInfo(usersACM.permissions.find(ua => ua.entity == "updateUserShift"));
          setUpdateCovidInfo(usersACM.permissions.find(ua => ua.entity == "updateUserCovidState"));
          setUpdateTemperatureInfo(usersACM.permissions.find(ua => ua.entity == "updateUserTemp"));
          setcomponentLoadder(false);
        }
      )
      .catch((err) => {
      });
  }, [reloadPage]);

  const handleToggleMoreMenu = (thisRowData, e) => {
    setSelectedRowDetails(thisRowData);
    setOpenMoreMenu((prevOpen) => !prevOpen);
    setAnchorElMenu(e.currentTarget);
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
    setAnchorElMenu(null);
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

  function resetFilterForm() {
    setRoleMasterData([]);
    setdesignationMasterData();
    setSiteMasterData([]);
    setUserGroupData();
    setcovidStatelist();
  }

  function AssignFiltersForm() {
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

    setshowLoadder(true);
    props
      .LoadAllUser(userfilterData)
      .then((result) => {
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

  function handleRowsPerPageChange(rowsPerPage) {
    setCurrentRowsPerPage(rowsPerPage);
  }

  const tableInitiate = () => {
    let thisPage = props.GridData.find((g) => {
      return g.name == "users";
    });

    if (thisPage) {
      setCurrentPage(thisPage.page - 1);
    } else {
      return 0;
    }
  };

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
    selectableRows: "multiple",
    disableToolbarSelect: true,
    // rowsSelected: selectedUsersForCovidState,
    jumpToPage: true,
    onRowSelectionChange: (currentRowSelected, allRowsSelected) => {
      var setRowsSelectedArray = [];
      allRowsSelected.map((user, i) => {
        setRowsSelectedArray.push(user.dataIndex);
      });
      setRowsSelected(setRowsSelectedArray);
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
      pagination: {
        jumpToPage: "Go to page:",
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
    customToolbarSelect: (value, tableMeta, updateValue) => { },
    customToolbar: (value, tableMeta, updateValue) => {
      return (
        <div className={`maingrid-actions action-buttons-container`}>
          <Tooltip title="Filter By User">
            <Button
              variant="contained"
              startIcon={<FilterListIcon />}
              className={`add-icon`}
              onClick={handleClickOpenModal}
            ></Button>
          </Tooltip>
          {RowsSelected.length ? (
            <Tooltip title="Update covid state">
              <Button
                variant="contained"
                startIcon={<LocalHospitalIcon />}
                className={`edit-icon`}
                onClick={() => handleClickOpenCovidStateInfoModal()}
              ></Button>
            </Tooltip>
          ) : (
            ""
          )}
          {/* {RowsSelected.length ? (
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
    customSearch: (searchQuery, currentRow, columns) => {
      let isFound = false;
      currentRow.forEach((col) => {
        if (typeof col !== "undefined" && col !== null) {
          if (typeof col === "object") {
            if (col.name) {
              if (col.name.toString().indexOf(searchQuery) >= 0) {
                isFound = true;
              }
            }
            if (col.stateName) {
              if (col.stateName.toString().indexOf(searchQuery) >= 0) {
                isFound = true;
              }
            }
          } else {
            if (col.toString().indexOf(searchQuery) >= 0) {
              isFound = true;
            }
          }
        }
      });

      return isFound;
    },
    // customFooter: (
    //   count,
    //   page,
    //   rowsPerPage,
    //   changeRowsPerPage,
    //   changePage,
    //   textLabels
    // ) => {
    //   return (
    //     <CustomFooter
    //       count={count}
    //       page={page}
    //       rowsPerPage={rowsPerPage}
    //       changeRowsPerPage={changeRowsPerPage}
    //       changePage={changePage}
    //       textLabels={textLabels}
    //       userData={props.UserData}
    //     />
    //   );
    // },
    page: currentPage,
    onChangePage: (currentPage) => {
      setCurrentPage(currentPage);
      let sendData = { name: "users", page: currentPage + 1 };
      props.UpdateGridsPage(sendData);
    },
    onTableInit: tableInitiate,
  };

  const CustomFooter = (props) => {
    return (
      <div className="custom-pagination">
        <Pagination
          count={Math.ceil(props.userData.length / 5)}
          page={currentPage}
          defaultPage={1}
          showFirstButton
          showLastButton
          onChange={handleChangePagination}
        />
      </div>
    );
  };

  const handleChangePagination = (event, value) => {
    let nextSet = value * 5;
    let currentSet = nextSet - 5;
    setCurrentPage(value);
    setUserData(props.UserData.slice(currentSet + 1, nextSet + 1));
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
      name: "covidStateDetails",
      label: "Covid State",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData && thisRowData[6] != null) {
            return <span>{thisRowData[6].stateName}</span>;
          } else {
            return <span></span>;
          }
        },
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
      name: "userId",
      label: "User ID",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "temperature",
      label: "Temperature ",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData && thisRowData[6]) {
            return (
              <DisplayFormControl
                viewUserDetailsTemp={
                  thisRowData[6] && thisRowData[6].temperature != null
                    ? thisRowData[6].temperature
                    : ""
                }
                viewUserDetailsTempUnit={
                  thisRowData[6] && thisRowData[6].temperatureUnit != null
                    ? thisRowData[6].temperatureUnit
                    : ""
                }
                loadGlobalSettingsDataTemp={
                  globalData ? globalData.temperatureUnit : ""
                }
              ></DisplayFormControl>
            );
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

          let usersACM = props.acmData.find((acm) => {
            return acm.module == "user";
          });

          if (thisRowData) {
            return (
              <div className={`action-buttons-container`}>
                <LoadActions
                  thisRowData={thisRowData}
                  modulePermission={usersACM.permissions}
                  anchorRef={anchorRef}
                  openMoreMenu={openMoreMenu}
                ></LoadActions>
                {updateInfo && updateInfo.isAccess || updateShiftInfo && updateShiftInfo.isAccess || updateCovidInfo && updateCovidInfo.isAccess || updateTemperatureInfo && updateTemperatureInfo.isAccess ? <Tooltip title="More">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<MoreHorizIcon />}
                    className={`more-icon`}
                    ref={anchorRef}
                    aria-controls={openMoreMenu ? "menu-list-grow" : undefined}
                    aria-haspopup="true"
                    onClick={(e) => handleToggleMoreMenu(thisRowData, e)}
                  ></Button>
                </Tooltip> : ""}

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

  const LoadActions = (props) => {
    return props.modulePermission.map((entity) => {
      switch (entity.entity) {
        case "view":
          return entity.isAccess ? (
            <Tooltip title="View">
              <Button
                variant="contained"
                color="default"
                startIcon={<VisibilityIcon />}
                className={`view-icon`}
                onClick={() => handleClickViewUsers(props.thisRowData[0])}
              ></Button>
            </Tooltip>
          ) : (
            ""
          );
          break;
        case "update":
          return entity.isAccess ? (
            <>
              <Tooltip title="Edit">
                <Button
                  variant="contained"
                  color="default"
                  startIcon={<EditIcon />}
                  className={`edit-icon`}
                  onClick={() => handleClickUpdateUser(props.thisRowData)}
                ></Button>
              </Tooltip>
              {/* <Tooltip title="More">
              <Button
                variant="contained"
                color="default"
                startIcon={<MoreHorizIcon />}
                className={`more-icon`}
                ref={props.anchorRef}
                aria-controls={props.openMoreMenu ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={(e) => handleToggleMoreMenu(props.thisRowData, e)}
              ></Button>
            </Tooltip> */}
            </>
          ) : (
            ""
          );
          break;
        case "delete":
          return entity.isAccess ? (
            <Tooltip title="Delete">
              <Button
                variant="contained"
                color="default"
                startIcon={<DeleteIcon />}
                className={`delete-icon`}
                onClick={() =>
                  handleClickOpenConfirmationModal(props.thisRowData)
                }
              ></Button>
            </Tooltip>
          ) : (
            ""
          );
          break;
        default:
          return "";
      }
    });
  };

  const handleClickOpenConfirmationModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeactiveUser");
    setConfirmationHeaderTittle("Delete User");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${value[3]} ?`
    );
  };

  const handleClickOpenConfirmationModalDelete = (value) => {
    var idArray = [];
    value.map((user, i) => {
      idArray.push(user);
    });
    var idArraycount = idArray.length;
    var finalData = JSON.stringify(idArray);

    setSelectedRowDetails(finalData);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteMultipleUser");
    setConfirmationHeaderTittle("Delete User");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${idArraycount} user?`
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
                      defaultValue={UserGroupData ? UserGroupData : ""}
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
                        defaultValue={
                          RoleMasterData.length ? RoleMasterData : []
                        }
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
                    className={[userId ? classes.HideGrid : ""].join(" ")}
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
                      value={SiteMasterData.length > 0 ? SiteMasterData : []}
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
            // data={userData && userData.length > 0 ? userData.slice(0, 5) : []}
            data={
              props.UserData && props.UserData.length > 0 ? props.UserData : []
            }
            columns={columns}
            options={options}
            className="global-table checkbox-grid"
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
        setRowsSelected={setRowsSelected}
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
        setReloadPage={setReloadPage}
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
        anchorEl={anchorElMenu}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 999 }}
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
                  {updateInfo && updateInfo.isAccess ? <MenuItem onClick={handleClickUpdateUserDetails}>
                    Update Other Details
                  </MenuItem> : ""}
                  {updateCovidInfo && updateCovidInfo.isAccess ? <MenuItem onClick={handleClickOpenCovidStateInfoModal}>
                    Update Covid State
                  </MenuItem> : ""}
                  {updateTemperatureInfo && updateTemperatureInfo.isAccess ? <MenuItem onClick={handleClickOpenUserTempInfoModal}>
                    Update Temperature
                  </MenuItem> : ""}
                  {updateShiftInfo && updateShiftInfo.isAccess ? <MenuItem onClick={handleClickOpenShiftInfoModal}>
                    Update Shift Info
                  </MenuItem> : ""}
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
  getGridsPages: PropTypes.func.isRequired,
  gridState: PropTypes.array.isRequired,
  updateGridsPages: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    UserData: state.user,
    GridData: state.gridHistory,
    acmData: state.acmData,
  };
}

const mapDispatchToProps = {
  LoadAllUser: UserAction.loadUser,
  LoadGridsPage: GridAction.getGridsPages,
  UpdateGridsPage: GridAction.updateGridsPages,
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
