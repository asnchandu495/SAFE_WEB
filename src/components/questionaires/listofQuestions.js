import React, { useState, Fragment } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

function ListofQuestions(props) {
  const [selectedIndex, setSelectedIndex] = useState("001");

  const [selectedSurveyQuestions, setSelectedSurveyQuestions] = useState([
    {
      survey: "001",
      surveyId: "001",
      questionType: "Boolean",
      question: "This is a test boolean question to be displayed in the list.",
    },
    {
      survey: "001",
      surveyId: "002",
      questionType: "DateTime",
      question: "This is a test DateTime question to be displayed in the list.",
    },
    {
      survey: "001",
      surveyId: "003",
      questionType: "FreeText",
      question: "This is a test FreeText question to be displayed in the list.",
    },
    {
      survey: "001",
      surveyId: "004",
      questionType: "MultiChoice",
      question:
        "This is a test MultiChoice question to be displayed in the list.",
    },
    {
      survey: "001",
      surveyId: "005",
      questionType: "Numeric",
      question: "This is a test Numeric question to be displayed in the list.",
    },
    {
      survey: "001",
      surveyId: "006",
      questionType: "SingleChoice",
      question:
        "This is a test SingleChoice question to be displayed in the list.",
    },
    {
      survey: "001",
      surveyId: "007",
      questionType: "Time",
      question: "This is a test Time question to be displayed in the list.",
    },
  ]);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <List component="nav">
      {selectedSurveyQuestions.map((ques, index) => {
        return (
          <Fragment>
            <ListItem
              button
              selected={selectedIndex == ques.surveyId}
              onClick={(event) => handleListItemClick(event, ques.surveyId)}
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
