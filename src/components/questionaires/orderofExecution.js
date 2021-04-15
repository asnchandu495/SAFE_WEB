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
      questionaireApiCall.GetAllQuestionsBySurveyIdWithOrder(id),
      questionaireApiCall.getSurveyById(id),
    ])
      .then(([allSurveyQuestions, getsurveyDetails]) => {
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
      setcomponentLoadder(true);
      const data = [...selectedSurveyQuestions];
      const item = data.splice(fromIndex, 1)[0];
      data.splice(toIndex, 0, item);
      setSelectedSurveyQuestions(data);
      let orderCollectionApiModels = [];
      data.map((d, i) => {
        if (d.order != 0) {
          orderCollectionApiModels.push({
            surveyQuestionId: d.id,
            order: i + 1,
          });
        }
      });
      let sendData = {
        surveryId: item.surveyId,
        orderCollectionApiModels: orderCollectionApiModels,
      };
      questionaireApiCall
        .ChangeQuestionOrderUpdate(sendData)
        .then((res) => {
          setSelectedSurveyQuestions(data);
          setStateSnackbar(true);
          setToasterMessage("Order is updated.");
          settoasterServerity("success");
          setTimeout(() => {
            setReloadPage("YES");
            setcomponentLoadder(false);
          }, 6000);
        })
        .catch((err) => {
          setcomponentLoadder(false);
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
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
          Questionnaire
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/questionaires/allquestionaires`}
          className="inactive"
        >
          {surveyDetails ? surveyDetails.name : ""}
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
                            <Avatar>{ques.order}</Avatar>
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
