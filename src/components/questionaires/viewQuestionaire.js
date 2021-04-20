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
import questionaireService from "../../services/questionaireService";

function ViewQuestionaire(props) {
  var questionId = props.match.params.id;
  const UserGroupApi = new UserGroupApiServices();
  const [activeStep, setActiveStep] = React.useState(0);
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("300px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [ViewQuestionaireDetails, setViewQuestionaireDetails] = useState([]);

  const [componentLoadder, setComponentLoadder] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [applicationUsers, setApplicationUsers] = useState([]);
  const questionaireApiCall = new questionaireService();

  useEffect(() => {
    questionaireApiCall
      .getSurveyById(questionId)
      .then((questionaireInfo) => {
        setViewQuestionaireDetails(questionaireInfo);
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

  function handleClickGoBack() {
    props.history.push("/questionaires/allquestionaires");
  }

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
  };

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
        <LinkTo color="textPrimary" href="#" to="#" className="inactive">
          Questionnaire
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/questionaires/allquestionaires`}
          className="inactive"
        >
          view Questionnaire
        </LinkTo>
      </Breadcrumbs>
      <Paper className="main-paper">
        <form className={`global-form`}>
          <Grid container spacing={3}>
            <Grid item xs={12} container spacing={3} direction="row">
              <Grid container item xs={12} spacing={3} direction="column">
                <Grid item xs={12} container>
                  <Grid item xs={3}>
                    <label> Title :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>
                      {ViewQuestionaireDetails.name
                        ? ViewQuestionaireDetails.name
                        : ""}
                    </label>
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
          </Grid>
        </form>
      </Paper>
    </div>
  );
}

ViewQuestionaire.propTypes = {
  UserGroupData: PropTypes.array.isRequired,
};

// function mapStateToProps(state, ownProps) {
//   return {
//     UserGroupData: state.usergroup,
//   };
// }

// const mapDispatchToProps = {
//   LoadAllUserGroup: UserGroupAction.loadUserGroup,
// };

export default ViewQuestionaire;
