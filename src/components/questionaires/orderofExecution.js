import React, { useEffect, useState, Fragment } from "react";
import ReactDOM from "react-dom";
import ReactDragListView from "react-drag-listview/lib/index.js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { useParams } from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import questionaireService from "../../services/questionaireService";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import ToasterMessageComponent from "../common/toaster";
import Button from "@material-ui/core/Button";
import TooltipComponent from "../common/tooltip";

function OrderofExecution(props) {
  const surveyIdURL = props.match.params.id;
  const { id } = useParams();
  const questionaireApiCall = new questionaireService();
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [selectedSurveyQuestions, setSelectedSurveyQuestions] = useState([]);
  const [selectedSurveyOrderofExecution, setSelectedSurveyOrderofExecution] =
    useState([]);
  const [surveyDetails, setSurveyDetails] = useState();
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [reloadPage, setReloadPage] = useState("NO");
  const [displayListDiv, setDisplayListDiv] = useState("");
  const [selectedParentQuestions, setSelectedParentQuestions] = useState([]);

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

  function showDIveList(index, question) {
    switch (question.questionType) {
      case "Boolean":
        questionaireApiCall
          .GetBooleanConditionQuestionById(question.id)
          .then((res) => {
            let newResponse = [];
            if (res.positiveResponseQuestionHasCondition) {
              newResponse.push({
                id: res.positiveResponseQuestionId,
                question: res.positiveResponseQuestionName,
              });
            }
            if (res.negativeResponseQuestionHasCondition) {
              newResponse.push({
                id: res.negativeResponseQuestionId,
                question: res.negativeResponseQuestionName,
              });
            }
            setSelectedParentQuestions(newResponse);
            setDisplayListDiv(`dis${index}`);
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "FreeText":
        questionaireApiCall
          .GetFreeTextQuestion(question.id)
          .then((res) => {
            setSelectedParentQuestions(res);
            setDisplayListDiv(`dis${index}`);
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "Date":
        questionaireApiCall
          .GetDateTimeBooleanById(question.id)
          .then((res) => {
            setSelectedParentQuestions(res.dateTimeConditionalQuestions);
            setDisplayListDiv(`dis${index}`);
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "Time":
        questionaireApiCall
          .GetTimeQuestionBooleanById(question.id)
          .then((res) => {
            setSelectedParentQuestions(res.timeConditionalQuestions);
            setDisplayListDiv(`dis${index}`);
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "Numeric":
        questionaireApiCall
          .GetNumeicQuestionBoooleanById(question.id)
          .then((res) => {
            setSelectedParentQuestions(res.numericConditionalQuestions);
            setDisplayListDiv(`dis${index}`);
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "SingleChoice":
        questionaireApiCall
          .GetSingleChoiceBooleanQuestion(question.id)
          .then((res) => {
            setSelectedParentQuestions(res.singleChoiceConditionalQuestions);
            setDisplayListDiv(`dis${index}`);
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      case "MultiChoice":
        questionaireApiCall
          .GetMultipleChoicQuestionBooleanById(question.id)
          .then((res) => {
            setSelectedParentQuestions(res.multiChoiceConditionalQuestions);
            setDisplayListDiv(`dis${index}`);
          })
          .catch((err) => {
            console.log("error");
          });
        break;
      default:
        return <h4>Not found</h4>;
    }
  }
  function handleCancel() {
    setTimeout(() => {
      props.history.push(`/questionaires/view-questions/${surveyIdURL}`);
    }, 1000);
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
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/questionaires/view-questions/` + surveyIdURL}
          className="inactive"
        >
          {surveyDetails ? surveyDetails.name : ""}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Order Of Execution
        </LinkTo>
      </Breadcrumbs>
      <span style={{ float: "right" }}>
        <TooltipComponent
          isMarginBottom={true}
          tooltipMessage={`To define sequential order  in which questions appear to answer. `}
        ></TooltipComponent>
      </span>

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
                        <ListItem
                          alignItems="flex-start"
                          key={index}
                          className={
                            ques.hasConditionalOrder
                              ? "conditional-order-li queslist"
                              : "queslist"
                          }
                        >
                          <Grid
                            item
                            xs={12}
                            className="question-container-full"
                          >
                            <Avatar>{ques.order}</Avatar>
                            <p className="question-name">{ques.question}</p>
                            {ques.hasConditionalOrder ? (
                              <Avatar
                                className="viewlist"
                                onClick={() => showDIveList(index, ques)}
                              >
                                <VisibilityIcon></VisibilityIcon>
                              </Avatar>
                            ) : (
                              ""
                            )}
                          </Grid>
                          {displayListDiv == `dis${index}` ? (
                            <Grid
                              item
                              xs={12}
                              className="question-container-full sublist"
                            >
                              {selectedParentQuestions &&
                              selectedParentQuestions.length > 0
                                ? selectedParentQuestions.map((q, i) => {
                                    return (
                                      <p>
                                        {i + 1} ) {q.question}
                                      </p>
                                    );
                                  })
                                : ""}
                            </Grid>
                          ) : (
                            ""
                          )}
                        </ListItem>
                      );
                    })}
                  </ReactDragListView>
                </List>
              )}
            </Paper>

            <Grid
              item
              className={`global-form inline-form`}
              xs={12}
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <div className={`form-buttons-container`}>
                <Button
                  variant="contained"
                  type="button"
                  onClick={handleCancel}
                  className="global-cancel-btn"
                >
                  Cancel
                </Button>
              </div>
            </Grid>
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
