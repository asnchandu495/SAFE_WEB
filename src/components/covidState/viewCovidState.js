import React, { Fragment, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { connect } from "react-redux";
import * as CovidStateAction from "../../Redux/Action/covidStateAction";
import PropTypes from "prop-types";
import ComponentLoadderComponent from "../common/loadder/componentloadder";

function ViewCovidState(props) {
  const userGroupUpdateid = props.match.params.id;
  const [activeStep, setActiveStep] = React.useState(0);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [formData, SetformData] = useState({
    id: "",
    designationName: "",
    AttendanceGraceTime: "",
    description: "",
  });

  useEffect(() => {
    if (userGroupUpdateid && props.userGroupDatas.length > 0) {
      setComponentLoadder(true);
      SetformData(props.userGroupData);
      setComponentLoadder(false);
    }
  }, [props.userGroupDatas]);

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }
  /**
   * Handle Click Goback
   * Method to redirect on  click of cancel
   */
  function handleClickGoBack() {
    props.history.push("/covidstate/all-covidstate");
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
              to={`/covidstate/all-covidstate`}
              className="inactive"
            >
              Covid States
            </LinkTo>
            <LinkTo color="textPrimary" href="#" className="active">
              {formData.stateName}
            </LinkTo>
          </Breadcrumbs>
          <Paper className={`main-paper`}>
            <form className={`global-form`}>
              <Grid container spacing={3} direction="row">
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label>Covid State Name :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{formData.stateName}</label>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label>Description:</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{formData.description}</label>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label>Message :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{formData.message}</label>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label>Background Color :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{formData.colorName}</label>
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
            </form>
          </Paper>
        </>
      )}
    </div>
  );
}

/**
 * Get Usergroup Id
 * Method to find the user on id return 1st  matched element
 * @param  {} users--covid state
 * @param  {} id---id
 */
export function getUserGroupById(users, id) {
  return users.find((user) => user.id === id) || null;
}
//Validates the data which is recieved fromn the props
ViewCovidState.propTypes = {
  LoadData: PropTypes.array.isRequired,
};

//To update the redux store and merge with props component
function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const emptyObject = {};
  const userGroupData =
    id && state.covidState.length > 0
      ? getUserGroupById(state.covidState, id)
      : emptyObject;

  return {
    userGroupData,
    userGroupDatas: state.covidState,
  };
}

// Customizing the functions your component receives, and how they dispatch actions
const mapDispatchToProps = {
  LoadData: CovidStateAction.loadCovidState,
};

//Connects a React component to a Redux store
export default connect(mapStateToProps, mapDispatchToProps)(ViewCovidState);
