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
import questionaireService from "../../services/questionaireService";
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

  const [showLoadder, setshowLoadder] = useState(false);
  const [userGroupList, setuserGroupList] = useState();
  const [QuestionaireList, setQuestionaireList] = useState();
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);

  const [assignedqList, setassignedqList] = useState([]);

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [
    ConfirmationModalActionType,
    setConfirmationModalActionType,
  ] = useState("");
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [
    ConfirmationDialogContextText,
    setConfirmationDialogContextText,
  ] = useState("");
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );

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

  const [Modalopen, setModalOpen] = useState(false);
  const handleClickOpenModal = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  function handleChangeGroup(e, value) {
    console.log(value);
    setselectedUserData(value);
  }
  function handleChangeQuestionnaire(e, value) {
    console.log(value);
    setselectedUserQuestionnaire(value);
  }

  const handleClickOpenChangeStatusModal = (value) => {
    var userStatus = value[3];
    console.log(value);
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("ChangeQuestionnaireStatus");
    setConfirmationHeaderTittle("Change questionaire status");
    if (userStatus == "Active") {
      setConfirmationDialogContextText(
        `By changing the status to “Inactive”, users of the user group ${value[3]} will not be able to access any  documents. Are you sure you want to change status ?`
      );
    } else {
      setConfirmationDialogContextText(
        `By changing the assignment status to “Active” the  Contact document  will be available on mobile app for all users of the user group. Are you sure you want to change the status ?`
      );
    }
  };
  const handleClickOpenConfirmationModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("CancelQuestionaire");
    setConfirmationHeaderTittle("Cancel assigned ");
    setConfirmationDialogContextText(
      `Are you sure you want to cancel assignment  to user group `
    );
  };
  function AssignFiltersForm() {
    // console.log("data");
    let selectedData = formData;
    // console.log(selectedData.groupdetails);
    // console.log(selectedData.questionnairedetails);
    // console.log(selectedUserData);
    // console.log(selectedUserQuestionnaire);
    // console.log(selectedData.groupdetails.id);
    selectedData.groupdetails.id = selectedUserData.id;
    selectedData.groupdetails.name = selectedUserData.groupName;
    selectedData.questionnairedetails.id = selectedUserQuestionnaire.id;
    selectedData.questionnairedetails.name = selectedUserQuestionnaire.name;
    console.log("formdata");
    console.log(selectedData);
    questionaireApiCall
      .AssignQuestionnaireToUserGroup(selectedData)
      .then((assignedres) => {
        console.log(assignedres);
      })
      .catch((err) => {
        console.log("error");
        console.log("Only one questionnaire can be active for a user group");
        console.log(err.data.errors);
      });
  }
  function handleChange(e) {
    // let selectedText = e.nativeEvent.target.childNodes[0].data;
    const { name, value } = e.target;
    SetformData((logInForm) => ({
      ...logInForm,
      [name]: value,
    }));
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
      QuestionaireApicall.ListAllAssignedQuestionnaires(),
      UserGroup.loadUserGroup(),
      QuestionaireApicall.GetAllQuestionarie(),
    ])
      .then(([getassignedQuestionaire, getUserList, getQuestionaireList]) => {
        console.log(getassignedQuestionaire);
        setassignedqList(getassignedQuestionaire);
        console.log(formData);
        setuserGroupList(getUserList);
        setQuestionaireList(getQuestionaireList);
        // console.log(getUserList);
        // console.log(getQuestionaireList);
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
    print: false,
    // search: true,
    viewColumns: false,
    download: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: "There are no emergency contact assigned",
      },
    },

    customToolbarSelect: (value, tableMeta, updateValue) => {},

    customToolbar: () => {
      return (
        <div className={`maingrid-actions`}>
          <Tooltip title="Filter By User">
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

    "Group Name",
    "Questionnaire",
    "Status",

    {
      label: "Action",
      name: "",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
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

                <Tooltip title="Change doc status">
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

  const data = [
    [
      "39faff67733241ce4914fb289f4be333",
      "Admin",
      "Questionnaire One",
      "Active",
    ],
    ["01", "Dev", "SSAPSurvey", "Inactive"],
    [
      "39fb483814e8aa8f61233fd98c0f67c4",
      "group name",
      "SSAP Questionnaire Integration",
      "Active",
    ],
    ["02", "HR", "Test Questionnaire", "Active"],
    ["39fb08236ef55c92cc584c03875a6007", "Infra", "Reactjs", "Active"],
    [
      "39fb288a659be3beaa742bbb9214fae7",
      "Sumeru Bangalore",
      "Business Analyst",
      "Active",
    ],
    ["Test user group", "Business Analyst", "Active"],
  ];

  return (
    <div className="innerpage-container">
      <Dialog
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        open={Modalopen}
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
                        defaultValue="#"
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
                  </Grid>
                </Grid>

                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="required">Questionaire</label>
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
                        defaultValue="#"
                        onChange={handleChangeQuestionnaire}
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
                      ></InputLabel>
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
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
          </DialogContent>
          <DialogActions>
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
              to={`/teams/allteams`}
              className="inactive"
            >
              Questionaire
            </LinkTo>

            <LinkTo color="textPrimary" href="#" className="active">
              Assign users to group
            </LinkTo>
          </Breadcrumbs>
          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              title={""}
              data={data}
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

export default AssignQuestionaires;
