import React, { Fragment, useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import * as UserAction from "../../Redux/Action/userAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import UserGroupApiServices from "../../services/userGroupService";
import UserService from "../../services/usersService";

import ChangeStatusIcon from "@material-ui/icons/SyncAlt";

import * as QuestionaireAction from "../../Redux/Action/assignquestionaireAction";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import teamService from "../../services/teamService";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";

import ConfirmationDialog from "../common/confirmdialogbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";

import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormHelperText from "@material-ui/core/FormHelperText";
import MasterService from "../../services/masterDataService";
import UserGroupService from "../../services/userGroupService";
import QuestionaireService from "../../services/questionaireService";
import FormControl from "@material-ui/core/FormControl";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import PostAddIcon from "@material-ui/icons/PostAdd";
import questionaireService from "../../services/questionaireService";
import ReplayIcon from "@material-ui/icons/Replay";
import TooltipComponent from "../common/tooltip";

const QuestionaireApicall = new QuestionaireService();
const userStatusData = [
  { id: "Active", name: "Active" },
  { id: "Inactive", name: "Inactive" },
];

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

const theme1 = createMuiTheme({
  overrides: {
    MUIDataTable: {
      responsiveScroll: {
        overflowX: "none",
        height: "auto",
        maxHeight: "calc(100vh - 310px) !important",
      },
    },
  },
});

function AssignQuestionaires(props) {
  const UserGroupApi = new UserGroupApiServices();
  const questionaireApiCall = new questionaireService();
  const UserGroup = new UserGroupService();

  const UsersApi = new UserService();

  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("400px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");

  const [selectedUserData, setselectedUserData] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserQuestionnaire, setselectedUserQuestionnaire] = useState();
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);

  const [showLoadder, setshowLoadder] = useState(false);
  const [userGroupList, setuserGroupList] = useState();
  const [QuestionaireList, setQuestionaireList] = useState();
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);

  const [SelectedRowId, setSelectedRowId] = useState("");

  const [assignedqList, setassignedqList] = useState([]);

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");

  const [formData, SetformData] = useState({
    groupdetails: {
      id: "",
      name: "",
    },
    questionnairedetails: {
      id: "",
      name: "",
    },
    status: "",
  });
  const [resetformData, SetresetformData] = useState({
    groupdetails: {
      id: "",
      name: "",
    },
    questionnairedetails: {
      id: "",
      name: "",
    },
    status: "",
  });

  const [formFieldValidation, setformFieldValidation] = useState({
    selectedUserData: false,
    userquestionnaire: false,
    status: false,
  });

  const [Modalopen, setModalOpen] = useState(false);
  const handleClickOpenModal = () => {
    setModalOpen(true);
    // setSelectedRowId(value);
  };

  const handleClose = () => {
    setModalOpen(false);
    resetData();
  };

  function resetData() {
    SetformData(resetformData);
  }

  function resetFilterForm() {
    setselectedUserQuestionnaire();
    setselectedUserData();
    SetformData(resetformData);
  }
  function handleChangeGroup(e, value) {
    setselectedUserData(value);
    if (value) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["selectedUserData"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["selectedUserData"]: true,
      }));
    }
  }
  function handleChangeQuestionnaire(e, value) {
    setselectedUserQuestionnaire(value);
    if (value) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["userquestionnaire"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["userquestionnaire"]: true,
      }));
    }
  }

  const handleClickOpenChangeStatusModal = (value) => {
    var userStatus = value[3];
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("ChangeQuestionnaireStatus");
    setConfirmationHeaderTittle("Change questionnaire status");
    if (userStatus == "Active") {
      setConfirmationDialogContextText(
        `By changing the status to “Inactive”, users of the user group  will not be able to access the questionnaire. Are you sure you want to change status ?`
      );
    } else {
      setConfirmationDialogContextText(
        `By changing the assignment status to “Active” the  questionnaire document  will be available on mobile app for all users of the user group. Are you sure you want to change the status ?`
      );
    }
  };
  const handleClickOpenConfirmationModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("CancelQuestionaire");
    setConfirmationHeaderTittle("Cancel assignment ");
    setConfirmationDialogContextText(
      `Are you sure you want to cancel assignment  to user group ?`
    );
  };

  function SelectUserQuestionnaire() {
    if (selectedUserQuestionnaire) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["userquestionnaire"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["userquestionnaire"]: true,
      }));
    }
  }
  function SelectUserGroup() {
    if (selectedUserData) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["selectedUserData"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["selectedUserData"]: true,
      }));
    }
  }

  function SelectStatus() {
    if (formData.status != "") {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["status"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["status"]: true,
      }));
    }
  }

  function assignQuestionnaire(e) {
    e.preventDefault();

    SelectUserQuestionnaire();
    SelectUserGroup();
    SelectStatus();
    if (
      selectedUserQuestionnaire &&
      selectedUserData &&
      formData.status !== ""
    ) {
      AssignFiltersForm();
    } else {
      return false;
    }
  }

  function AssignFiltersForm() {
    setshowLoadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    var selectedData = formData;

    selectedData.groupdetails.id = selectedUserData.id;
    selectedData.groupdetails.name = selectedUserData.groupName;
    selectedData.questionnairedetails.id = selectedUserQuestionnaire.id;
    selectedData.questionnairedetails.name = selectedUserQuestionnaire.name;
    props
      .AssignQuestionairetoGroup(selectedData)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Questionnaire assigned to User Group.");
        settoasterServerity("success");
        setTimeout(() => {
          setModalOpen(false);
          resetData();
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
  function handleChange(e) {
    // let selectedText = e.nativeEvent.target.childNodes[0].data;
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    SetformData((logInForm) => ({
      ...logInForm,
      [name]: value,
    }));
    if (value != "") {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["status"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["status"]: true,
      }));
    }
  }
  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

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
    Promise.all([
      props.LoadAllAssignQuestionire(),
      UserGroup.loadUserGroup(),
      QuestionaireApicall.GetAllQuestionarie(),
    ])
      .then(([getassignedQuestionaire, getUserList, getQuestionaireList]) => {
        setuserGroupList(getUserList);
        let filteredQuestionnaires = getQuestionaireList.filter((question) => {
          return !question.isSaveasDraft;
        });
        setQuestionaireList(filteredQuestionnaires);
        setComponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const options = {
    filter: false,
    filterType: "dropdown",
    responsive: "scroll",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: 5,
    jumpToPage: true,
    print: false,
    // search: true,
    viewColumns: false,
    download: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: "There are no  assigned users",
      },
      pagination: {
        jumpToPage: "Go to page:",
        rowsPerPage: "Rows Per Page",
      },
    },

    customToolbarSelect: (value, tableMeta, updateValue) => {},

    customToolbar: () => {
      return (
        <div className={`maingrid-actions`}>
          <Tooltip title="Assign Questionnaire to User Group">
            <Button
              variant="contained"
              startIcon={<PostAddIcon />}
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
              if (
                col.name
                  .toString()
                  .toLowerCase()
                  .indexOf(searchQuery.toLowerCase()) >= 0
              ) {
                isFound = true;
              }
            }
          } else {
            if (
              col.toString().toLowerCase().indexOf(searchQuery.toLowerCase()) >=
              0
            ) {
              isFound = true;
            }
          }
        }
      });

      return isFound;
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
      name: "groupDetails",
      label: "User Group",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div>{value && value.name}</div>;
        },
      },
    },
    {
      name: "questionnaireDetails",
      label: "Questionnaire",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div>{value && value.name}</div>;
        },
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: false,
        sort: true,
      },
    },

    {
      label: "Action",
      name: "",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          console.log(thisRowData[1].id);

          var isActive = thisRowData[5];
          if (thisRowData) {
            return (
              <div className={`action-buttons-container`}>
                <Tooltip title="Cancel ">
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

                <Tooltip title="Change  Status">
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

                <Tooltip title="View Workflows">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<AccountTreeIcon />}
                    className={`edit-icon`}
                    onClick={() => handleClickViewWorkflow(thisRowData)}
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

  function handleClickViewWorkflow(value) {
    var groupDetails = value[1];
    props.history.push(`/questionaires/workflow-states/${groupDetails["id"]}`);
  }

  return (
    <div className="innerpage-container">
      <Dialog
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        open={Modalopen}
        className="global-dialog"
        // open={props.Modalopen}
      >
        <DialogTitle id="form-dialog-title" onClose={handleClose}>
          Assign Questionnaire to User Group
          <TooltipComponent
            isMarginBottom={true}
            tooltipMessage={`Questionnaire assigned to a user group in "Active" state will be available for users for whom the selected user group is primary user group to answer  for  "Self Health Check". Only One questionnaire  can be assigned in active state to a user group.`}
          ></TooltipComponent>
        </DialogTitle>
        <ValidatorForm className={`global-form`} onSubmit={assignQuestionnaire}>
          <DialogContent dividers>
            {!componentLoadder ? (
              <Grid container spacing={3}>
                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="required">Group </label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <Autocomplete
                        id="tags-outlined"
                        options={
                          userGroupList && userGroupList.length > 0
                            ? userGroupList
                            : []
                        }
                        getOptionLabel={(option) => option.groupName}
                        defaultValue={selectedUserData}
                        value={selectedUserData ? selectedUserData : ""}
                        onChange={handleChangeGroup}
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select usergroup"
                          />
                        )}
                      />{" "}
                    </FormControl>
                    {formFieldValidation.selectedUserData ? (
                      <FormHelperText className="error-message-select">
                        Please select usergroup{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>

                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="required">Questionnaire</label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <Autocomplete
                        id="tags-outlined"
                        options={
                          QuestionaireList && QuestionaireList.length > 0
                            ? QuestionaireList
                            : []
                        }
                        getOptionLabel={(option) => option.name}
                        defaultValue={selectedUserQuestionnaire}
                        value={
                          selectedUserQuestionnaire
                            ? selectedUserQuestionnaire
                            : ""
                        }
                        onChange={handleChangeQuestionnaire}
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select questionnaire"
                          />
                        )}
                      />{" "}
                    </FormControl>
                    {formFieldValidation.userquestionnaire ? (
                      <FormHelperText className="error-message-select">
                        Please select questionnaire{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="required">Status</label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        id="demo-simple-select-outlined-label"
                        shrink={false}
                        className="select-label"
                      >
                        {formData.status == "" ? "Select status" : ""}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        placeholder="Select status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="global-input single-select"
                      >
                        <MenuItem value="">None</MenuItem>
                        {userStatusData.length > 0
                          ? userStatusData.map((UserStatus) => {
                              return (
                                <MenuItem value={UserStatus.id}>
                                  {UserStatus.name}
                                </MenuItem>
                              );
                            })
                          : ""}
                      </Select>
                    </FormControl>
                    {formFieldValidation.status ? (
                      <FormHelperText className="error-message-select">
                        Please select status{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
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
          </DialogActions>{" "}
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
              to={`/questionaires/allquestionaires`}
              className="inactive"
            >
              Questionnaire
            </LinkTo>

            <LinkTo color="textPrimary" href="#" className="active">
              Assign Questionnaire To User Group
            </LinkTo>
          </Breadcrumbs>
          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              title={""}
              // data={assignedqList ? assignedqList : []}
              data={
                props.AssignQuestionairesData
                  ? props.AssignQuestionairesData
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

AssignQuestionaires.propTypes = {
  AssignQuestionairesData: PropTypes.array.isRequired,
  LoadAllAssignQuestionire: PropTypes.func.isRequired,
  AssignQuestionairetoGroup: PropTypes.func.isRequired,
  ChangeQuestionnaireStatus: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    AssignQuestionairesData: state.assignquestionaireState,
  };
}

const mapDispatchToProps = {
  LoadAllAssignQuestionire: QuestionaireAction.loadAssignQuestionnaire,
  AssignQuestionairetoGroup: QuestionaireAction.assignQuestionaire,
  ChangeQuestionnaireStatus: QuestionaireAction.ChangeQuestionnaireStatus,
};

// export default AssignQuestionaires;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignQuestionaires);
