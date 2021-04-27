import React, { Fragment, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import ActionForm from "./actionForm";
import ActionList from "./actionsList";

function AddActions(props) {
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
      <Paper className="main-paper main-paper-add-question">
        <Grid container spacing={0}>
          <Grid item xs={12} sm={3} className="list-questions-container">
            <Paper className="list-questions">
              <ActionList></ActionList>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Paper className="add-new-question">
              <ActionForm></ActionForm>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default AddActions;
