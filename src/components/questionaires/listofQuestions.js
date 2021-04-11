import React, { useState, Fragment, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { useParams } from "react-router-dom";
import questionaireService from "../../services/questionaireService";
import { connect } from "react-redux";
import * as QuestionAction from "../../Redux/Action/questionAction";
import PropTypes from "prop-types";
import ComponentLoadderComponent from "../common/loadder/componentloadder";

function ListofQuestions(props) {
  const { id } = useParams();
  const questionaireApiCall = new questionaireService();
  const [selectedIndex, setSelectedIndex] = useState("001");
  const [selectedSurveyQuestions, setSelectedSurveyQuestions] = useState([]);
  const [componentLoadder, setComponentLoadder] = useState(true);
  useEffect(() => {
    // questionaireApiCall
    //   .GetAllQuestionsBySurveyId(id)
    props
      .LoadAllQuestions(id)
      .then((res) => {
        console.log(res);
        setSelectedSurveyQuestions(res);
        console.log(selectedSurveyQuestions);
        setComponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleListItemClick = (quesId, questionType) => {
    console.log("questiontype");
    console.log(questionType);
    setSelectedIndex(quesId);
    if (questionType == "Boolean") {
      questionaireApiCall
        .GetBooleanQuestionById(quesId)
        .then((booleanQuestionResponse) => {
          // console.log(booleanQuestionResponse);
          props.setSelectedQuestionDetails(booleanQuestionResponse);
        })
        .catch((err) => {
          console.log("error");
        });
    } else if (questionType == "FreeText") {
      // props.setSelectedfreetextDetails(questionType);
      questionaireApiCall
        .GetFreeTextQuestion(quesId)
        .then((freetextQuestionResponse) => {
          // console.log(freetextQuestionResponse);
          props.setSelectedQuestionDetails(freetextQuestionResponse);
        })
        .catch((err) => {
          console.log("error");
        });
    } else if (questionType == "Date") {
      console.log("date selected");
      questionaireApiCall
        .GetDateTimeById(quesId)
        .then((dateQuestionResponse) => {
          console.log("date");
          console.log(dateQuestionResponse.positiveConformityForDate);
          props.setSelectedQuestionDetails(dateQuestionResponse);
        });
    } else if (questionType == "Time") {
      console.log("time selected");
      questionaireApiCall
        .GetTimeQuestionById(quesId)
        .then((timeQuestionResponse) => {
          console.log("time");
          console.log(timeQuestionResponse);
          props.setSelectedQuestionDetails(timeQuestionResponse);
        });
    } else if (questionType == "Numeric") {
      console.log("numeric selected");
      questionaireApiCall
        .GetNumeicQuestionById(quesId)
        .then((numericQuestionResponse) => {
          console.log("time");
          console.log(numericQuestionResponse);
          props.setSelectedQuestionDetails(numericQuestionResponse);
        });
    } else if (questionType == "SingleChoice") {
      console.log("SingleChoice selected");
      questionaireApiCall
        .GetSingleChoiceQuestion(quesId)
        .then((numericQuestionResponse) => {
          console.log("time");
          console.log(numericQuestionResponse);
          props.setSelectedQuestionDetails(numericQuestionResponse);
        });
    } else if (questionType == "MultiChoice") {
      console.log("MultiChoice selected");
      questionaireApiCall
        .GetMultipleChoicQuestionById(quesId)
        .then((numericQuestionResponse) => {
          console.log("time");
          console.log(numericQuestionResponse);
          props.setSelectedQuestionDetails(numericQuestionResponse);
        });
    } else {
      console.log("response");
    }
  };

  function searchQuestionnaire(e) {
    var input = e.target.value;
    var filter = input.toLowerCase();
    var nodes = document.getElementsByClassName("questionnairelistitems");

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].innerText.toLowerCase().includes(filter)) {
        nodes[i].style.display = "block";
      } else {
        nodes[i].style.display = "none";
      }
    }
  }

  return (
    <List component="nav">
      <ListItem className="search-list-input">
        <TextField
          variant="outlined"
          fullWidth
          id="groupName"
          placeholder="Search by question..."
          name="groupName"
          onChange={searchQuestionnaire}
          InputLabelProps={{ shrink: false }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </ListItem>

      {/* {selectedSurveyQuestions.map((ques, index) => { */}
      {props.ListofQuestionsData.map((ques, index) => {
        return (
          <div
            className="questionnairelistitems"
            key={"questionnaire=" + ques.id}
          >
            <ListItem
              button
              selected={selectedIndex == ques.id}
              onClick={() => handleListItemClick(ques.id, ques.questionType)}
              alignItems="flex-start"
            >
              <ListItemAvatar>
                <Avatar>{index + 1}</Avatar>
              </ListItemAvatar>
              <ListItemText
                secondary={<p className="question-name">{ques.question}</p>}
              />
            </ListItem>
            <Divider component="li" />
          </div>
        );
      })}
    </List>
  );
}

ListofQuestions.propTypes = {
  ListofQuestionsData: PropTypes.array.isRequired,
  LoadAllQuestions: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    ListofQuestionsData: state.questionState,
  };
}

const mapDispatchToProps = {
  LoadAllQuestions: QuestionAction.listallquestions,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListofQuestions);
