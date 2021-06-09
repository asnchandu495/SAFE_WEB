import React, { Fragment, useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import ConfirmationDialog from "../common/confirmdialogbox";
import ChangeStatusIcon from "@material-ui/icons/SyncAlt";
import AssignEmergencyContactModal from "./assignemergencycontacttousergroupmodal";
import AddIcon from "@material-ui/icons/Add";
import ToasterMessageComponent from "../common/toaster";
import { connect } from "react-redux";
import * as AssignmentEmergencycontactAction from "../../Redux/Action/assignemergencycontactAction";
import PropTypes from "prop-types";
import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

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

function AssignEmergencyContacts(props) {
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("300px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openAssignEmergencyContactModal, setopenAssignEmergencyContactModal] =
    useState(false);
  const [opentempeartureInfoModal, setopentempeartureInfoModal] =
    useState(false);
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [SelectedRowId, setSelectedRowId] = useState("");
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [toasterServerity, settoasterServerity] = useState("");
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [componentLoadder, setcomponentLoadder] = useState(true);

  useEffect(() => {
    props
      .LoadAllAssignEmergencyConatct()
      .then((result) => {
        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const options = {
    filter: false,
    filterType: "dropdown",
    responsive: "scroll",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: 5,
    print: false,
    jumpToPage: true,
    // search: true,
    viewColumns: false,
    download: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: "There are no emergency contact assigned",
      },
      pagination: {
        jumpToPage: "Goto page:",
      },
    },
    // searchOpen: true,
    customToolbar: () => {
      return (
        <div className={`maingrid-actions`}>
          <Tooltip title="Assign emergency contact to user group">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              className={`add-icon`}
              onClick={handleClickOpenAssignEmergencyModal}
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
      name: "emergencyContactId",
      label: "Emergency Contact Id",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },

    {
      name: "groupId",
      label: "group Id",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },

    {
      name: "groupName",
      label: "Group Name",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "emergencyContactName",
      label: "Emergency Contact",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "isActive",
      label: "Status",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            var status = thisRowData[5];
            if (status) {
              return <span>Active</span>;
            } else {
              return <span>Inactive</span>;
            }
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
          var isActive = thisRowData[5];
          if (thisRowData) {
            return (
              <div className={`action-buttons-container`}>
                <Tooltip title="Cancel assignement emergency contacts">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<CloseIcon />}
                    className={[
                      "delete-icon",
                      isActive ? "HiddenButton" : "showButton",
                    ].join(" ")}
                    onClick={() =>
                      handleClickOpenConfirmationModal(thisRowData)
                    }
                  ></Button>
                </Tooltip>

                <Tooltip title="Change doc status">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<ChangeStatusIcon />}
                    className={`edit-icon`}
                    onClick={() =>
                      handleClickOpenChangeStatusModal(thisRowData)
                    }
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
    setConfirmationModalActionType("EmergencyContactCancel");
    setConfirmationHeaderTittle("Cancel assigned emrgency contacts");
    setConfirmationDialogContextText(
      `Are you sure you want to cancel assignment of Emergency Contact document - ${value[4]} to user group - ${value[3]}`
    );
  };

  const handleClickOpenChangeStatusModal = (value) => {
    var userStatus = value[5];
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("ChangeDocStatus");
    setConfirmationHeaderTittle("Change emergency contact doc status");
    if (userStatus == true) {
      setConfirmationDialogContextText(
        `By changing the status to “Inactive”, users of the user group ${value[3]} will not be able to access any Emergency Contact documents. Are you sure you want to change status ?`
      );
    } else {
      setConfirmationDialogContextText(
        `By changing the assignment status to “Active” the Emergency Contact document ${value[4]} will be available on mobile app for all users of the user group ${value[3]}. Are you sure you want to change the status ?`
      );
    }
  };

  function handleClickOpenAssignEmergencyModal(value) {
    setopenAssignEmergencyContactModal(true);
    setSelectedRowId(value);
  }

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  return (
    <>
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
              to={`/emergencycontacts/view`}
              className="inactive"
            >
              Emergency contacts
            </LinkTo>
            <LinkTo
              color="textPrimary"
              href="#"
              aria-current="page"
              className="active"
            >
              Assign Emergency Contact doc to group
            </LinkTo>
          </Breadcrumbs>
          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              title={""}
              data={props.AssignEmergencyContactData}
              columns={columns}
              options={options}
              className="global-table"
            />
          </MuiThemeProvider>
        </>
      )}
      <AssignEmergencyContactModal
        openAssignEmergencyContactModal={openAssignEmergencyContactModal}
        SelectedRowId={SelectedRowId}
        setopenAssignEmergencyContactModal={setopenAssignEmergencyContactModal}
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
    </>
  );
}

AssignEmergencyContacts.propTypes = {
  AssignEmergencyContactData: PropTypes.array.isRequired,
  LoadAllAssignEmergencyConatct: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    AssignEmergencyContactData: state.loadAssignEmergencyContacts,
  };
}

const mapDispatchToProps = {
  LoadAllAssignEmergencyConatct:
    AssignmentEmergencycontactAction.LoadAllAssignEmergencyContactList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignEmergencyContacts);
