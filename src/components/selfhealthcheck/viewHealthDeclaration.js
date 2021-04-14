import React, { Fragment, useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as globalSettingAction from "../../Redux/Action/globalSettingAction";
import moment from "moment";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import Paper from "@material-ui/core/Paper";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HelpIcon from "@material-ui/icons/Help";
import healthCheckService from "../../services/healthCheckService";

function ViewHealthDeclaration(props) {
  var ResponseId = props.match.params.id;
  const HealthCheckApiCall = new healthCheckService();

  const [expandedFaq, setExpandedFaq] = useState("panel0");
  const [allAnswersbyResponseId, getAllAnswersbyResponseId] = useState([]);
  const [componentLoadder, setComponentLoadder] = useState(true);

  useEffect(() => {
    props.loadGlobalSettingWithoutAPICall();
    HealthCheckApiCall.getAllResponsesbyId(ResponseId)
      .then((response) => {
        getAllAnswersbyResponseId(response);
        setComponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChangeAnswerSection = (panel) => (event, isExpanded) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  function RenderAnswers(props) {
    console.log(props.questionDetails.questionType);
    switch (props.questionDetails.questionType) {
      case "Boolean":
        return (
          <p className="question-answer">
            {props.questionDetails.answer ? "Yes" : "No"}
          </p>
        );
      case "Time":
        return (
          <p className="question-answer">
            {moment(props.questionDetails.forAnswerDate).format(
              props.loadGlobalSettingsData
                ? props.loadGlobalSettingsData.timeFormat
                : "dd/MM/yyyy"
            )}
          </p>
        );
      case "Numeric":
        return (
          <p className="question-answer">{props.questionDetails.answer}</p>
        );
      case "Date":
        return (
          <p className="question-answer">
            {moment(props.questionDetails.answer).format(
              props.loadGlobalSettingsData
                ? props.loadGlobalSettingsData.dateFormat
                : "dd/MM/yyyy"
            )}
          </p>
        );
      case "FreeText":
        return (
          <p className="question-answer">{props.questionDetails.answer}</p>
        );
      case "SingleChoice":
        return (
          <p className="question-answer">{props.questionDetails.option}</p>
        );
      case "MultiChoice":
        return (
          <p className="question-answer">
            {props.questionDetails.surveyReplyChoiceAnswer &&
            props.questionDetails.surveyReplyChoiceAnswer.length > 0 ? (
              <ul className="question_choices_list">
                {props.questionDetails.surveyReplyChoiceAnswer.map((an) => {
                  return <li key={`choices_${an.id}`}>{an.option}</li>;
                })}
              </ul>
            ) : (
              "Nil"
            )}
          </p>
        );
      default:
        return <h4>Not found</h4>;
    }
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
          to={`/selfhealthcheck/configurehealth`}
          className="inactive"
        >
          Configure self health-check
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Health Declarations
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
                  <Grid container spacing={3}>
                    <Grid item container xs={12}>
                      <Grid item xs={7}>
                        <label>
                          Self health result of user Gabby George on 1/7/2020
                        </label>
                      </Grid>
                      <Grid item xs={5}>
                        <span>Status : Suspected</span>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            <Paper className="view-faq-paper-section">
              {allAnswersbyResponseId.length > 0
                ? allAnswersbyResponseId.map((ans, i) => {
                    let thisPanel = "panel" + i;
                    return (
                      <Accordion
                        square
                        expanded={expandedFaq === thisPanel}
                        onChange={handleChangeAnswerSection(thisPanel)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1c-content"
                        >
                          <Typography className="section-heading">
                            Question {i + 1} (Type : {ans.questionType})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container item xs={12}>
                            <Grid
                              container
                              spacing={1}
                              item
                              xs={12}
                              key={`ans-container${i}`}
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
                                <p className="question-name">{ans.question}</p>
                                <RenderAnswers
                                  questionDetails={ans}
                                  loadGlobalSettingsData={
                                    props.loadGlobalSettingsData
                                  }
                                ></RenderAnswers>
                              </Grid>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })
                : "No answers"}
            </Paper>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

ViewHealthDeclaration.propTypes = {
  loadGlobalSettingWithoutAPICall: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    loadGlobalSettingsData: state.loadGlobalSettingsData,
  };
}

const mapDispatchToProps = {
  loadGlobalSettingWithoutAPICall:
    globalSettingAction.loadGlobalSettingWithoutAPICall,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewHealthDeclaration);
