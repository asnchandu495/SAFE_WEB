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
import * as AddFloorAction from "../../Redux/Action/addFloorAction";
import * as SiteAction from "../../Redux/Action/siteAction";
import PropTypes from "prop-types";
import HomeIcon from "@material-ui/icons/Home";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SiteServices from "../../services/siteService";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import UserService from "../../services/usersService";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import ApartmentIcon from "@material-ui/icons/Apartment";
import RoomIcon from "@material-ui/icons/Room";
import AddFloorPage from "./addFloor";
import CustomToolbaraddFloor from "./addFloorCustomBuuton";

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

const floorInfoData = [
  {
    id: 1,
    floorName: "ist Floor",
    noofLocation: 10,
  },
  {
    id: 2,
    floorName: "2nd Floor",
    noofLocation: 20,
  },
  {
    id: 3,
    floorName: "5th Floor",
    noofLocation: 30,
  },
];

function ListFloor(props) {
  const siteId = props.match.params.siteId;
  const usersApiCall = new UserService();
  const apiCallSite = new SiteServices();

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openCovidStateInfoModal, setopenCovidStateInfoModal] = useState(false);
  const [openshiftInfoModal, setopenshiftInfoModal] = useState(false);
  const [listFloorData, setlistFloorData] = useState([]);
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
  const [openaddFloorModal, setopenaddFloorModal] = useState(false);
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
    props
      .LoadData(props.match.params.siteId)
      .then((result) => {
        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleClickUpdateFloor(value) {
    var userId = value[0];
    setSelectedRowId(userId);
    setopenaddFloorModal(true);
  }

  function handleClickOpenAddFloorPage() {
    props.history.push("/site/list-floor");
  }

  function handleClickOpenAddFlocationPage() {
    props.history.push("/site/add-location");
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
        noMatch: "There are no floors",
      },
    },

    customToolbar: () => {
      return (
        <CustomToolbaraddFloor
          setopenaddFloorModal={setopenaddFloorModal}
          setSelectedRowId={setSelectedRowId}
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
      name: "locationCount",
      label: "No of location",
      options: {
        filter: true,
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
                    onClick={() => handleClickUpdateFloor(thisRowData)}
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
    setConfirmationModalActionType("DeleteFloor");
    setConfirmationHeaderTittle("Delete Floor");
    setConfirmationDialogContextText(
      `Are you sure you want to delete floor ${value[1]} ?`
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
              href="#"
              aria-current="page"
              className="inactive"
            >
              kkkk
            </LinkTo>
            <LinkTo
              color="textPrimary"
              href="#"
              aria-current="page"
              className="active"
            >
              Floors
            </LinkTo>
          </Breadcrumbs>

          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              title={""}
              data={
                props.FloorData && props.FloorData.length > 0
                  ? props.FloorData
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
      <AddFloorPage
        openaddFloorModal={openaddFloorModal}
        SelectedRowId={SelectedRowId}
        siteId={siteId}
        setopenaddFloorModal={setopenaddFloorModal}
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

ListFloor.propTypes = {
  FloorData: PropTypes.array.isRequired,
  LoadData: PropTypes.func.isRequired,
  DeleteSiteFloor: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    FloorData: state.FloorState,
  };
}

const mapDispatchToProps = {
  LoadData: AddFloorAction.loadFloor,
  LoadEmptyData: AddFloorAction.loadFloorWithEmptyData,
  DeleteSiteFloor: SiteAction.deleteSiteFloor,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListFloor);
