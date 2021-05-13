import React, { Fragment, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo, withRouter } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import ActionForm from "./actionForm";
import ActionList from "./actionsList";
import ConfirmationDialog from "../common/confirmdialogbox";
import workflowService from "../../services/workflowService";
import ComponentLoadderComponent from "../common/loadder/componentloadder";

function AddActions(props) {
  const workflowId = props.match.params.wid;
  const activityId = props.match.params.aid;
  const uActivityId = props.match.params.uaid;
  const workflowApiCall = new workflowService();

  const [componentLoadder, setComponentLoadder] = useState(true);
  const [reloadPage, setReloadPage] = useState("NO");
  const [allActivityOptions, setAllActivityOptions] = useState([]);
  const [selectedAction, setSelectedAction] = useState();

  useEffect(() => {
    setComponentLoadder(true);
    Promise.all([workflowApiCall.getAllMasterOptionsForActivity(uActivityId)])
      .then(([allMasterOptionsForActivity]) => {
        setAllActivityOptions(allMasterOptionsForActivity);
        setComponentLoadder(false);
        setReloadPage("NO");
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reloadPage]);

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
          Work Flow
        </LinkTo>
        <LinkTo color="textPrimary" href="#" to="#" className="inactive">
          WorkFlow name
        </LinkTo>
        <LinkTo color="textPrimary" href="#" to="#" className="inactive">
          Activity name
        </LinkTo>
        <LinkTo color="textPrimary" href="#" to="#" className="active">
          Actions
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder ? (
        <ComponentLoadderComponent></ComponentLoadderComponent>
      ) : (
        <Paper className="main-paper main-paper-add-question">
          <Grid container spacing={0}>
            <Grid item xs={12} sm={3} className="list-questions-container">
              <Paper className="list-questions">
                <ActionList
                  allActivityOptions={allActivityOptions}
                  setSelectedAction={setSelectedAction}
                ></ActionList>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Paper className="add-new-question">
                {selectedAction ? (
                  <ActionForm selectedAction={selectedAction}></ActionForm>
                ) : (
                  "Please select an action from the list"
                )}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
}

export default withRouter(AddActions);
