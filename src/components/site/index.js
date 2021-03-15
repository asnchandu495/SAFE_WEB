import React, { Fragment, useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import ConfirmationDialog from "../common/confirmdialogbox";
import ToasterMessageComponent from "../common/toaster";
import { connect } from "react-redux";
import * as UserSiteAction from "../../Redux/Action/siteAction";
import PropTypes from "prop-types";
import HomeIcon from "@material-ui/icons/Home";
import VisibilityIcon from "@material-ui/icons/Visibility";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import UserService from "../../services/usersService";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import ApartmentIcon from "@material-ui/icons/Apartment";
import * as AddFloorAction from "../../Redux/Action/addFloorAction";
import RoomIcon from "@material-ui/icons/Room";

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: theme.spacing(1),
    height: 20,
    width: 20,
    minHeight: 20,
  },
}));

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

function ListSite(props) {
  const classes = useStyles();

  const usersApiCall = new UserService();

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

  useEffect(() => {
    setcomponentLoadder(true);
    props
      .LoadData()
      .then((result) => {
        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleClickUpdateUser(value) {
    var userId = value[0];
    props.history.push("/site/update-site/" + userId);
  }
  function handleClickViewUsers(value) {
    props.history.push("/site/view-site/" + value);
  }

  function handleClickOpenAddFloorPage(value) {
    var thisId = value[0];
    props.history.push(`/site/${thisId}/list-floor`);
  }

  function handleClickOpenAddFlocationPage(value) {
    var thisId = value[0];
    props.history.push(`/site/${thisId}/list-location`);
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
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: "There are no sites created",
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
      name: "name",
      label: "Site",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "floors",
      label: "No of floors",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return <span>{thisRowData[2].length}</span>;
          }
        },
      },
    },
    {
      name: "siteManagerName",
      label: "Site Manager",
      options: {
        filter: false,
        sort: true,
      },
    },

    {
      name: "securityManagerName",
      label: "Security Manager",
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
                <Tooltip title="Add Floor">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<ApartmentIcon />}
                    className={`edit-icon`}
                    onClick={() => handleClickOpenAddFloorPage(thisRowData)}
                  ></Button>
                </Tooltip>
                <Tooltip title="Add Location">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<RoomIcon />}
                    className={`edit-icon`}
                    onClick={() => handleClickOpenAddFlocationPage(thisRowData)}
                  ></Button>
                </Tooltip>
              </div>
            );
          }
        },
        setCellProps: (value) => {
          return {
            style: { width: "250px", minWidth: "250px", textAlign: "center" },
          };
        },
      },
    },
  ];

  const handleClickOpenConfirmationModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteSite");
    setConfirmationHeaderTittle("Delete Site");
    setConfirmationDialogContextText(
      `Are you sure you want to delete site ${value[1]} ?`
    );
  };

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
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
              Sites
            </LinkTo>
          </Breadcrumbs>
          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              title={""}
              data={
                props.SiteData && props.SiteData.length > 0
                  ? props.SiteData
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
    </div>
  );
}

ListSite.propTypes = {
  SiteData: PropTypes.array.isRequired,
  LoadEmptyData: PropTypes.array.isRequired,
  LoadData: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    SiteData: state.SiteState,
  };
}

const mapDispatchToProps = {
  LoadData: UserSiteAction.loadSite,
  LoadEmptyData: AddFloorAction.loadFloorWithEmptyData,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListSite);
