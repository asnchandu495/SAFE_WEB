import React, { useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import ConfirmationDialog from "../common/confirmdialogbox";
import ToasterMessageComponent from "../common/toaster";
import { connect } from "react-redux";
import * as EmergencyContactAction from "../../Redux/Action/emergencyContactAction";
import PropTypes from "prop-types";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
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

function EmergencyContact(props) {
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

  const [SelectedRowDetails, setSelectedRowsDetails] = useState([]);
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    Promise.all([props.LoadAllEmergencyContactList(), props.LoadGridsPage()])

      .then(([result, gridResult]) => {
        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleClickOpenEditEmergencyContact(getId) {
    props.history.push(`/emergencycontacts/create/${getId}`);
  }

  function handleClickOpenViewEmergencyContact(getId) {
    props.history.push(`/emergencycontacts/view-contact-details/${getId}`);
  }

  function handleRowsPerPageChange(rowsPerPage) {
    setCurrentRowsPerPage(rowsPerPage);
  }

  const tableInitiate = () => {
    let thisPage = props.GridData.find((g) => {
      return g.name == "emergencyContacts";
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
    responsive: "simple",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: currentRowsPerPage,
    onChangeRowsPerPage: handleRowsPerPageChange,
    jumpToPage: true,
    page: currentPage,
    onChangePage: (currentPage) => {
      setCurrentPage(currentPage);
      let sendData = { name: "emergencyContacts", page: currentPage + 1 };
      props.UpdateGridsPage(sendData);
    },
    onTableInit: tableInitiate,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: "There are no emergency contacts",
      },
      pagination: {
        jumpToPage: "Goto page:",
      },
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
      name: "title",
      label: "Title",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "groupName",
      label: "Group",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "language",
      label: "Language",
      options: {
        filter: false,
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
                <Tooltip title="View">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<VisibilityIcon />}
                    className={`view-icon`}
                    onClick={() =>
                      handleClickOpenViewEmergencyContact(thisRowData[0])
                    }
                  ></Button>
                </Tooltip>
                <Tooltip title="Edit">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<EditIcon />}
                    className={`edit-icon`}
                    onClick={() =>
                      handleClickOpenEditEmergencyContact(thisRowData[0])
                    }
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
    setSelectedRowsDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteEmergencyContacts");
    setConfirmationHeaderTittle("Delete Emergency Contact");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${value[1]} ?`
    );
  };

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
              aria-current="page"
              className="active"
            >
              Emergency contacts
            </LinkTo>
          </Breadcrumbs>
          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              title={""}
              data={
                props.loadEmergencyContacts ? props.loadEmergencyContacts : []
              }
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
    </>
  );
}

EmergencyContact.propTypes = {
  loadEmergencyContacts: PropTypes.array.isRequired,
  LoadAllEmergencyContactList: PropTypes.func.isRequired,
  getGridsPages: PropTypes.func.isRequired,
  gridState: PropTypes.array.isRequired,
  updateGridsPages: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    loadEmergencyContacts: state.loadEmergencyContacts,
    GridData: state.gridHistory,
  };
}

const mapDispatchToProps = {
  LoadAllEmergencyContactList:
    EmergencyContactAction.LoadAllEmergencyContactList,
  LoadGridsPage: GridAction.getGridsPages,
  UpdateGridsPage: GridAction.updateGridsPages,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmergencyContact);
