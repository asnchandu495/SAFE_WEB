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
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import ToasterMessageComponent from "../common/toaster";

function OrderofExecution(props) {
  const { id } = useParams();
  const questionaireApiCall = new questionaireService();
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [selectedSurveyQuestions, setSelectedSurveyQuestions] = useState([]);
  const [
    selectedSurveyOrderofExecution,
    setSelectedSurveyOrderofExecution,
  ] = useState([]);
  const [surveyDetails, setSurveyDetails] = useState();
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [reloadPage, setReloadPage] = useState("NO");

  useEffect(() => {
    Promise.all([
      questionaireApiCall.getAllOrderofExecution(id),
      questionaireApiCall.GetAllQuestionsBySurveyId(id),
      questionaireApiCall.getSurveyById(id),
    ])
      .then(([orderofExecutions, allSurveyQuestions, getsurveyDetails]) => {
        allSurveyQuestions.map((item, i) => {
          let checkExists = orderofExecutions.find(
            (t2) => t2.surveyQuestionId === item.id
          );
          if (checkExists) {
            item.order = checkExists.order;
            item.existId = checkExists.id;
          } else {
            item.order = null;
            item.existId = null;
          }
        });

        allSurveyQuestions.sort((a, b) => {
          return (b.order != null) - (a.order != null) || a.order - b.order;
        });

        setSelectedSurveyOrderofExecution(orderofExecutions);
        setSelectedSurveyQuestions(allSurveyQuestions);
        setSurveyDetails(getsurveyDetails);
        setReloadPage("NO");
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reloadPage]);

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      setcomponentLoadder(false);
      const data = [...selectedSurveyQuestions];
      const item = data.splice(fromIndex, 1)[0];
      data.splice(toIndex, 0, item);
      if (item.order != null) {
        let sendData = {
          id: item.existId,
          surveryId: item.surveyId,
          surveyQuestionId: item.id,
          order: parseInt(toIndex + 1),
        };
        questionaireApiCall
          .ChangeQuestionOrderUpdate(sendData)
          .then((res) => {
            setSelectedSurveyQuestions(data);
            setStateSnackbar(true);
            setToasterMessage("Order is updated.");
            settoasterServerity("success");
            setReloadPage("YES");
          })
          .catch((err) => {
            setcomponentLoadder(false);
            setToasterMessage(err.data.errors);
            settoasterServerity("error");
            setStateSnackbar(true);
          });
      } else {
        let sendData = {
          surveryId: item.surveyId,
          surveyQuestionId: item.id,
          order: parseInt(toIndex + 1),
        };
        questionaireApiCall
          .ChangeQuestionOrder(sendData)
          .then((res) => {
            setSelectedSurveyQuestions(data);
            setStateSnackbar(true);
            setToasterMessage("Order is updated.");
            settoasterServerity("success");
            setReloadPage("YES");
          })
          .catch((err) => {
            setcomponentLoadder(false);
            setToasterMessage(err.data.errors);
            settoasterServerity("error");
            setStateSnackbar(true);
          });
      }
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
              {componentLoadder ? (
                <ComponentLoadderComponent />
              ) : (
                <List component="nav">
                  <ReactDragListView {...dragProps}>
                    {selectedSurveyQuestions.map((ques, index = index + 1) => {
                      return (
                        <ListItem alignItems="flex-start" key={index}>
                          <Grid
                            item
                            xs={12}
                            className="question-container-full"
                          >
                            <Avatar>
                              {ques.order != null ? ques.order : 0}
                            </Avatar>
                            <p className="question-name">{ques.question}</p>
                          </Grid>
                        </ListItem>
                      );
                    })}
                  </ReactDragListView>
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
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

export default OrderofExecution;
