import React, { Fragment, useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import Grid from "@material-ui/core/Grid";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import ToasterMessageComponent from "../../common/toaster";
import ConfirmationDialog from "../../common/confirmdialogbox";
import FaqService from "../../../services/faqService";
import userGroupApi from "../../../services/userGroupService";
import * as AssignfaqAction from "../../../Redux/Action/assignFaqAction";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import ComponentLoadderComponent from "../../common/loadder/componentloadder";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import ClearIcon from "@material-ui/icons/Clear";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import PostAddIcon from "@material-ui/icons/PostAdd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import ReplayIcon from "@material-ui/icons/Replay";

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: theme.spacing(1),
    height: 20,
    width: 20,
    minHeight: 20,
  },
  errorSpanMsg: {
    color: "orangered",
  },
  stepButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
}));

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

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

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          className={`styled-modal-close ${classes.closeButton}`}
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

function AssignedFAQs(props) {
  const classes = useStyles();

  const faqApiCall = new FaqService();
  const userGroupApiCall = new userGroupApi();
  const [showLoadder, setshowLoadder] = useState(false);
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
  const [faqUserGroups, setFaqUserGroups] = useState([]);
  const [faqDocs, setFaqDocs] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [openAssignNew, setOpenAssignNew] = useState(false);
  const [docStatus, setDocStatus] = useState([
    {
      id: "Active",
      name: "Active",
    },
    { id: "Inactive", name: "In Active" },
  ]);
  const [formFieldValidation, setformFieldValidation] = useState({
    userGroup: false,
    faqDoc: false,
    assignStatus: false,
  });
  const [UserSelectGroup, setUserSelectGroup] = useState();
  const [UserSelectFaqDoc, setUserSelectFaqDoc] = useState();
  const [UserSelectStatus, setUserSelectStatus] = useState("");
  const [assignForm, setAssignForm] = useState({
    isActive: true,
    groupId: "",
    groupName: "",
    title: "",
    faqId: "",
  });

  useEffect(() => {
    Promise.all([
      props.LoadData(),
      faqApiCall.ListFAQs(false),
      userGroupApiCall.loadUserGroup(),
    ])
      .then(([faqUserGroups, faqDocs, userGroups]) => {
        // setFaqUserGroups(faqUserGroups);
        setFaqDocs(faqDocs);
        setUserGroups(userGroups);
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClickOpenConfirmationModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DisassociateFaq");
    setConfirmationHeaderTittle("Disassociate Faq");
    setConfirmationDialogContextText(
      `Are you sure you want to disassociate ${value[2]} ?`
    );
  };

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
        noMatch: "There are no allocations",
      },
      pagination: {
        jumpToPage: "Goto page:",
      },
    },
    customToolbar: () => {
      return (
        <div className={`maingrid-actions`}>
          <Tooltip title="Assign faq">
            <Button
              variant="contained"
              startIcon={<PostAddIcon />}
              className={`add-icon`}
              onClick={openAssignNewModal}
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
      name: "groupName",
      label: "Group Name",
      options: {
        print: false,
        filter: true,
      },
    },

    {
      name: "title",
      label: "FAQ Doc",
      options: {
        print: false,
        filter: true,
      },
    },
    {
      name: "isActive",
      label: "Status",
      options: {
        print: false,
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return <span>{thisRowData[3] ? "Active" : "Inactive"}</span>;
          }
        },
      },
    },
    {
      name: "groupId",
      label: "groupId",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      name: "faqId",
      label: "faqId",
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
                <Tooltip title="Change doc status">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<SyncAltIcon />}
                    className={`edit-icon`}
                    onClick={() => handleClickChangeStatus(thisRowData)}
                  ></Button>
                </Tooltip>
                <Tooltip title="Remove association">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<ClearIcon />}
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

  function handleClickAddSections(value) {
    var faqId = value[0];
    props.history.push(`/faq/faq-sections/${faqId}/0`);
  }

  function handleClickView(value) {
    var faqId = value[0];
    props.history.push("/faq/view-faq/" + faqId);
  }

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  function openAssignNewModal() {
    setOpenAssignNew(true);
  }

  function handleCloseAssignFaq() {
    setOpenAssignNew(false);
    setUserSelectGroup();
    setUserSelectFaqDoc();
    setUserSelectStatus("");
    setformFieldValidation({
      userGroup: false,
      faqDoc: false,
      assignStatus: false,
    });
  }

  function handleClickChangeStatus(getRowData) {
    setSelectedRowDetails(getRowData);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("ChangeStatusFaq");
    setConfirmationHeaderTittle("Change status");
    let displayMessage;
    if (getRowData[3]) {
      displayMessage = `By changing the status to “Inactive”, 
      users of the user group - ${getRowData[1]} will  be able to access any FAQ documents. 
      Are you sure you want to change status ?`;
    } else {
      displayMessage = `By  changing the assignment status to “Active” 
        the FAQ document - ${getRowData[2]}  will be available on mobile app 
        for  all users  of the user group - ${getRowData[1]}. Are you sure you want to change the status ? `;
    }
    setConfirmationDialogContextText(displayMessage);
  }

  function handleChangeUserGroup(event, value) {
    setUserSelectGroup(value);
  }

  function handleChangeFaqDoc(event, value) {
    setUserSelectFaqDoc(value);
  }

  function handleChangeDocStatus(e) {
    setUserSelectStatus(e.target.value);
  }

  function resetFilterForm() {}

  function assignToGroup(e) {
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    SelectUserGroupValidation();
    SelectFaqDocValidation();
    SelectStatusValidation();
    if (UserSelectGroup && UserSelectFaqDoc && UserSelectStatus != "") {
      SubmitUserForm();
    } else {
      return false;
    }
  }

  function SubmitUserForm() {
    setshowLoadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    var data = assignForm;
    data.faqId = UserSelectFaqDoc.id;
    data.title = UserSelectFaqDoc.title;
    data.groupId = UserSelectGroup.id;
    data.groupName = UserSelectGroup.groupName;
    if (UserSelectStatus == "Active") {
      data.isActive = true;
    } else {
      data.isActive = false;
    }
    props
      .AddData(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Assigned FAQ to  User Group.");
        settoasterServerity("success");
        setTimeout(() => {
          //   setshowLoadder(false);
          setAssignForm({
            isActive: true,
            groupId: "",
            faqId: "",
          });
          setUserSelectGroup();
          setUserSelectFaqDoc();
          setUserSelectStatus("");
          setformFieldValidation({
            userGroup: false,
            faqDoc: false,
            assignStatus: false,
          });
          setOpenAssignNew(false);
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

  function SelectUserGroupValidation() {
    if (UserSelectGroup) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["userGroup"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["userGroup"]: true,
      }));
    }
  }

  function SelectFaqDocValidation() {
    if (UserSelectFaqDoc) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["faqDoc"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["faqDoc"]: true,
      }));
    }
  }

  function SelectStatusValidation() {
    if (UserSelectStatus) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["assignStatus"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["assignStatus"]: true,
      }));
    }
  }

  return (
    <div className="innerpage-container">
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
          to={`/faq/allfaqs`}
          aria-current="page"
          className="inactive"
        >
          FAQs
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          aria-current="page"
          className="active"
        >
          Assign FAQ
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder ? (
        <ComponentLoadderComponent />
      ) : (
        <MuiThemeProvider theme={theme1}>
          {" "}
          <MUIDataTable
            title={""}
            data={
              props.AssignFaqData && props.AssignFaqData.length > 0
                ? props.AssignFaqData
                : []
            }
            columns={columns}
            options={options}
            className="global-table"
          />
        </MuiThemeProvider>
      )}
      <Dialog
        onClose={handleCloseAssignFaq}
        aria-labelledby="customized-dialog-title"
        open={openAssignNew}
        className="global-dialog"
      >
        <ValidatorForm className={`global-form`} onSubmit={assignToGroup}>
          <DialogTitle
            id="customized-dialog-title"
            onClose={handleCloseAssignFaq}
          >
            Assign FAQ doc to group
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">Group</label>
                </Grid>
                <Grid item xs={9}>
                  <Autocomplete
                    id="tags-outlined"
                    options={userGroups}
                    getOptionLabel={(option) => option.groupName}
                    onChange={handleChangeUserGroup}
                    defaultValue={UserSelectGroup}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Group name"
                      />
                    )}
                    className="global-input autocomplete-select"
                  />
                  {formFieldValidation.userGroup ? (
                    <FormHelperText className="error-msg">
                      Please select Group name{" "}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">FAQ</label>
                </Grid>
                <Grid item xs={9}>
                  <Autocomplete
                    id="tags-outlined"
                    options={faqDocs}
                    getOptionLabel={(option) => option.title}
                    onChange={handleChangeFaqDoc}
                    defaultValue={UserSelectFaqDoc}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="FAQ"
                      />
                    )}
                    className="global-input autocomplete-select"
                  />
                  {formFieldValidation.faqDoc ? (
                    <FormHelperText className={`error-msg`}>
                      Please select FAQ{" "}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">Status</label>
                </Grid>
                <Grid item xs={9}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel
                      id="demo-simple-select-outlined-label"
                      shrink={false}
                      className="select-label"
                    >
                      {UserSelectStatus == "" ? "Status" : ""}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      placeholder="Select status"
                      name="covidStateId"
                      onChange={handleChangeDocStatus}
                      value={UserSelectStatus}
                      className="global-input single-select"
                    >
                      <MenuItem value="">None</MenuItem>
                      {docStatus && docStatus.length > 0
                        ? docStatus.map((docStatus) => {
                            return (
                              <MenuItem
                                value={docStatus.id}
                                key={docStatus.id + "_status"}
                              >
                                {docStatus.name}
                              </MenuItem>
                            );
                          })
                        : ""}
                    </Select>
                  </FormControl>
                  {formFieldValidation.assignStatus ? (
                    <FormHelperText className={`error-msg`}>
                      Please select status{" "}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </Grid>
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
            <Button
              onClick={handleCloseAssignFaq}
              className="global-cancel-btn"
            >
              Cancel
            </Button>
          </DialogActions>{" "}
        </ValidatorForm>
      </Dialog>
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

AssignedFAQs.propTypes = {
  AssignFaqData: PropTypes.array.isRequired,
  LoadData: PropTypes.func.isRequired,
  AddData: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    AssignFaqData: state.AssignFaqState,
  };
}

const mapDispatchToProps = {
  LoadData: AssignfaqAction.loadAssignFaq,
  AddData: AssignfaqAction.CreateAssignFaq,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignedFAQs);
