import React, { Fragment, useState, useEffect, useRef } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import ConfirmationDialog from "../common/confirmdialogbox";
import ToasterMessageComponent from "../common/toaster";
import { connect } from "react-redux";
import * as CovidStateAction from "../../Redux/Action/covidStateAction";
import PropTypes from "prop-types";
import HomeIcon from "@material-ui/icons/Home";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import UserService from "../../services/usersService";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import * as GridAction from "../../Redux/Action/gridAction";

/**
 * Material UI  Theme styling
 * @param  {} theme
 */

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

function CovidState(props) {
  const anchorRef = useRef(null);
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("300px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openCovidStateInfoModal, setopenCovidStateInfoModal] = useState(false);
  const [openshiftInfoModal, setopenshiftInfoModal] = useState(false);
  const [openuserTemepratureModal, setopenuserTemepratureModal] =
    useState(false);
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [SelectedRowId, setSelectedRowId] = useState("");
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [componentLoadder, setcomponentLoadder] = useState(false);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  //Allows you to perform side effects in your component
  useEffect(() => {
    Promise.all([props.LoadData(), props.LoadGridsPage()])
      .then(([result, gridResult]) => {
        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  /**
   * Handle Click Update User
   * Method on click of edit covid state
   * @param  {} value-userId
   */
  function handleClickUpdateUser(value) {
    var userId = value[0];
    props.history.push("/covidstate/update-covidstate/" + userId);
  }

  /**
   * Handle Click View Users
   * Function to perform on click of view covid state
   * @param  {} value-id
   */
  function handleClickViewUsers(value) {
    props.history.push("/covidstate/view-covidstate/" + value);
  }

  /**
   * Handle rows per page change
   * Method on display no of rows per page
   * @param  {} rowsPerPage
   */
  function handleRowsPerPageChange(rowsPerPage) {
    setCurrentRowsPerPage(rowsPerPage);
  }
  /**
   * Table initiate
   * Initiate the table based on props grid data
   */
  const tableInitiate = () => {
    let thisPage = props.GridData.find((g) => {
      return g.name == "covidStates";
    });

    if (thisPage) {
      setCurrentPage(thisPage.page - 1);
    } else {
      return 0;
    }
  };

  //set the Mui table options
  const options = {
    filter: false,
    filterType: "dropdown",
    responsive: "scroll",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: currentRowsPerPage,
    onChangeRowsPerPage: handleRowsPerPageChange,
    jumpToPage: true,
    page: currentPage,
    onChangePage: (currentPage) => {
      setCurrentPage(currentPage);
      let sendData = { name: "covidStates", page: currentPage + 1 };
      props.UpdateGridsPage(sendData);
    },
    onTableInit: tableInitiate,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: "No COVID states found",
      },
      pagination: {
        jumpToPage: "Go to page:",
      },
    },
  };

  //set the Mui table columns
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
      name: "stateName",
      label: "Covid State",
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
          let covidStateACM = props.acmData.find((acm) => {
            return acm.module == "covidState";
          });
          if (thisRowData && covidStateACM) {
            return (
              <div className={`action-buttons-container`}>
                <LoadActions
                  thisRowData={thisRowData}
                  modulePermission={covidStateACM.permissions}
                  anchorRef={anchorRef}
                ></LoadActions>
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
  /**
   * Handle ClickOpen Confirmation modal
   * Set the action type and the message on the dialogbox and also once the modal opens and checks with commom folder 
      confirmdialogbox component 
   * @param  {} value
   */
  const handleClickOpenConfirmationModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteCovidStates");
    // setConfirmationModalActionType("DeleteCovidState");

    setConfirmationHeaderTittle("Delete Covid State");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${value[1]} ?`
    );
  };

  function handleClickOpenCovidStateInfoModal(value) {
    setopenCovidStateInfoModal(true);
    setSelectedRowId(value);
  }

  function handleClickOpenShiftInfoModal(value) {
    setopenshiftInfoModal(true);
    setSelectedRowId(value);
  }

  function handleClickOpenUserTempInfoModal(value) {
    setopenuserTemepratureModal(true);
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
              aria-current="page"
              className="active"
            >
              Covid States
            </LinkTo>
          </Breadcrumbs>

          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              title={""}
              data={
                props.CovidData && props.CovidData.length > 0
                  ? props.CovidData
                  : []
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

//Validates the data which is recieved fromn the props
CovidState.propTypes = {
  UserData: PropTypes.array.isRequired,
  LoadData: PropTypes.func.isRequired,
  getGridsPages: PropTypes.func.isRequired,
  gridState: PropTypes.array.isRequired,
  updateGridsPages: PropTypes.func.isRequired,
};

//To update the redux store and merge with props component
function mapStateToProps(state, ownProps) {
  return {
    CovidData: state.covidState,
    GridData: state.gridHistory,
    acmData: state.acmData,
  };
}

// Customizing the functions your component receives, and how they dispatch actions
const mapDispatchToProps = {
  LoadData: CovidStateAction.loadCovidState,
  LoadGridsPage: GridAction.getGridsPages,
  UpdateGridsPage: GridAction.updateGridsPages,
};

//Connects a React component to a Redux store
export default connect(mapStateToProps, mapDispatchToProps)(CovidState);
