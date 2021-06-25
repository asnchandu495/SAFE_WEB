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
import * as UserLocationAction from "../../Redux/Action/addLocationAction";
import PropTypes from "prop-types";
import HomeIcon from "@material-ui/icons/Home";
import VisibilityIcon from "@material-ui/icons/Visibility";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import UserService from "../../services/usersService";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import ApartmentIcon from "@material-ui/icons/Apartment";
import RoomIcon from "@material-ui/icons/Room";
import SiteServices from "../../services/siteService";
import AddFlocationPage from "./addLocation";
import ViewlocationPage from "./viewLocation";
import CustomToolbaraddFlocation from "./addLocationCustomButton";

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

const locationInfoData = [
  {
    id: 1,
    floorName: "ist Floor",
    location: "F1-Caferia",
    pinMicroStatus: "Active",
  },
  {
    id: 2,
    floorName: "2nd Floor",
    location: "F1-Reception",
    pinMicroStatus: "Active",
  },
  {
    id: 3,
    floorName: "3rd Floor",
    location: "F1-Longue",
    pinMicroStatus: "Inctive",
  },
];

function ListSite(props) {
  const classes = useStyles();
  const siteId = props.match.params.siteId;

  const usersApiCall = new UserService();
  const apiCallSite = new SiteServices();

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openCovidStateInfoModal, setopenCovidStateInfoModal] = useState(false);
  const [openAddLocationModal, setopenAddLocationModal] = useState(false);
  const [openViewLocationModal, setopenViewLocationModal] = useState(false);
  const [openshiftInfoModal, setopenshiftInfoModal] = useState(false);
  const [openuserTemepratureModal, setopenuserTemepratureModal] =
    useState(false);
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [listLocationData, setlistLocationData] = useState([]);
  const [SelectedRowId, setSelectedRowId] = useState("");
  const [selectedLocationDetails, setSelectedLocationDetails] = useState();
  const [openaddFloorModal, setopenaddFloorModal] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [siteName, setsiteName] = useState("");

  useEffect(() => {
    Promise.all([props.LoadData(siteId), apiCallSite.getSiteById(siteId)])
      .then(([result, getSiteData]) => {
        setsiteName(getSiteData.name);
        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleClickUpdateLocation(value) {
    var locationId = value[0];
    setSelectedRowId(locationId);
    setopenAddLocationModal(true);
  }

  function handleClickViewLocation(value) {
    setopenViewLocationModal(true);
    setSelectedLocationDetails(value);
  }

  function handleClickViewUsers(value) {
    // props.history.push("/designation/view-designation/" + value);
  }

  function handleClickOpenAddFloorPage() {
    props.history.push("/site/list-floor");
  }

  function handleClickOpenAddFlocationPage() {
    props.history.push("/site/add-location");
  }
  function handleClickViewUsers() {
    let value = siteId;
    props.history.push("/site/view-site/" + value);
  }
  const options = {
    filter: false,
    filterType: "dropdown",
    responsive: "scroll",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: 5,
    jumpToPage: true,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: "There are no locations",
      },
      pagination: {
        jumpToPage: "Go to page:",
      },
    },

    customToolbar: () => {
      return (
        <CustomToolbaraddFlocation
          setopenAddLocationModal={setopenAddLocationModal}
        />
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
      name: "floorName",
      label: "Floors",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "locationName",
      label: "Location",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "isPinMicroActive",
      label: "RLAP Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          var isPinMicroStatus = thisRowData[3];
          if (isPinMicroStatus) {
            return (
              <Fragment>
                <span>Active</span>
              </Fragment>
            );
          } else {
            return (
              <Fragment>
                <span>Inactive</span>
              </Fragment>
            );
          }
        },
      },
    },
    {
      name: "densityThreasholdLowFrom",
      label: "densityThreasholdLowFrom",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      name: "densityThreasholdLowTo",
      label: "densityThreasholdLowTo",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      name: "densityThreasholdMediumFrom",
      label: "densityThreasholdMediumFrom",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      name: "densityThreasholdMediumTo",
      label: "densityThreasholdMediumTo",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      name: "densityThreasholdHighFrom",
      label: "densityThreasholdHighFrom",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      name: "densityThreasholdHighTo",
      label: "densityThreasholdHighTo",
      options: {
        display: "excluded",
        print: false,
        filter: false,
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
                <Tooltip title="View">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<VisibilityIcon />}
                    className={`view-icon`}
                    onClick={() => handleClickViewLocation(thisRowData)}
                  ></Button>
                </Tooltip>

                <Tooltip title="Edit">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<EditIcon />}
                    className={`edit-icon`}
                    onClick={() => handleClickUpdateLocation(thisRowData)}
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
            style: { width: "150px", minWidth: "150px" },
          };
        },
      },
    },
  ];

  const handleClickOpenConfirmationModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteLocation");
    setConfirmationHeaderTittle("Delete Location");
    setConfirmationDialogContextText(
      `Are you sure you want to delete location ${value[2]} ?`
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
              color="inherit"
              href="#"
              to={`/site/all-site`}
              className="inactive"
            >
              Sites
            </LinkTo>
            <LinkTo
              color="textPrimary"
              onClick={handleClickViewUsers}
              aria-current="page"
              className="inactive"
            >
              {siteName}
            </LinkTo>
            <LinkTo
              color="textPrimary"
              style={{ cursor: "default" }}
              aria-current="page"
              className="active"
            >
              Locations
            </LinkTo>
          </Breadcrumbs>

          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              title={""}
              data={
                props.LocationData && props.LocationData.length > 0
                  ? props.LocationData
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
      <AddFlocationPage
        openAddLocationModal={openAddLocationModal}
        SelectedRowId={SelectedRowId}
        setSelectedRowId={setSelectedRowId}
        setopenAddLocationModal={setopenAddLocationModal}
        siteId={siteId}
      />
      <ViewlocationPage
        openViewLocationModal={openViewLocationModal}
        selectedLocationDetails={selectedLocationDetails}
        setSelectedLocationDetails={setSelectedLocationDetails}
        setopenViewLocationModal={setopenViewLocationModal}
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
  LocationData: PropTypes.array.isRequired,
  LoadData: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    LocationData: state.LocationState,
  };
}

const mapDispatchToProps = {
  LoadData: UserLocationAction.loadLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListSite);
