import React, { Fragment, useState, useEffect, useRef } from "react";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import VisibilityIcon from "@material-ui/icons/Visibility";
import MuiAlert from "@material-ui/lab/Alert";
import AddIcon from "@material-ui/icons/Add";
import ConfirmationDialog from "../common/confirmdialogbox";
import ToasterMessageComponent from "../common/toaster";
import { connect } from "react-redux";
import * as UserGroupAction from "../../Redux/Action/userGroupAction";
import PropTypes from "prop-types";
import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
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

function UserGroups(props) {
  const anchorRef = useRef(null);
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("300px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    Promise.all([props.LoadAllUserGroup(), props.LoadGridsPage()])

      .then(([result, gridResult]) => {
        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  /**
   * Handle click delete user group
   * Method to delete a usergroup from the table
   * @param  {} value-usergroup id
   */
  function handleClickDeleteUserGrup(value) {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteUserGroup");
    setConfirmationHeaderTittle("Delete User Group");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${value[1]} ?`
    );
  }
  /**
   * Handle rows per page change
   * Method on display no of rows per page on change of dropdown
   * @param  {} rowsPerPage
   */
  function handleRowsPerPageChange(rowsPerPage) {
    setCurrentRowsPerPage(rowsPerPage);
  }
  /**
   * Table initiate
   * Initiate the table based on props grid data(Based logged role rights)
   */
  const tableInitiate = () => {
    let thisPage = props.GridData.find((g) => {
      return g.name == "userGroups";
    });

    if (thisPage) {
      setCurrentPage(thisPage.page - 1);
    } else {
      return 0;
    }
  };

  //set the MUI table options
  const options = {
    filter: false,
    filterType: "dropdown",
    selectableRows: false,
    responsive: "scroll",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: currentRowsPerPage,
    onChangeRowsPerPage: handleRowsPerPageChange,
    jumpToPage: true,
    page: currentPage,
    onChangePage: (currentPage) => {
      setCurrentPage(currentPage);
      let sendData = { name: "userGroups", page: currentPage + 1 };
      props.UpdateGridsPage(sendData);
    },
    onTableInit: tableInitiate,
    print: false,
    viewColumns: false,
    download: false,
    textLabels: {
      body: {
        noMatch: "There are no user groups",
      },
      pagination: {
        jumpToPage: "Go to page:",
      },
    },
    // customToolbar: () => {
    //     return <UserGroupAddButton />;
    //   },
  };

  //set the MUI table columns
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
      name: "groupName",
      label: "User Group",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "uniqueKey",
      label: "Group ID",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      label: "Actions",
      name: "",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          let usergroupACM = props.acmData.find((acm) => {
            return acm.module == "userGroup";
          });

          if (thisRowData && usergroupACM) {
            return (
              <div className={`action-buttons-container`}>
                <LoadActions
                  thisRowData={thisRowData}
                  modulePermission={usergroupACM.permissions}
                  anchorRef={anchorRef}
                ></LoadActions>
              </div>
            );
          }
        },
        setCellProps: (value) => {
          return {
            style: { width: "250px", minWidth: "200px" },
          };
        },
      },
    },
  ];
  /**
   * Load Actions
   * Method to display the table action icons based on permission or user  rights
   * @param  {} props
   */
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
                onClick={() => handleClickViewUserGroup(props.thisRowData)}
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
                  onClick={() => handleClickUpdateUserGroup(props.thisRowData)}
                ></Button>
              </Tooltip>
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
                onClick={() => handleClickDeleteUserGrup(props.thisRowData)}
              ></Button>
            </Tooltip>
          ) : (
            ""
          );
          break;
        case "assignPrimaryList":
          return entity.isAccess ? (
            <Tooltip title="Assign Users As Primary Group">
              <Button
                variant="contained"
                color="default"
                startIcon={<GroupAddIcon />}
                className={`edit-icon`}
                onClick={() =>
                  handleClickaddedprimaryusertousergroup(props.thisRowData)
                }
              ></Button>
            </Tooltip>
          ) : (
            ""
          );
          break;
        case "assignSecondaryList":
          return entity.isAccess ? (
            <Tooltip title="Assign Users As Secondary Group">
              <Button
                variant="contained"
                color="default"
                startIcon={<GroupAddIcon />}
                className={`delete-icon`}
                onClick={() =>
                  handleClickaddedsecondaryusertousergroup(props.thisRowData)
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
  //Method to redirect on click of cancel of breadcrumb link
  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }
  /**
   * Handle click update user group
   * Method on click of edit button
   * @param  {} value-usergroupid
   */
  function handleClickUpdateUserGroup(value) {
    var groupId = value[0];
    props.history.push("/usergroups/update-usergroup/" + groupId);
  }
  /**
   * Handle click add primary to usergroup
   * Method to add primary user to uergroup
   * @param  {} value-usergroupID
   */
  function handleClickaddedprimaryusertousergroup(value) {
    var groupId = value[0];
    props.history.push("/usergroups/add-primaryuser-to-usergroup/" + groupId);
  }
  /**
   * Handle click add primary to usergroup
   * Method to add secondary user to uergroup
   * @param  {} value-usergroupID
   */
  function handleClickaddedsecondaryusertousergroup(value) {
    var groupId = value[0];
    props.history.push("/usergroups/add-secondaryuser-to-usergroup/" + groupId);
  }
  /**
   * Handle click view usergroup
   * Method to redirect to view usergroup component on click of view icon
   * @param  {} value
   */
  function handleClickViewUserGroup(value) {
    var groupId = value[0];
    props.history.push("/usergroups/view-usergroup/" + groupId);
  }

  return (
    <div className="innerpage-container">
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
              aria-current="page"
              className="active"
            >
              User Groups
            </LinkTo>
          </Breadcrumbs>

          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              title={""}
              data={props.UserGroupData ? props.UserGroupData : []}
              columns={columns}
              options={options}
              className="global-table"
            />
          </MuiThemeProvider>
        </>
      )}

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
    </div>
  );
}
//Validate the data recieved from the props
UserGroups.propTypes = {
  UserGroupData: PropTypes.array.isRequired,
  LoadAllUserGroup: PropTypes.func.isRequired,
  getGridsPages: PropTypes.func.isRequired,
  gridState: PropTypes.array.isRequired,
  updateGridsPages: PropTypes.func.isRequired,
};
//Update the redux the store and merge them into props
function mapStateToProps(state, ownProps) {
  return {
    UserGroupData: state.usergroup,
    GridData: state.gridHistory,
    acmData: state.acmData,
  };
}
// Customizing the functions your component receives, and how they dispatch actions
const mapDispatchToProps = {
  LoadAllUserGroup: UserGroupAction.loadUserGroup,
  LoadGridsPage: GridAction.getGridsPages,
  UpdateGridsPage: GridAction.updateGridsPages,
};
//Connect the component with redux store
export default connect(mapStateToProps, mapDispatchToProps)(UserGroups);
