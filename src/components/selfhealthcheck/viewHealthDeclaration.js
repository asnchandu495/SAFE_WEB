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
import Tooltip from "@material-ui/core/Tooltip";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import Paper from "@material-ui/core/Paper";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import HelpIcon from "@material-ui/icons/Help";
import InfoIcon from "@material-ui/icons/Info";

function ViewHealthDeclaration(props) {
  const [expandedFaq, setExpandedFaq] = useState("panel0");

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
          to={`/selfhealthcheck/configurehealth`}
          className="inactive"
        >
          Health
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Health Declarations
        </LinkTo>
      </Breadcrumbs>

      <Grid container spacing={3} className="view-faq">
        <Grid item xs={12} className="faq-basic-info">
          <Paper className="main-paper">
            <Grid container spacing={3}>
              <Grid item xs={12} className="faq-title">
                Info{" "}
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item container xs={12}>
                    <Grid item xs={3}>
                      <label>Title</label>
                    </Grid>
                    <Grid item xs={5}>
                      <span>
                        Self health result of user Gabby George on 1/7/2020
                      </span>
                    </Grid>
                  </Grid>
                  <Grid item container xs={12}>
                    <Grid item xs={3}>
                      <label>Result</label>
                    </Grid>
                    <Grid item xs={5}>
                      <span>Suspected</span>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
          <Paper className="view-faq-paper-section">
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1c-content"
              >
                <Typography className="section-heading"></Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container item xs={12}>
                  <Grid
                    container
                    spacing={1}
                    item
                    xs={12}
                    // key={`section-container${i}`}
                    className="question-container"
                  >
                    <Grid item xs={1} className="question-icon-container">
                      <HelpIcon></HelpIcon>
                    </Grid>
                    <Grid item xs={11}>
                      <p className="question-name">
                        Are you experiencing any of the following ?
                      </p>
                      <p className="question-answer">
                        {" "}
                        <Tooltip title="#">
                          <Button className="edit-icon-faq" type="button">
                            NO
                          </Button>
                        </Tooltip>
                      </p>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={1}
                    item
                    xs={12}
                    // key={`section-container${i}`}
                    className="question-container"
                  >
                    <Grid item xs={1} className="question-icon-container">
                      <HelpIcon></HelpIcon>
                    </Grid>
                    <Grid item xs={11}>
                      <p className="question-name">
                        Did you come in contact with COVID +ve people in last 14
                        days?
                      </p>
                      <p className="question-answer">
                        <Tooltip title="Edit section">
                          <Button className="create-icon-faq" type="button">
                            YES
                          </Button>
                        </Tooltip>
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
export default ViewHealthDeclaration;
