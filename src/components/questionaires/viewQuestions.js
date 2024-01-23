import React, { useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link as LinkTo } from "react-router-dom";
import { ValidatorForm } from "react-material-ui-form-validator";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import ListofQuestions from "./listofQuestions";
import FreetextDetails from "./selectedQuestionDetails/freetextDetails";
import BooleanDetails from "./selectedQuestionDetails/booleanDetails";
import DateDetails from "./selectedQuestionDetails/dateDetails";
import TimeDetails from "./selectedQuestionDetails/timeDetails";
import NumericDetails from "./selectedQuestionDetails/numericDetails";
import SingleChoiceDetails from "./selectedQuestionDetails/singlechoiceDetails";
import MultiChoiceDetails from "./selectedQuestionDetails/multichoiceDetails";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as globalSettingAction from "../../Redux/Action/globalSettingAction";
import questionaireService from "../../services/questionaireService";

function ViewQuestions(props) {
  const questionaireId = props.match.params.id;
  const questionaireApiCall = new questionaireService();
  const [questionTypeForm, setQuestionTypeForm] = useState({
    questionType: "",
  });
  const [ViewQuestionaireDetails, setViewQuestionaireDetails] = useState([]);
  const [addQuestionBoolean, setAddQuestionBoolean] = useState({
    id: "",
    questionType: "",
    question: "",
    description: "",
    positiveRedFlagResponse: "",
    redFlagResponse: "",
    isPositiveConfirmity: true,
    isPositiveConfirmityRedFlag: false,
    isMandatory: false,
  });
  const [selectedQuestionDetails, setSelectedQuestionDetails] = useState();
  // const [selectedfreetextDetails, setSelectedfreetextDetails] = useState();
  const [reloadListPage, setReloadListPage] = useState("No");

  useEffect(() => {
    props.loadGlobalSettingWithoutAPICall();
    questionaireApiCall
      .getSurveyById(questionaireId)
      .then((questionaireInfo) => {
        setViewQuestionaireDetails(questionaireInfo);
        console.log(questionaireInfo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reloadListPage]);
//Method on click of next
  function gotoAddQuestion() {
    props.history.push(`/questionaires/add-questions/${questionaireId}/0`);
  }
//componnet for rendering flag
  function RenderFlagComponent(props) {
    switch (props.currentQuestionsType) {
      case "Boolean":
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align">
              <BooleanDetails
                selectedQuestionDetails={selectedQuestionDetails}
                setSelectedQuestionDetails={setSelectedQuestionDetails}
                setReloadListPage={props.setReloadListPage}
                ViewQuestionaireDetails={ViewQuestionaireDetails}
              ></BooleanDetails>
            </Grid>
          </Grid>
        );

      case "FreeText":
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align">
              <FreetextDetails
                selectedQuestionDetails={selectedQuestionDetails}
                setSelectedQuestionDetails={setSelectedQuestionDetails}
                setReloadListPage={props.setReloadListPage}
                ViewQuestionaireDetails={ViewQuestionaireDetails}
              ></FreetextDetails>{" "}
            </Grid>
          </Grid>
        );

      case "Date":
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align">
              <DateDetails
                selectedQuestionDetails={selectedQuestionDetails}
                setSelectedQuestionDetails={setSelectedQuestionDetails}
                loadGlobalSettingsData={props.loadGlobalSettingsData}
                setReloadListPage={props.setReloadListPage}
                ViewQuestionaireDetails={ViewQuestionaireDetails}
              ></DateDetails>{" "}
            </Grid>
          </Grid>
        );

      case "Time":
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align">
              <TimeDetails
                selectedQuestionDetails={selectedQuestionDetails}
                setSelectedQuestionDetails={setSelectedQuestionDetails}
                loadGlobalSettingsData={props.loadGlobalSettingsData}
                setReloadListPage={props.setReloadListPage}
                ViewQuestionaireDetails={ViewQuestionaireDetails}
              ></TimeDetails>{" "}
            </Grid>
          </Grid>
        );

      case "Numeric":
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align">
              <NumericDetails
                selectedQuestionDetails={selectedQuestionDetails}
                setSelectedQuestionDetails={setSelectedQuestionDetails}
                setReloadListPage={props.setReloadListPage}
                ViewQuestionaireDetails={ViewQuestionaireDetails}
              ></NumericDetails>{" "}
            </Grid>
          </Grid>
        );

      case "SingleChoice":
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align">
              <SingleChoiceDetails
                selectedQuestionDetails={selectedQuestionDetails}
                setSelectedQuestionDetails={setSelectedQuestionDetails}
                setReloadListPage={props.setReloadListPage}
                ViewQuestionaireDetails={ViewQuestionaireDetails}
              ></SingleChoiceDetails>{" "}
            </Grid>
          </Grid>
        );

      case "MultiChoice":
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align">
              <MultiChoiceDetails
                selectedQuestionDetails={selectedQuestionDetails}
                setSelectedQuestionDetails={setSelectedQuestionDetails}
                setReloadListPage={props.setReloadListPage}
                ViewQuestionaireDetails={ViewQuestionaireDetails}
              ></MultiChoiceDetails>{" "}
            </Grid>
          </Grid>
        );

      default:
        return (
          <Grid container spacing={0}>
            <Grid item xs={11} sm={11} className="center-align-full-height">
              <h4 className="title-padding">
                Please select a question to see the details or else add a new
                question by clicking the plus button at bottom
              </h4>
            </Grid>
          </Grid>
        );
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
          to={`/questionaires/allquestionaires`}
          className="inactive"
        >
          Questionnaire
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          {ViewQuestionaireDetails.name}
        </LinkTo>
        {/* <LinkTo color="textPrimary" href="#" className="active">
          View Question
        </LinkTo> */}
      </Breadcrumbs>
      <Paper className="main-paper main-paper-add-question">
        <Grid container spacing={0}>
          <Grid item xs={12} sm={3} className="list-questions-container">
            <Paper className="list-questions">
              <ListofQuestions
                setSelectedQuestionDetails={setSelectedQuestionDetails}
                reloadListPage={reloadListPage}
                // setSelectedfreetextDetails={setSelectedfreetextDetails}
              ></ListofQuestions>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Paper className="add-new-question">
              <ValidatorForm className={`global-form full-height`}>
                {/* <Grid container spacing={0}> */}
                {/* <Grid item xs={11} sm={11} className="center-align"> */}
                <RenderFlagComponent
                  currentQuestionsType={
                    selectedQuestionDetails
                      ? selectedQuestionDetails.questionType
                      : ""
                  }
                  loadGlobalSettingsData={props.loadGlobalSettingsData}
                  setReloadListPage={setReloadListPage}
                ></RenderFlagComponent>

                {/* <QuestionDetails
                      selectedQuestionDetails={selectedQuestionDetails}
                    ></QuestionDetails>
                    <FreetextDetails
                      selectedfreetextDetails={selectedfreetextDetails}
                    ></FreetextDetails> */}
                {/* </Grid> */}
                {/* </Grid> */}
              </ValidatorForm>
              <SpeedDial
                hidden={ViewQuestionaireDetails.isAssignedToUserGroup}
                ariaLabel="SpeedDial example"
                // hidden={false}
                icon={<SpeedDialIcon />}
                direction={`up`}
                className="add-question-speeddial"
                onClick={gotoAddQuestion}
              ></SpeedDial>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

ViewQuestions.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewQuestions);
