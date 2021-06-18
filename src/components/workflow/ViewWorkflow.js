import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Paper from "@material-ui/core/Paper";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ToasterMessageComponent from "../common/toaster";
import workflowService from "../../services/workflowService";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import Button from "@material-ui/core/Button";

function ViewWorkflow(props) {
  const getworkflowById = props.match.params.id;
  const workflowApiCall = new workflowService();
  const [workflow, setWorkflow] = useState({
    id: getworkflowById,
  });
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [worlflowDetails, setWorkflowDetails] = useState();
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [expandedWorflow, setExpandedWorflow] = useState("panel0");
  const [workflowActivities, setWorkflowActivities] = useState([]);

  useEffect(() => {
    Promise.all([
      workflowApiCall.GetWorkFlowById(getworkflowById),
      workflowApiCall.getWorkflowActivities(getworkflowById),
    ])
      .then(([getWorkflowDetails, getWorkflowActivities]) => {
        setWorkflowDetails(getWorkflowDetails);
        setWorkflowActivities(getWorkflowActivities.selectedWorkflowActivities);
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
  function handleCancel() {
    props.history.push("/workflow/allWorkflow");
  }
  function Row(props) {
    const { row } = props;
    const [openAction, setOpenAction] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpenAction(!openAction)}
            >
              {openAction ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={openAction} timeout="auto" unmountOnExit>
              <Box className="nested-inner-table-box-margin">
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.configurationDataList.map((dataList) => (
                      <TableRow key={dataList.id}>
                        <TableCell component="th" scope="row">
                          {dataList.name}
                        </TableCell>
                        <TableCell>
                          <div
                            dangerouslySetInnerHTML={{ __html: dataList.value }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
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
                  Basic Info
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
                        <label>COVID state from</label>
                      </Grid>
                      <Grid item xs={5}>
                        <span>
                          {worlflowDetails ? worlflowDetails.fromState : ""}
                        </span>
                      </Grid>
                    </Grid>
                    <Grid item container xs={12}>
                      <Grid item xs={3}>
                        <label> COVID state to</label>
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
              {workflowActivities.length > 0
                ? workflowActivities.map((act, i) => {
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
                            {act.name}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails className="nested-table-accordion">
                          {act.options.length > 0
                            ? act.options.map((act) => {
                                return (
                                  <Table
                                    aria-label="simple table"
                                    className="flag-details-table action-details-table"
                                  >
                                    <TableHead>
                                      <TableRow>
                                        <TableCell className="empty-cell" />
                                        <TableCell>Action</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      <Row key={act.id} row={act} />
                                    </TableBody>
                                  </Table>
                                );
                              })
                            : ""}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })
                : "No activities are added"}
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            className={`global-form inline-form`}
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <div className={`form-buttons-container`}>
              <Button
                variant="contained"
                type="button"
                onClick={handleCancel}
                className="global-cancel-btn"
              >
                Close
              </Button>
            </div>
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
