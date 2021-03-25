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
    setSelectedIndex(quesId);
    if (questionType == "Boolean") {
      questionaireApiCall
        .GetBooleanQuestionById(quesId)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log("error");
        });
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
