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

function AddPrimaryUserTeam(props) {
  const teamApiCall = new teamService();
  const teamId = props.match.params.id;
  const UserGroupApi = new UserGroupApiServices();
  const UsersApi = new UserService();

  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("300px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formData, setFormData] = useState({
    teamId: "",
    users: [],
  });
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [showLoadder, setshowLoadder] = useState(false);
  const [applicationUsers, setApplicationUsers] = useState([]);
  const [selectedTeamInfo, setSelectedTeamInfo] = useState();
  const [selectedUsersToGroup, setSelectedUsersToTeam] = useState([]);

  useEffect(() => {
    if (teamId) {
      Promise.all([
        teamApiCall.viewApplicationUserByTeamId(teamId),
        UsersApi.ListApplicationUsers(),
      ])
        .then(([teamInfo, applicationUsers]) => {
          let primaryUsers = teamInfo.users;
          setApplicationUsers(applicationUsers);
          setSelectedTeamInfo(teamInfo);
          setComponentLoadder(false);
          var selectedUsersToGroupArray = [];

          applicationUsers.map((user, i) => {
            const found = primaryUsers.some((u) => u.id === user.id);
            if (found) {
              selectedUsersToGroupArray.push(i);
            } else {
              console.log("no");
            }
          });
          setSelectedUsersToTeam(selectedUsersToGroupArray);
          setComponentLoadder(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
    rowsSelected: selectedUsersToGroup,
    onRowSelectionChange: (currentRowSelected, allRowsSelected) => {
      setSelectedUsers(allRowsSelected);
      console.log(allRowsSelected);
      var selectedUsersToGroupArray = [];
      allRowsSelected.map((user, i) => {
        selectedUsersToGroupArray.push(user.dataIndex);
      });
      setSelectedUsersToTeam(selectedUsersToGroupArray);
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
  };

  const columns = [
    
    {
      name: "firstName",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      label: "Id",
      name: "userId",
      options: {
        // display: "excluded",
        // print: false,
        filter: true,
        sort:true,
      },
    },
    {
      name: "emailID",
      label: "Email Id",
      options: {
        filter: true,
        sort: true,
      },
    },
    // {
    //   name: "contactNumber",
    //   label: "Contact Number",
    //   options: {
    //     filter: true,
    //     sort: true,
    //   },
    // },
  ];

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  function assignUsers() {
    setshowLoadder(true);
    let finalUsers = [];
    selectedUsers.map((user) => {
      finalUsers.push({ id: applicationUsers[user.dataIndex].id });
    });
    var data = formData;
    console.log(data);

    data.teamId = teamId;
    data.users = finalUsers;

    teamApiCall
      .assignUserGroups(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Users added to Team");
        settoasterServerity("success");
        setTimeout(() => {
          props.history.push("/teams/allteams");
          setshowLoadder(false);
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
        setshowLoadder(false);
      });
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
              to={`/teams/allteams`}
              className="inactive"
            >
              Teams
            </LinkTo>
            <LinkTo color="textPrimary" href="#" className="inactive">
              {selectedTeamInfo.name}
            </LinkTo>
            <LinkTo color="textPrimary" href="#" className="active">
              Assign Users
            </LinkTo>
          </Breadcrumbs>
          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              title={""}
              data={applicationUsers ? applicationUsers : []}
              columns={columns}
              options={options}
              className="global-table table-wo-action"
            />
          </MuiThemeProvider>

          <Grid container>
            <Grid item xs={12} className={`global-form inner-table-buttons`}>
              <div className={`form-buttons-container`}>
                <Button
                  variant="contained"
                  type="button"
                  className="global-submit-btn"
                  disabled={showLoadder}
                  onClick={assignUsers}
                >
                  {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
                </Button>
                <Button
                  variant="contained"
                  type="reset"
                  onClick={() =>
                    BreadcrumbNavigation("/teams/allteams")
                  }
                  className="global-cancel-btn"
                >
                  Cancel
                </Button>
              </div>
            </Grid>
          </Grid>
        </>
      )}
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

AddPrimaryUserTeam.propTypes = {
  UserData: PropTypes.array.isRequired,
  LoadAllUser: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    UserData: state.user,
  };
}

const mapDispatchToProps = {
  LoadAllUser: UserAction.loadUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPrimaryUserTeam);
