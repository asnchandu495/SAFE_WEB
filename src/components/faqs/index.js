import React, { Fragment, useState, useEffect, useRef } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import ToasterMessageComponent from "../common/toaster";
import HomeIcon from "@material-ui/icons/Home";
import ConfirmationDialog from "../common/confirmdialogbox";
import VisibilityIcon from "@material-ui/icons/Visibility";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import FaqService from "../../services/faqService";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import { connect } from "react-redux";
import * as faqAction from "../../Redux/Action/faqAction";
import PropTypes from "prop-types";
import * as GridAction from "../../Redux/Action/gridAction";
import FilterListIcon from "@material-ui/icons/FilterList";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ReplayIcon from "@material-ui/icons/Replay";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MasterDataService from "../../services/masterDataService";
import EditIcon from "@material-ui/icons/Edit";

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

function ViewAllFAQs(props) {
  const anchorRef = useRef(null);
  const classes = useStyles();
  const masterApiCall = new MasterDataService();
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [Modalopen, setModalOpen] = useState(false);
  const [showLoadder, setshowLoadder] = useState(false);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [languageValue, setlanguageValue] = useState([]);
  const [allLanguages, setAllLanguages] = useState([]);

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

  const [loadFormData, setloadFormData] = useState({
    isSaveAsDraft: "false",
    languageIds: [],
  });

  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  useEffect(() => {
    Promise.all([
      props.LoadData(loadFormData),
      masterApiCall.getAllLanguages(),
      props.LoadGridsPage(),
    ])

      .then(([result, getLanguages, gridResult]) => {
        // setAllFaqs(result);
        setAllLanguages(getLanguages);
        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleClickOpenConfirmationModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteFaq");
    setConfirmationHeaderTittle("Delete Faq");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${value[1]} ?`
    );
  };

  function handleRowsPerPageChange(rowsPerPage) {
    setCurrentRowsPerPage(rowsPerPage);
  }

  const tableInitiate = () => {
    let thisPage = props.GridData.find((g) => {
      return g.name == "faqs";
    });

    if (thisPage) {
      setCurrentPage(thisPage.page - 1);
    } else {
      return 0;
    }
  };

  const handleClickOpenModal = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

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
      let sendData = { name: "faqs", page: currentPage + 1 };
      props.UpdateGridsPage(sendData);
    },
    onTableInit: tableInitiate,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: "There are no FAQs. Add one now",
      },
      pagination: {
        jumpToPage: "Go to page:",
      },
    },
    customToolbarSelect: (value, tableMeta, updateValue) => {},
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
        print: false,
        filter: true,
      },
    },

    {
      name: "language",
      label: "Language",
      options: {
        print: false,
        filter: true,
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
          let faqACM = props.acmData.find((acm) => {
            return acm.module == "faq";
          });

          if (thisRowData) {
            return (
              <div className={`action-buttons-container`}>
                <LoadActions
                  thisRowData={thisRowData}
                  modulePermission={faqACM.permissions}
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
                className={`edit-icon`}
                onClick={() => handleClickView(props.thisRowData)}
              ></Button>
            </Tooltip>
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
        case "sectionCreate":
          return entity.isAccess ? (
            <Tooltip title="Add Section">
              <Button
                variant="contained"
                color="default"
                startIcon={<QuestionAnswerIcon />}
                className={`edit-icon`}
                onClick={() => handleClickAddSections(props.thisRowData)}
              ></Button>
            </Tooltip>
          ) : (
            ""
          );
          break;
        case "update":
          return entity.isAccess ? (
            <Tooltip title="Edit">
              <Button
                variant="contained"
                color="default"
                startIcon={<EditIcon />}
                className={`edit-icon`}
                onClick={() => handleClickEditSections(props.thisRowData)}
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

  function handleClickAddSections(value) {
    var faqId = value[0];
    props.history.push(`/faq/faq-sections/${faqId}/0`);
  }

  function handleClickEditSections(value) {
    var faqId = value[0];
    props.history.push(`/faq/add-faq/${faqId}`);
  }

  function handleClickView(value) {
    var faqId = value[0];
    props.history.push("/faq/view-faq/" + faqId);
  }

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  function handleChangeLanguage(event, value) {
    setlanguageValue(value);
  }

  function resetFilterForm() {
    setlanguageValue([]);
  }

  function submitLanguage() {
    console.log(loadFormData);
    let submitFilterdata = loadFormData;
    if (languageValue.length > 0) {
      let languageArr = languageValue.map((item) => item.id);
      submitFilterdata.languageIds = languageArr;
    } else {
      submitFilterdata.languageIds = [];
    }
    console.log(submitFilterdata);

    setshowLoadder(true);

    props
      .LoadData(submitFilterdata)

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

  return (
    <div className="innerpage-container">
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={Modalopen}
        className="global-dialog confirmation-dialog global-form"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Filters
        </DialogTitle>

        <ValidatorForm className={`global-form`} onSubmit={submitLanguage}>
          <DialogContent dividers>
            {!componentLoadder ? (
              <Grid container spacing={3}>
                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className=""> Language</label>
                  </Grid>
                  <Grid item xs={8}>
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={allLanguages}
                      getOptionLabel={(option) => option.name}
                      onChange={handleChangeLanguage}
                      defaultValue={languageValue.length ? languageValue : []}
                      value={languageValue.length ? languageValue : []}
                      filterSelectedOptions
                      className="global-input autocomplete-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select "
                        />
                      )}
                    />
                    {""}
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
              FAQs
            </LinkTo>
          </Breadcrumbs>

          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              title={""}
              data={
                props.FaqData && props.FaqData.length > 0 ? props.FaqData : []
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

ViewAllFAQs.propTypes = {
  FaqData: PropTypes.array.isRequired,
  LoadData: PropTypes.func.isRequired,
  getGridsPages: PropTypes.func.isRequired,
  gridState: PropTypes.array.isRequired,
  updateGridsPages: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    FaqData: state.faqState,
    GridData: state.gridHistory,
    acmData: state.acmData,
  };
}

const mapDispatchToProps = {
  LoadData: faqAction.loadFaq,
  LoadGridsPage: GridAction.getGridsPages,
  UpdateGridsPage: GridAction.updateGridsPages,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllFAQs);
