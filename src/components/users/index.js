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
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [
    ConfirmationDialogContextText,
    setConfirmationDialogContextText,
  ] = useState("");
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
  const [reloadPage, setReloadPage] = useState(false);
  const [selectedUsersForCovidState, setSelectedUsersForCovidState] = useState(
    []
  );

  useEffect(() => {
    if (prevOpen.current === true && openMoreMenu === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = openMoreMenu;

    props
      .LoadAllUser()
      .then((result) => {
        setReloadPage(false);
        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [openMoreMenu, reloadPage]);

  const handleToggleMoreMenu = (thisRowData) => {
    setSelectedRowDetails(thisRowData);
    setOpenMoreMenu((prevOpen) => !prevOpen);
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
      name: "designationName",
      label: "Designation",
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
