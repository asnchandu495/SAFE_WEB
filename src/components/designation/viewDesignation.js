import React, { Fragment, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { connect } from "react-redux";
import * as UserDesignationAction from "../../Redux/Action/designationAction";
import PropTypes from "prop-types";
import ComponentLoadderComponent from "../common/loadder/componentloadder";

function CreateUserGroup(props) {
  const designationIdFromURL = props.match.params.id;
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
    name: "",
    attendanceGracetime: "",
    description: "",
  });

  useEffect(() => {
    if (designationIdFromURL != 0 && props.userGroupDatas.length > 0) {
      setComponentLoadder(true);
      SetformData(props.userGroupData);
      setComponentLoadder(false);
    }
  }, [props.userGroupDatas]);

  function handleClickGoBack() {
    props.history.push("/designation/all-designation");
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
              to={`/designation/all-designation`}
              className="inactive"
            >
              Designations
            </LinkTo>
            <LinkTo
              color="textPrimary"
              style={{ cursor: "default" }}
              className="active"
            >
              {formData.name}
            </LinkTo>
          </Breadcrumbs>
          <Paper className={`main-paper`}>
            <form className={`global-form`}>
              <Grid container spacing={3} direction="row">
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label>Designation Name :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{formData.name}</label>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label>Attendance Grace Time:</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{formData.attendanceGracetime} Minutes</label>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label>Description :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{formData.description}</label>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label>Designation ID :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{formData.uniqueKey}</label>
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

export function getUserGroupById(users, id) {
  return users.find((user) => user.id === id) || null;
}

CreateUserGroup.propTypes = {
  LoadData: PropTypes.array.isRequired,
  AddData: PropTypes.array.isRequired,
  UpdateData: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const emptyObject = {};
  const userGroupData =
    id && state.userDesignation.length > 0
      ? getUserGroupById(state.userDesignation, id)
      : emptyObject;
  return {
    userGroupData,
    userGroupDatas: state.userDesignation,
  };
}

const mapDispatchToProps = {
  LoadData: UserDesignationAction.loadUserDesignation,
  AddData: UserDesignationAction.createUserDesignation,
  UpdateData: UserDesignationAction.updateUserDesignation,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUserGroup);
