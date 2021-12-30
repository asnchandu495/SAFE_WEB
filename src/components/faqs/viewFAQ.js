import React, { useState, useEffect, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import HomeIcon from "@material-ui/icons/Home";
import { Link as LinkTo } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import * as GridAction from "../../Redux/Action/gridAction";
import * as faqAction from "../../Redux/Action/faqAction";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ConfirmationDialog from "../common/confirmdialogbox";
import Tooltip from "@material-ui/core/Tooltip";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import EditIcon from "@material-ui/icons/Edit";
import HelpIcon from "@material-ui/icons/Help";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import InfoIcon from "@material-ui/icons/Info";
import FaqService from "../../services/faqService";
import { Delete } from "@material-ui/icons";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  gridDispaly: {
    display: "inline-flex",
  },
  errorSpanMsg: {
    color: "red",
  },
  heading: {
    fontSize: 15,
  },
}));

const languages = [{ id: "English", language: "English" }];

function ViewFaq(props) {
  const anchorRef = useRef(null);
  const faqACM = props.acmData.find((acm) => {
    return acm.module == "faq";
  });
  const faqApiCall = new FaqService();

  const classes = useStyles();

  const getFaqId = props.match.params.id;
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [selectedFaqDetails, setSelectedFaqDetails] = useState({});
  const [expandedFaq, setExpandedFaq] = useState("panel0");
  const [reloadPage, setReloadPage] = useState("NO");

  useEffect(() => {
    // faqApiCall
    //   .getFaqById(props.match.params.id)
    //   .then((res) => {
    //     setSelectedFaqDetails(res);
    //     setcomponentLoadder(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    setcomponentLoadder(true);
    props
      .LoadByID(props.match.params.id)
      .then((res) => {
        if (props.FaqData != "" || props.FaqData != undefined)
          setSelectedFaqDetails(props.FaqData);

        setTimeout(() => {
          setcomponentLoadder(false);
        }, 5000);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const LoadActions = (props) => {
    return props.modulePermission.map((entity) => {
      switch (entity.entity) {
        case "sectionCreate":
          return entity.isAccess ? (
            <Tooltip title="Add new section">
              <Button
                className="create-icon-faq"
                type="button"
                startIcon={<AddIcon />}
                onClick={addNewSection}
              ></Button>
            </Tooltip>
          ) : (
            ""
          );
          break;
        case "update":
          return entity.isAccess ? (
            <Tooltip title="Edit basic details">
              <Button
                className="edit-icon-faq"
                type="button"
                startIcon={<EditIcon />}
                onClick={editFaqBasics}
              ></Button>
            </Tooltip>
          ) : (
            ""
          );
          break;

        default:
          return "";
      }
    });
  };

  function handleClickGoBackToPage() {
    props.history.push("/emergencycontacts/view");
  }

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  const handleChangeFaqSection = (panel) => (event, isExpanded) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  function editFaqBasics() {
    props.history.push(`/faq/add-faq/${props.FaqData.id}`);
  }

  function addNewSection() {
    props.history.push(`/faq/faq-sections/${props.FaqData.id}/0`);
  }

  function editSection(getId) {
    props.history.push(`/faq/faq-sections/${props.FaqData.id}/${getId}`);
  }

  // function deleteSection(getId, getName) {
  //   let sendData = [];
  //   sendData.push(getId);
  //   setSelectedRowDetails(sendData);
  //   setOpenConfirmationModal(true);
  //   setConfirmationModalActionType("DeleteSection");
  //   setConfirmationHeaderTittle("Delete Section");
  //   setConfirmationDialogContextText(
  //     `Are you sure you want to delete ${getName} ?`
  //   );
  // }

  function deleteSection(secID, getFaqId, secName) {
    let sendData = [];
    sendData.push(secID, getFaqId);
    setSelectedRowDetails(sendData);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteSection");
    setConfirmationHeaderTittle("Delete FAQ Section");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${secName} ?`
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
          to={`/faq/allfaqs`}
          aria-current="page"
          className="inactive"
        >
          FAQs
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          aria-current="page"
          className="active"
        >
          {props.FaqData != undefined ? props.FaqData.title : ""}
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder || props.FaqData == "" || props.FaqData == undefined ? (
        <ComponentLoadderComponent />
      ) : (
        <Grid container spacing={3} className="view-faq">
          <Grid item xs={12} className="faq-basic-info">
            <Paper className="main-paper">
              <Grid container spacing={3}>
                <Grid item xs={12} className="faq-title">
                  Basic Info{" "}
                  {/* <Tooltip title="Edit basic details">
                    <Button
                      className="edit-icon-faq"
                      type="button"
                      startIcon={<EditIcon />}
                      onClick={editFaqBasics}
                    ></Button>
                  </Tooltip> */}
                  <LoadActions
                    modulePermission={faqACM.permissions}
                    anchorRef={anchorRef}
                  ></LoadActions>
                  {/* <Tooltip title="Add new section">
                    <Button
                      className="create-icon-faq"
                      type="button"
                      startIcon={<AddIcon />}
                      onClick={addNewSection}
                    ></Button>
                  </Tooltip> */}
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item container xs={12}>
                      <Grid item xs={3}>
                        <label>Title</label>
                      </Grid>
                      <Grid item xs={5}>
                        <span>
                          {props.FaqData != undefined
                            ? props.FaqData.title
                            : ""}
                        </span>
                      </Grid>
                    </Grid>
                    <Grid item container xs={12}>
                      <Grid item xs={3}>
                        <label>Language</label>
                      </Grid>
                      <Grid item xs={5}>
                        <span>
                          {props.FaqData != undefined
                            ? props.FaqData.language
                            : ""}
                        </span>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            <Paper className="view-faq-paper-section">
              {props.FaqData != undefined && props.FaqData.sections != undefined
                ? props.FaqData.sections.map((sec, i) => {
                    let thisPanel = "panel" + i;
                    return (
                      <Accordion
                        square
                        expanded={expandedFaq === thisPanel}
                        onChange={handleChangeFaqSection(thisPanel)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography className="section-heading">
                            {sec.sectionName}
                            <Tooltip title={sec.sectionDescription}>
                              <Button
                                className="edit-icon-faq"
                                type="button"
                                startIcon={<InfoIcon />}
                              ></Button>
                            </Tooltip>
                            <Tooltip title="Edit section">
                              <Button
                                className="create-icon-faq"
                                type="button"
                                startIcon={<EditIcon />}
                                onClick={() => editSection(sec.id)}
                              ></Button>
                            </Tooltip>
                            <Tooltip title="Delete section">
                              <Button
                                className="delete-icon-faq"
                                type="button"
                                startIcon={<DeleteIcon />}
                                onClick={() =>
                                  deleteSection(
                                    sec.id,
                                    getFaqId,
                                    sec.sectionName
                                  )
                                }
                              ></Button>
                            </Tooltip>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container item xs={12}>
                            {sec.questions && sec.questions.length > 0
                              ? sec.questions.map((x, i) => {
                                  return (
                                    <Grid
                                      container
                                      spacing={1}
                                      item
                                      xs={12}
                                      key={`section-container${i}`}
                                      className="question-container"
                                    >
                                      <Grid
                                        item
                                        xs={1}
                                        className="question-icon-container"
                                      >
                                        <HelpIcon></HelpIcon>
                                      </Grid>
                                      <Grid item xs={11}>
                                        <p className="question-name">
                                          {x.questionName}
                                        </p>
                                        <p className="question-answer">
                                          {/* {x.answer} */}
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html: x.answer,
                                            }}
                                          />
                                        </p>
                                      </Grid>
                                    </Grid>
                                  );
                                })
                              : ""}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })
                : ""}
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
      <ConfirmationDialog
        openConfirmationModal={openConfirmationModal}
        ConfirmationHeaderTittle={ConfirmationHeaderTittle}
        ConfirmationDialogContextText={ConfirmationDialogContextText}
        setOpenConfirmationModal={setOpenConfirmationModal}
        setStateSnackbar={setStateSnackbar}
        setToasterMessage={setToasterMessage}
        settoasterServerity={settoasterServerity}
        ConfirmationModalActionType={ConfirmationModalActionType}
        SelectedRowDetails={SelectedRowDetails}
        setReloadPage={setReloadPage}
      />
    </div>
  );
}

ViewFaq.propTypes = {
  FaqData: PropTypes.array.isRequired,
  LoadData: PropTypes.func.isRequired,
  getGridsPages: PropTypes.func.isRequired,
  gridState: PropTypes.array.isRequired,
  updateGridsPages: PropTypes.func.isRequired,
  LoadByID: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    FaqData: state.faqState,
    GridData: state.gridHistory,
    acmData: state.acmData,
  };
}

const mapDispatchToProps = {
  LoadData: faqAction.loadFaq,
  LoadGridsPage: GridAction.getGridsPages,
  UpdateGridsPage: GridAction.updateGridsPages,
  LoadByID: faqAction.loadGetFAQ,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewFaq);
// export default ViewFaq;
