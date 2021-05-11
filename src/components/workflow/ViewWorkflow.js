import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HelpIcon from "@material-ui/icons/Help";
import PropTypes from "prop-types";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ToasterMessageComponent from "../common/toaster";
import workflowService from "../../services/workflowService";
import ComponentLoadderComponent from "../common/loadder/componentloadder";

function ViewWorkflow(props) {
  const getworkflowById = props.match.params.id;
  const workflowApiCall = new workflowService();
  const [workflow, setWorkflow] = useState({
    id: getworkflowById,
  });
  const sections = [
    {
      id: "39fac56b2c443e198750a9aee057f85a",
      faqId: "39fac56ac1bdb2a92c317ab0c0a4b3c1",
    },
    {
      id: "39fac56b2c443e198750a9aee057f85a",
      faqId: "39fac56ac1bdb2a92c317ab0c0a4b3c1",
    },
    {
      id: "39fac56b2c443e198750a9aee057f85a",
      faqId: "39fac56ac1bdb2a92c317ab0c0a4b3c1",
    },
  ];
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [worlflowDetails, setWorkflowDetails] = useState();
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [expandedWorflow, setExpandedWorflow] = useState("panel0");

  useEffect(() => {
    workflowApiCall
      .GetWorkFlowById(getworkflowById)
      .then((getWorkflowDetails) => {
        setWorkflowDetails(getWorkflowDetails);
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function goBack() {
    props.history.push("/emergencycontacts/view");
  }
  const handleChangeWorkflowSection = (panel) => (event, isExpanded) => {
    setExpandedWorflow(isExpanded ? panel : false);
  };

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
          to={`/workflow/allWorkflow`}
          className="inactive"
        >
          Workflow
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          {worlflowDetails ? worlflowDetails.name : ""}
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder ? (
        <ComponentLoadderComponent />
      ) : (
        <Grid container spacing={3} className="view-faq">
          <Grid item xs={12} className="faq-basic-info">
            <Paper className="main-paper">
              <Grid container spacing={3}>
                <Grid item xs={12} className="faq-title">
                  Basic info
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item container xs={12}>
                      <Grid item xs={3}>
                        <label>Workflow Name</label>
                      </Grid>
                      <Grid item xs={5}>
                        <span>
                          {worlflowDetails ? worlflowDetails.name : ""}
                        </span>
                      </Grid>
                    </Grid>
                    <Grid item container xs={12}>
                      <Grid item xs={3}>
                        <label>Group Name</label>
                      </Grid>
                      <Grid item xs={5}>
                        <span>
                          {worlflowDetails ? worlflowDetails.groupName : ""}
                        </span>
                      </Grid>
                    </Grid>
                    <Grid item container xs={12}>
                      <Grid item xs={3}>
                        <label> From State</label>
                      </Grid>
                      <Grid item xs={5}>
                        <span>
                          {worlflowDetails ? worlflowDetails.fromState : ""}
                        </span>
                      </Grid>
                    </Grid>
                    <Grid item container xs={12}>
                      <Grid item xs={3}>
                        <label> To State</label>
                      </Grid>
                      <Grid item xs={5}>
                        <span>
                          {worlflowDetails ? worlflowDetails.toState : ""}
                        </span>
                      </Grid>
                    </Grid>
                    {worlflowDetails ? (
                      <Grid item container xs={12}>
                        <Grid item xs={3}>
                          <label> Status</label>
                        </Grid>
                        <Grid item xs={5}>
                          <span>
                            {worlflowDetails.isActive == true
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </Grid>
                      </Grid>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            <Paper className="view-faq-paper-section">
              {sections.map((sec, i) => {
                let thisPanel = "panel" + i;
                return (
                  <Accordion
                    defaultExpanded
                    square
                    expanded={expandedWorflow === thisPanel}
                    onChange={handleChangeWorkflowSection(thisPanel)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography className="section-heading">
                        Workflow Data
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container item xs={12}>
                        <Grid
                          container
                          spacing={1}
                          item
                          xs={12}
                          className="question-container"
                        >
                          <Grid item xs={11}>
                            <p className="question-name">
                              Lorem ipsum dolor sit amet. Ad alias earum sit
                              quas sequi est eaque molestias. Eum dolor atque
                              hic porro ratione qui dolores numquam est omnis
                              consequatur id error odit in dolore molestias. Aut
                              ipsa fugit id quos doloribus et officia debitis.
                              Eos culpa autem ea accusantium delectus qui
                              similique officiis et enim explicabo.
                            </p>

                            <p className="question-answer"></p>
                          </Grid>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Paper>
          </Grid>
        </Grid>
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

export default ViewWorkflow;
