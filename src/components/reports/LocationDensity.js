import React, { Fragment, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import BackupIcon from "@material-ui/icons/Backup";
import AddBoxIcon from "@material-ui/icons/AddBox";
import AddIcon from "@material-ui/icons/Add";
import FilterListIcon from "@material-ui/icons/FilterList";
import UserGroupService from "../../services/userGroupService";
import ConfirmationDialog from "../common/confirmdialogbox";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ToasterMessageComponent from "../common/toaster";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import SiteService from "../../services/siteService";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import propTypes from "prop-types";
import { connect } from "react-redux";
import MuiTablePagination from "@material-ui/core/TablePagination";
import ReplayIcon from "@material-ui/icons/Replay";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import moment from "moment";
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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function LocationDensity(props) {
  const UserGroup = new UserGroupService();
  const siteApiCall = new SiteService();
  const [userGroupList, setuserGroupList] = useState();

  const [Modalopen, setModalOpen] = useState(false);
  const [showLoadder, setshowLoadder] = useState(false);
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");

  const [allSites, setAllSites] = useState();
  const [selectedSiteData, setselectedSiteData] = useState();
  const [selectedLocationData, setselectedLocationData] = useState([]);
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [locationDensityData, setlocationDensityData] = useState([]);
  const [reportTime, setReportTime] = useState(moment().toISOString());
  const [locationBySiteId, setlocationBySiteId] = useState();
  const [formFieldValidation, setformFieldValidation] = useState({
    SiteId: false,
    LocationId: false,
  });
  const [searchFormOld, setSearchFormOld] = useState();
  const [selectedSiteDataOld, setselectedSiteDataOld] = useState();
  const [selectedLocationDataOld, setselectedLocationDataOld] = useState([]);
  const [isFilterSelected, setIsFilterSelected] = useState(false);

  useEffect(() => {
    // Promise.all([siteApiCall.getListSite(), siteApiCall.getLocationManagers()])
    //   .then(([getAllSites, result]) => {
    Promise.all([siteApiCall.getListSiteSupervisor(), props.LoadGridsPage()])
      .then(([getAllSites, gridResult]) => {
        setAllSites(getAllSites);
        setComponentLoadder(false);
        setlocationDensityData();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = [
    {
      name: "rlapReferenceId",
      label: "Id",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      label: "Site ",
      name: "siteName",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Location",
      name: "locationName",
      options: {
        filter: false,
        sort: true,
        setCellProps: (value, rowIndex) => {
          var thisRowData = locationDensityData[rowIndex];
          return {
            style: { backgroundColor: thisRowData.colorCode, color: "#fff" },
          };
        },
      },
    },
    {
      name: "colorCode",
      label: "Color",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      label: "Count ",
      name: "count",
      options: {
        filter: false,
        sort: true,
      },
    },
  ];
  const tableInitiate = () => {
    let thisPage = props.GridData.find((g) => {
      console.log(thisPage);
      return g.name == "report";
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
    jumpToPage: true,
    viewColumns: false,
    download: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: `${isFilterSelected ? 'There are no reports' : 'Please select filters to generate report'}`,
      },
      pagination: {
        jumpToPage: "Go to page:",
      },
    },
    customToolbarSelect: (value, tableMeta, updateValue) => { },
    customToolbar: () => {
      return (
        <div className={`maingrid-actions`}>
          <Tooltip title="Filter ">
            <Button
              variant="contained"
              startIcon={<FilterListIcon />}
              className={`add-icon`}
              onClick={handleClickOpenModal}
            ></Button>
          </Tooltip>
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
    page: currentPage,
    onChangePage: (currentPage) => {
      setCurrentPage(currentPage);
      let sendData = { name: "report", page: currentPage + 1 };
      props.UpdateGridsPage(sendData);
    },
    onTableInit: tableInitiate,
    customFooter: (
      count,
      page,
      rowsPerPage,
      changeRowsPerPage,
      changePage,
      textLabels
    ) => {
      return (
        <CustomFooter
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          changeRowsPerPage={changeRowsPerPage}
          changePage={changePage}
          textLabels={textLabels}
        />
      );
    },
  };

  const CustomFooter = (props) => {
    console.log(props);
    return (
      <div className="custom-pagination-report">
        <div className="legend-container">
          <ul className="legends">
            <li className="low">Low</li>
            <li className="medium">Medium</li>
            <li className="high">High</li>
            <li className="nodata">RLAP Inactive</li>
            <li>
              {reportTime != "" ? (
                <>
                  Report as on :{" "}
                  <span className="live-time">
                    {moment(reportTime).format("DD-MM-YYYY hh:mm:ss a")}
                  </span>
                </>
              ) : (
                ""
              )}
            </li>
          </ul>
        </div>
        <MuiTablePagination
          component="div"
          count={props.count}
          rowsPerPage={props.rowsPerPage}
          page={props.page}
          rowsPerPageOptions={[5, 10, 20, 100]}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowChange}
        />
      </div>
    );
  };

  const handlePageChange = (_, page) => {
    console.log(page);
    setCurrentPage(page);
  };

  const handleRowChange = (e) => {
    console.log(e.target.value);
    setCurrentRowsPerPage(e.target.value);
  };

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  const handleClickOpenModal = () => {
    if (selectedSiteDataOld) {
      setselectedSiteData(selectedSiteDataOld);
    }
    if (selectedLocationDataOld.length > 0) {
      setselectedLocationData(selectedLocationDataOld);
    }
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const [searchForm, setSearchForm] = useState({
    SiteId: "",
    LocationId: [],
  });
  const [resetformData, SetresetformData] = useState({
    SiteId: "",
    LocationId: [],
  });
  function handleRowsPerPageChange(rowsPerPage) {
    setCurrentRowsPerPage(rowsPerPage);
  }

  function selectedSite(e, value) {
    setselectedLocationData([]);
    setselectedSiteData(value);
    setformFieldValidation((ValidationForm) => ({
      ...ValidationForm,
      ["SiteId"]: false,
    }));
    if (value) {
      let data = value.id;
      siteApiCall
        .getAllLocationsBySiteId(data)
        .then((getResult) => {
          console.log(getResult);
          setlocationBySiteId(getResult);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function selectedLocation(e, value) {
    setselectedLocationData(value);
    setformFieldValidation((ValidationForm) => ({
      ...ValidationForm,
      ["LocationId"]: false,
    }));
  }

  function SelectSiteValidation() {
    if (selectedSiteData) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["SiteId"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["SiteId"]: true,
      }));
    }
  }
  function SelectLocationValidation() {
    if (selectedLocationData) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["LocationId"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["LocationId"]: true,
      }));
    }
  }

  function submitForm(e) {
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");

    setSearchFormOld(searchForm);
    setselectedSiteDataOld(selectedSiteData);
    setselectedLocationDataOld(selectedLocationData);
    SelectSiteValidation();
    SelectSiteValidation();
    SelectLocationValidation();
    if (selectedSiteData != null && selectedLocationData != null) {
      submitFormDensity();
    } else {
      return false;
    }
  }

  function resetFilterForm() {
    setselectedSiteData();
    setselectedLocationData();

    setSearchForm(resetformData);
  }

  function submitFormDensity() {
    setshowLoadder(true);

    if (selectedSiteData) {
      searchForm.SiteId = selectedSiteData.id;
    }

    if (selectedLocationData.length > 0) {
      let locationArr = selectedLocationData.map((item) => item.id);
      searchForm.LocationId = locationArr;
    } else {
      searchForm.LocationId = [];
    }

    siteApiCall
      .getLocationBysiteReport(searchForm)
      .then((result) => {
        setIsFilterSelected(true);
        setStateSnackbar(true);
        setToasterMessage("success");
        settoasterServerity("success");
        setlocationDensityData(result);
        setTimeout(() => {
          setReportTime(moment().toISOString());
          setModalOpen(false);
          setshowLoadder(false);
        }, 3000);
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
        setshowLoadder(false);
      });
  }

  return (
    <div className="innerpage-container">
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        className="global-dialog confirmation-dialog global-form modal-min-widtn"
        aria-labelledby="form-dialog-title"
        open={Modalopen}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Filter
        </DialogTitle>
        <ValidatorForm className={`global-form`} onSubmit={submitForm}>
          <DialogContent dividers>
            {!componentLoadder ? (
              <Grid container spacing={3}>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label className="required">Site </label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <Autocomplete
                        name="siteId"
                        id="tags-outlined"
                        options={
                          allSites && allSites.length > 0 ? allSites : []
                        }
                        getOptionLabel={(option) => option.name}
                        defaultValue={selectedSiteData}
                        value={selectedSiteData ? selectedSiteData : ""}
                        onChange={selectedSite}
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            required
                            {...params}
                            variant="outlined"
                            placeholder="Select Site"
                          />
                        )}
                      />{" "}
                      {/* {formFieldValidation.SiteId ? (
                        <FormHelperText className="error-msg">
                          Please select site{" "}
                        </FormHelperText>
                      ) : (
                        ""
                      )} */}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label className="required">Location</label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={
                          locationBySiteId && locationBySiteId.length > 0
                            ? locationBySiteId
                            : []
                        }
                        name="location"
                        getOptionLabel={(option) => option.locationName}
                        defaultValue={selectedLocationData}
                        value={selectedLocationData ? selectedLocationData : []}
                        onChange={selectedLocation}
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            inputProps={{
                              ...params.inputProps,
                              required: selectedLocationData
                                ? selectedLocationData.length === 0
                                : true,
                            }}
                            variant="outlined"
                            placeholder="Select Location"
                          />
                        )}
                      />
                      {/* {formFieldValidation.LocationId ? (
                        <FormHelperText className="error-msg">
                          Please select location{" "}
                        </FormHelperText>
                      ) : (
                        ""
                      )} */}
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
              {showLoadder ? <ButtonLoadderComponent /> : "Generate"}
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
        <LinkTo color="textPrimary" href="#" to="#" className="inactive">
          Reports
        </LinkTo>
        <LinkTo color="textPrimary" href="#" to="#" className="inactive">
          Location density
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder ? (
        <ComponentLoadderComponent />
      ) : (
        <MuiThemeProvider theme={theme1}>
          {" "}
          <MUIDataTable
            title={""}
            data={locationDensityData}
            columns={columns}
            options={options}
            className="global-table no-action-table"
          />{" "}
        </MuiThemeProvider>
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
function mapStateToProps(state, ownProps) {
  return {
    GridData: state.gridHistory,
  };
}

const mapDispatchToProps = {
  LoadGridsPage: GridAction.getGridsPages,
  UpdateGridsPage: GridAction.updateGridsPages,
};

// export default LocationDensity;s

export default connect(mapStateToProps, mapDispatchToProps)(LocationDensity);
