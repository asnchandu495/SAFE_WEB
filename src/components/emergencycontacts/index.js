import React, { useState, useEffect, useRef } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { makeStyles } from "@material-ui/core/styles";
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
import FilterListIcon from "@material-ui/icons/FilterList";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import ReplayIcon from "@material-ui/icons/Replay";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import * as GridAction from "../../Redux/Action/gridAction";
import MasterService from "../../services/masterDataService";
import EmergencyContactService from "../../services/emergencyContactService";

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

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: 25,
  },
  stepButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    marginBottom: -3,
    width: 20,
    height: 20,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
    margin: 0,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  errorSpanMsg: {
    color: "red",
  },
  HideGrid: {
    display: "none",
  },
}));

function EmergencyContact(props) {
  const classes = useStyles();
  const anchorRef = useRef(null);
  const masterDataCallApi = new MasterService();
  const emergencyContactCallApi = new EmergencyContactService();

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
  const [Modalopen, setModalOpen] = useState(false);
  const [showLoadder, setshowLoadder] = useState(false);
  const [allLanguages, setAllLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

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

  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  useEffect(() => {
    Promise.all([props.LoadAllEmergencyContactList([]), props.LoadGridsPage(), masterDataCallApi.getAllLanguages()])
      .then(([result, gridResult, allLanguages]) => {
        setAllLanguages(allLanguages);
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
        jumpToPage: "Go to page:",
      },
    },
    customToolbar: (value, tableMeta, updateValue) => {
      return (
        <div className={`maingrid-actions action-buttons-container`}>
          <Tooltip title="Filter By Language">
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
          let emergencyContactACM = props.acmData.find((acm) => {
            return acm.module == "emergencyContact";
          });

          if (thisRowData && emergencyContactACM) {
            return (
              <div className={`action-buttons-container`}>
                <LoadActions
                  thisRowData={thisRowData}
                  modulePermission={emergencyContactACM.permissions}
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

  const handleClickOpenModal = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleChangeLanguage = (e, value) => {
    console.log(value);
    setSelectedLanguages(value);
  }

  function resetFilterForm() {
    setSelectedLanguages([]);
  }

  function AssignFiltersForm() {
    setshowLoadder(true);
    props
      .LoadAllEmergencyContactList(selectedLanguages)
      .then((result) => {
        setshowLoadder(false);
        setModalOpen(false);
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
        setshowLoadder(false);
      });
  }

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
                onClick={() =>
                  handleClickOpenViewEmergencyContact(props.thisRowData[0])
                }
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
                  onClick={() =>
                    handleClickOpenEditEmergencyContact(props.thisRowData[0])
                  }
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
          <Dialog
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            open={Modalopen}
            className="modal-min-widtn"
          >
            <DialogTitle id="form-dialog-title" onClose={handleClose}>
              Filters
            </DialogTitle>
            <ValidatorForm className={`global-form`} onSubmit={AssignFiltersForm}>
              <DialogContent dividers>
                {!componentLoadder ? (
                  <Grid container spacing={3}>
                    <Grid item cs={12} container>
                      <Grid item xs={4}>
                        <label className="required">Language</label>
                      </Grid>
                      <Grid item xs={8}>
                        <FormControl variant="outlined" fullWidth>
                          <Autocomplete
                            multiple
                            id="tags-outlined"
                            options={
                              allLanguages &&
                                allLanguages.length > 0
                                ? allLanguages
                                : []
                            }
                            getOptionLabel={(option) => option.name}
                            defaultValue={
                              selectedLanguages.length ? selectedLanguages : []
                            }
                            value={selectedLanguages.length ? selectedLanguages : []}
                            onChange={handleChangeLanguage}
                            filterSelectedOptions
                            className="global-input autocomplete-select"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                inputProps={{
                                  ...params.inputProps,
                                  required:
                                    selectedLanguages.length === 0
                                }}
                                variant="outlined"
                                placeholder="Select language"
                              />
                            )}
                          />
                          {""}
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
                  {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
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
            <LinkTo
              color="textPrimary"
              href="#"
              aria-current="page"
              className="active"
            >
              Emergency Contacts
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
    acmData: state.acmData,
  };
}

const mapDispatchToProps = {
  LoadAllEmergencyContactList:
    EmergencyContactAction.LoadAllEmergencyContactList,
  LoadGridsPage: GridAction.getGridsPages,
  UpdateGridsPage: GridAction.updateGridsPages,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmergencyContact);
