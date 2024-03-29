import React, { Fragment, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { connect } from "react-redux";
import * as UserGroupAction from "../../Redux/Action/userGroupAction";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import UserGroupApiServices from "../../services/userGroupService";
import teamService from "../../services/teamService";
import ComponentLoadderComponent from "../common/loadder/componentloadder";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      className="assigned-users-table"
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div className="grid-container">{children}</div>
        </Box>
      )}
    </div>
  );
}
//Validates the data received from the props
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function ViewTeam(props) {
  var userGroupId = props.match.params.id;
  const UserGroupApi = new UserGroupApiServices();
  const [activeStep, setActiveStep] = React.useState(0);
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("300px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [ViewTeamDetails, setViewTeamDetails] = useState([]);
  const [componentLoadder, setcomponentLoadder] = useState(true);

  const [tabValue, setTabValue] = useState(0);
  const [applicationUsers, setApplicationUsers] = useState([]);
  const teamApiCall = new teamService();

  useEffect(() => {
    setcomponentLoadder(true);
    teamApiCall
      .viewApplicationUserByTeamId(userGroupId)
      .then((teamInfo) => {
        setViewTeamDetails(teamInfo);
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTabChangeIndex = (index) => {
    setTabValue(index);
  };

  //Method to redirect  on click of cancel
  function handleClickGoBack() {
    props.history.push("/teams/allteams");
  }

  //set options for the MUI datatable
  const options = {
    filter: false,
    filterType: "dropdown",
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: false,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: 5,
    sortOrder: {
      name: "name",
      direction: "asc",
    },
  };

  //set the columns for MUI Datatable
  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "emailId",
      label: "Email ID",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  // function BreadcrumbNavigation(getRoute) {
  //   props.history.push(getRoute);
  // }

  return (
    <div className="innerpage-container">
      {!componentLoadder ? (
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
          <LinkTo color="textPrimary" href="#" className="active">
            {ViewTeamDetails.name}
          </LinkTo>
        </Breadcrumbs>
      ) : null}
      {!componentLoadder ? (
        <Paper className="main-paper">
          <form className={`global-form`}>
            <Grid container spacing={3}>
              <Grid item xs={12} container spacing={3} direction="row">
                <Grid item xs={12} container>
                  <Grid item xs={3}>
                    <label>Team Name :</label>
                  </Grid>
                  <Grid item xs={9}>
                    <label>{ViewTeamDetails.name}</label>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={3}>
                    <label>Description :</label>
                  </Grid>
                  <Grid item xs={9}>
                    {ViewTeamDetails.description}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={3}>
                    <label> Manager :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>
                      {ViewTeamDetails.manager
                        ? ViewTeamDetails.manager.name
                        : ""}
                    </label>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={3}>
                    <label>Team ID :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{ViewTeamDetails.uniqueKey}</label>
                  </Grid>
                </Grid>

                <Grid container item xs={12} spacing={3} direction="column">
                  <Grid item xs={12} container>
                    <Grid item xs={3}>
                      Users:
                    </Grid>
                    <Grid item xs={9} className="inner-tabs">
                      <MUIDataTable
                        title={""}
                        data={
                          ViewTeamDetails.users &&
                          ViewTeamDetails.users.length > 0
                            ? ViewTeamDetails.users
                            : []
                        }
                        columns={columns}
                        options={options}
                        className="global-table"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="center"
                >
                  <div className={`form-buttons-container`}>
                    <Button
                      variant="contained"
                      type="button"
                      onClick={handleClickGoBack}
                      className="global-cancel-btn"
                    >
                      Close
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Paper>
      ) : (
        <ComponentLoadderComponent />
      )}
    </div>
  );
}
//Validate the data recieved from the props
ViewTeam.propTypes = {
  UserGroupData: PropTypes.array.isRequired,
};

//Update the redux the store and merge them into props
function mapStateToProps(state, ownProps) {
  return {
    UserGroupData: state.usergroup,
  };
}
// Customizing the functions your component receives, and how they dispatch actions
const mapDispatchToProps = {
  LoadAllUserGroup: UserGroupAction.loadUserGroup,
};

export default ViewTeam;
