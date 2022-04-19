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

function ViewUserGroup(props) {
  var userGroupId = props.match.params.id;
  const UserGroupApi = new UserGroupApiServices();
  const [activeStep, setActiveStep] = React.useState(0);
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("300px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [viewUserGroupDetails, setviewUserGroupDetails] = useState([]);
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    UserGroupApi.getGroupInfo(userGroupId)
      .then((groupInfo) => {
        setviewUserGroupDetails(groupInfo);
        setComponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //Handle change on change of tab newValue(tab index value)
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTabChangeIndex = (index) => {
    setTabValue(index);
  };

  //Method to redirect to list component(index)on click of cancel
  function handleClickGoBack() {
    props.history.push("/usergroups/allusergroups");
  }

  //set the MUI Datatable options
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
      name: "firstName",
      direction: "asc",
    },
  };

  //set the MUI Datatable columns
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
      name: "emailId",
      label: "Email ID",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
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
          to={`/usergroups/allusergroups`}
          className="inactive"
        >
          User groups
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          {viewUserGroupDetails.groupName}
        </LinkTo>
      </Breadcrumbs>
      <Paper className="main-paper">
        <form className={`global-form`}>
          <Grid container spacing={3}>
            <Grid item xs={12} container spacing={3} direction="row">
              <Grid item xs={12} container>
                <Grid item xs={3}>
                  <label>User Group Name :</label>
                </Grid>
                <Grid item xs={9}>
                  <label>{viewUserGroupDetails.groupName}</label>
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <Grid item xs={3}>
                  <label>Description :</label>
                </Grid>
                <Grid item xs={9}>
                  {viewUserGroupDetails.description}
                </Grid>
              </Grid>
              <Grid container item xs={12} spacing={3} direction="column">
                <Grid item xs={12} container>
                  <Grid item xs={3}>
                    Users:
                  </Grid>
                  <Grid item xs={9} className="inner-tabs">
                    <AppBar position="static" color="default">
                      <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                      >
                        <Tab label="Primary Users" {...a11yProps(0)} />
                        <Tab label="Secondary Users" {...a11yProps(1)} />
                      </Tabs>
                    </AppBar>
                    <TabPanel value={tabValue} index={0}>
                      <MUIDataTable
                        title={""}
                        data={
                          viewUserGroupDetails.primaryapplicationuserDetails &&
                          viewUserGroupDetails.primaryapplicationuserDetails
                            .length > 0
                            ? viewUserGroupDetails.primaryapplicationuserDetails
                            : []
                        }
                        columns={columns}
                        options={options}
                        className="global-table"
                      />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                      <MUIDataTable
                        title={""}
                        data={
                          viewUserGroupDetails.secondaryapplicationuserDetails &&
                          viewUserGroupDetails.secondaryapplicationuserDetails
                            .length > 0
                            ? viewUserGroupDetails.secondaryapplicationuserDetails
                            : []
                        }
                        columns={columns}
                        options={options}
                        className="global-table"
                      />
                    </TabPanel>
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
    </div>
  );
}
//Validate the data recieved from the props
ViewUserGroup.propTypes = {
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
//Connect the component with redux store
export default connect(mapStateToProps, mapDispatchToProps)(ViewUserGroup);
