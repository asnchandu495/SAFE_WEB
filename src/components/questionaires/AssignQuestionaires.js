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
  { id: true, name: "Active" },
  { id: false, name: "Inactive" },
];
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

  const [showLoadder, setshowLoadder] = useState(false);
  const [userGroupList, setuserGroupList] = useState();
  const [QuestionaireList, setQuestionaireList] = useState();

  const [formData, SetformData] = useState({});

  const [Modalopen, setModalOpen] = useState(false);
  const handleClickOpenModal = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  function selectedUser(e, value) {
    setselectedUserData(value);
  }

  useEffect(() => {
    Promise.all([
      UserGroup.loadUserGroup(),
      QuestionaireApicall.GetAllQuestionarie(),
    ])
      .then(([getUserList, getQuestionaireList]) => {
        setuserGroupList(getUserList);
        console.log(getUserList);
        console.log(getQuestionaireList);
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
    viewColumns: false,
    download: false,
    disableToolbarSelect: true,
    selectableRows: "multiple",
    // rowsSelected: selectedUsersToGroup,
    onRowSelectionChange: (currentRowSelected, allRowsSelected) => {
      setSelectedUsers(allRowsSelected);
      console.log(allRowsSelected);
      //   var selectedUsersToGroupArray = [];
      //   allRowsSelected.map((user, i) => {
      //     selectedUsersToGroupArray.push(user.dataIndex);
      //   });
      //   setSelectedUsersToTeam(selectedUsersToGroupArray);
    },

    textLabels: {
      selectedRows: {
        text: "user(s) added to team",
      },
      body: {
        noMatch: "There are no users",
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

  const columns = ["Name", "Title", "Location"];

  const data = [
    ["Gabby George", "Business Analyst", "Minneapolis"],
    [
      "Aiden Lloyd",
      "Business Consultant for an International Company and CEO of Tony's Burger Palace",
      "Dallas",
    ],
    ["Jaden Collins", "Attorney", "Santa Ana"],
    ["Franky Rees", "Business Analyst", "St. Petersburg"],
    ["Aaren Rose", null, "Toledo"],
    ["Johnny Jones", "Business Analyst", "St. Petersburg"],
    ["Jimmy Johns", "Business Analyst", "Baltimore"],
    ["Jack Jackson", "Business Analyst", "El Paso"],
    ["Joe Jones", "Computer Programmer", "El Paso"],
    ["Jacky Jackson", "Business Consultant", "Baltimore"],
    ["Jo Jo", "Software Developer", "Washington DC"],
    ["Donna Marie", "Business Manager", "Annapolis"],
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
        <ValidatorForm className={`global-form`} onSubmit="#">
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item cs={12} container>
                <Grid item xs={4}>
                  <label className="">Group Name</label>
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
                      onChange="#"
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
                    <InputLabel
                      id="demo-simple-select-outlined-label"
                      shrink={false}
                      className="select-label"
                    >
                      {formData.emergencyContactId == ""
                        ? "Select emergency contact"
                        : ""}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      placeholder="Select emergency contact"
                      name="emergencyContactId"
                      value="#"
                      onChange="#"
                      className="global-input single-select"
                    >
                      <MenuItem value="">None</MenuItem>
                      {QuestionaireList
                        ? QuestionaireList.map((userGroup) => {
                            return (
                              <MenuItem key={userGroup.id} value={userGroup.id}>
                                {userGroup.groupName}
                              </MenuItem>
                            );
                          })
                        : "no"}
                    </Select>
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
                    >
                      {formData.isActive != "" ? "Select status" : ""}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      placeholder="Select status"
                      name="isActive"
                      value={formData.isActive}
                      onChange="#"
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
            {/* ) : null} */}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              className="global-submit-btn"
              disabled={showLoadder}
            ></Button>
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
          to={`/teams/allteams`}
          className="inactive"
        >
          Teams
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="inactive">
          {/* {selectedTeamInfo.name} */}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Assign Users
        </LinkTo>
      </Breadcrumbs>
      <MuiThemeProvider theme={theme1}>
        {" "}
        <MUIDataTable
          title={""}
          data={data}
          columns={columns}
          options={options}
          className="global-table table-wo-action"
        />
      </MuiThemeProvider>
    </div>
  );
}

export default AssignQuestionaires;
