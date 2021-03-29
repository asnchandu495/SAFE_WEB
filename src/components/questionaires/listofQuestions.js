import React, { useState, Fragment, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { useParams } from "react-router-dom";
import questionaireService from "../../services/questionaireService";
import QuestionType from "./selectQuestionType";

function ListofQuestions(props) {
  const { id } = useParams();
  const questionaireApiCall = new questionaireService();
  const [selectedIndex, setSelectedIndex] = useState("001");
  const [selectedSurveyQuestions, setSelectedSurveyQuestions] = useState([]);

  useEffect(() => {
    questionaireApiCall
      .GetAllQuestionsBySurveyId(id)
      .then((res) => {
        console.log(res);
        setSelectedSurveyQuestions(res);
        console.log(selectedSurveyQuestions);
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

  return (
    <List component="nav">
      {selectedSurveyQuestions.map((ques, index) => {
        return (
          <Fragment>
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
          </Fragment>
        );
      })}
    </List>
  );
}

export default ListofQuestions;
