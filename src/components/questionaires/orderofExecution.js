import React, { useEffect, useState, Fragment } from "react";
import ReactDOM from "react-dom";
import ReactDragListView from "react-drag-listview/lib/index.js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { useParams } from "react-router-dom";
import questionaireService from "../../services/questionaireService";

function OrderofExecution(props) {
  const { id } = useParams();
  const questionaireApiCall = new questionaireService();
  const [selectedSurveyQuestions, setSelectedSurveyQuestions] = useState([]);

  useEffect(() => {
    questionaireApiCall
      .GetAllQuestionsBySurveyId(id)
      .then((res) => {
        setSelectedSurveyQuestions(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const data = [...selectedSurveyQuestions];
      const item = data.splice(fromIndex, 1)[0];
      data.splice(toIndex, 0, item);
      let sendData = {
        surveryId: item.surveyId,
        surveyQuestionId: item.id,
        order: parseInt(toIndex + 1),
      };
      questionaireApiCall
        .ChangeQuestionOrder(sendData)
        .then((res) => {
          setSelectedSurveyQuestions(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    nodeSelector: "li",
    handleSelector: "li",
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
          to={`/questionaires/allquestionaires`}
          className="inactive"
        >
          Questionaire
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="inactive">
          {/* {ViewQuestionaireDetails.name} */}
          Selected questionnaire
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Order of execution
        </LinkTo>
      </Breadcrumbs>
      <Paper className="main-paper main-paper-add-question">
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12} className="list-questions-container">
            <Paper className="list-questions order-change">
              <List component="nav">
                <ReactDragListView {...dragProps}>
                  {selectedSurveyQuestions.map((ques, index) => {
                    return (
                      <ListItem alignItems="flex-start" key={index}>
                        <Grid item xs={12} className="question-container-full">
                          <Avatar>{index + 1}</Avatar>
                          <p className="question-name">{ques.question}</p>
                        </Grid>
                      </ListItem>
                    );
                  })}
                </ReactDragListView>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default OrderofExecution;
