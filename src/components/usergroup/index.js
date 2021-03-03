import React, { Fragment, useState, useEffect } from "react";
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
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("300px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [
    ConfirmationDialogContextText,
    setConfirmationDialogContextText,
  ] = useState("");
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
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [componentLoadder, setcomponentLoadder] = useState(true);

  useEffect(() => {
    props
      .LoadAllUserGroup()
      .then((result) => {
        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleClickDeleteUserGrup(value) {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteUserGroup");
    setConfirmationHeaderTittle("Delete User Group");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${value[1]} ?`
    );
  }

  const options = {
    filter: false,
    filterType: "dropdown",
    selectableRows: false,
    responsive: "scroll",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: 5,
    print: false,
    viewColumns: false,
    download: false,
    textLabels: {
      body: {
        noMatch: "There are no user groups",
      },
    },
    // customToolbar: () => {
    //     return <UserGroupAddButton />;
    //   },
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
      name: "groupName",
      label: "User Group",
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
          if (thisRowData) {
            return (
              <div className={`action-buttons-container`}>
                <Tooltip title="Edit">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<EditIcon />}
                    className={`edit-icon`}
                    onClick={() => handleClickUpdateUserGroup(thisRowData)}
                  ></Button>
                </Tooltip>
                <Tooltip title="View">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<VisibilityIcon />}
                    className={`view-icon`}
                    onClick={() => handleClickViewUserGroup(thisRowData)}
                  ></Button>
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<DeleteIcon />}
                    className={`delete-icon`}
                    onClick={() => handleClickDeleteUserGrup(thisRowData)}
                  ></Button>
                </Tooltip>
                <Tooltip title="Assign users as primary group">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<GroupAddIcon />}
                    className={`edit-icon`}
                    onClick={() =>
                      handleClickaddedprimaryusertousergroup(thisRowData)
                    }
                  ></Button>
                </Tooltip>
                <Tooltip title="Assign users as secondary group">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<GroupAddIcon />}
                    className={`delete-icon`}
                    onClick={() =>
                      handleClickaddedsecondaryusertousergroup(thisRowData)
                    }
                  ></Button>
                </Tooltip>
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

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  function handleClickUpdateUserGroup(value) {
    var groupId = value[0];
    props.history.push("/usergroups/update-usergroup/" + groupId);
  }

  function handleClickaddedprimaryusertousergroup(value) {
    var groupId = value[0];
    props.history.push("/usergroups/add-primaryuser-to-usergroup/" + groupId);
  }

  function handleClickaddedsecondaryusertousergroup(value) {
    var groupId = value[0];
    props.history.push("/usergroups/add-secondaryuser-to-usergroup/" + groupId);
  }

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

UserGroups.propTypes = {
  UserGroupData: PropTypes.array.isRequired,
  LoadAllUserGroup: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    UserGroupData: state.usergroup,
  };
}

const mapDispatchToProps = {
  LoadAllUserGroup: UserGroupAction.loadUserGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserGroups);
