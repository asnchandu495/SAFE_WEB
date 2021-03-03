import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import ToasterMessageComponent from "../../common/toaster";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import ComponentLoadderComponent from "../../common/loadder/componentloadder";
import FaqService from "../../../services/faqService";

const useStyles = makeStyles((theme) => ({
  gridDispaly: {
    display: "inline-flex",
  },
}));

const languages = [{ id: "English", language: "English" }];

function FaqSections(props) {
  const faqApiCall = new FaqService();

  const classes = useStyles();

  const getFaqId = props.match.params.id;
  const getFaqIdSecId = props.match.params.secId;

  const [faqSections, setFaqSections] = useState({
    id: "",
    faqId: "",
    sectionDescription: "",
    sectionName: "",
    questions: [
      {
        questionNameId: "",
        questionName: "",
        answer: "",
      },
    ],
  });
  const [faqId, setFaqId] = useState(getFaqId);
  const [faqIdSecId, setFaqIdSecId] = useState(getFaqIdSecId);
  const [muivalidatorForm, setmuivalidatorForm] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [showLoadder, setshowLoadder] = useState(false);
  const [componentLoadder, setComponentLoadder] = useState(true);

  useEffect(() => {
    if (getFaqIdSecId != 0) {
      faqApiCall
        .getFaqById(props.match.params.id)
        .then((faqDetails) => {
          let allSections = faqDetails.sections;
          let selectedSection = allSections.filter((sec) => {
            return sec.id == getFaqIdSecId;
          });
          if (selectedSection.length > 0) {
            setFaqSections(selectedSection[0]);
          }
          setComponentLoadder(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setComponentLoadder(false);
    }
  }, []);

  function handleChangeInput(e) {
    const { name, value } = e.target;
    setFaqSections((faqSections) => ({
      ...faqSections,
      [name]: value,
    }));
  }

  const handleInputChangeContacts = (e, index) => {
    const { name, value } = e.target;
    const list = {
      ...faqSections,
      questions: [
        ...faqSections.questions.map((con, conIndex) =>
          conIndex == index ? { ...con, [name]: value } : con
        ),
      ],
    };
    setFaqSections(list);
  };

  const handleRemoveClickContacts = (j) => {
    const list = { ...faqSections };
    list.questions.splice(j, 1);
    setFaqSections(list);
  };

  const handleAddClickContacts = (index, j) => {
    const list = { ...faqSections };
    const thisfaqSections = list.questions;
    list.questions = [
      ...thisfaqSections,
      {
        questionNameId: "",
        questionName: "",
        answer: "",
      },
    ];
    setFaqSections(list);
  };

  function handleClickGoBackToPage() {
    props.history.push("/emergencycontacts/view");
  }

  function submitForm(e) {
    e.preventDefault();
    ValidateSubmitForm();
  }

  function ValidateSubmitForm() {
    setshowLoadder(true);
    let sendData = faqSections;
    sendData.faqId = props.match.params.id;
    if (props.match.params.secId == 0) {
      faqApiCall
        .AddSectionToFaq(sendData)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("New section added");
          settoasterServerity("success");
          setTimeout(() => {
            setFaqSections({
              faqId: "",
              sectionDescription: "",
              sectionName: "",
              questions: [
                {
                  questionNameId: "",
                  questionName: "",
                  answer: "",
                },
              ],
            });
            setshowLoadder(false);
          }, 3000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      sendData.id = props.match.params.secId;
      faqApiCall
        .UpdateSectionToFaq(sendData)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Section is updated");
          settoasterServerity("success");
          setTimeout(() => {
            props.history.push("/faq/view-faq/" + props.match.params.id);
            setshowLoadder(false);
          }, 3000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    }
  }

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
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
          to={`/faq/allfaqs`}
          className="inactive"
        >
          FAQs
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="inactive">
          llll
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          {props.match.params.secId == 0 ? "Create section" : "Update section"}
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <Paper className="main-paper">
          <ValidatorForm className={`global-form`} onSubmit={submitForm}>
            <Grid container spacing={3}>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">Section Heading</label>
                </Grid>
                <Grid item xs={3}>
                  <TextValidator
                    variant="outlined"
                    validators={["required", "matchRegexp:^.{0,60}$"]}
                    errorMessages={[
                      "Please enter section heading",
                      "Maximum 60 characters",
                    ]}
                    fullWidth
                    id="sectionName"
                    placeholder="Section heading"
                    name="sectionName"
                    onChange={handleChangeInput}
                    value={faqSections.sectionName}
                    className="global-input"
                    InputLabelProps={{ shrink: false }}
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label>Description</label>
                </Grid>
                <Grid item xs={3}>
                  <TextValidator
                    variant="outlined"
                    validators={["matchRegexp:^.{0,150}$"]}
                    errorMessages={["Maximum 150 characters"]}
                    multiline
                    rows={2}
                    fullWidth
                    id="sectionDescription"
                    placeholder="Section description"
                    name="sectionDescription"
                    onChange={handleChangeInput}
                    value={faqSections.sectionDescription}
                    className="global-input global-input-multiline"
                    InputLabelProps={{ shrink: false }}
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">Questions</label>
                </Grid>
                <Grid container item xs={9}>
                  {faqSections.questions && faqSections.questions.length > 0
                    ? faqSections.questions.map((x, i) => {
                        return (
                          <Grid
                            container
                            spacing={1}
                            item
                            xs={12}
                            className="dynamic-rows-bottom"
                            key={`section-container${i}`}
                          >
                            <Grid item xs={10}>
                              <Grid container spacing={1} item xs={12}>
                                <Grid item xs={12}>
                                  <TextValidator
                                    variant="outlined"
                                    validators={[
                                      "required",
                                      "matchRegexp:^.{0,60}$",
                                    ]}
                                    errorMessages={[
                                      "Please enter question",
                                      "Maximum 60 characters",
                                    ]}
                                    fullWidth
                                    id={`questionName_${i}`}
                                    placeholder="Question name *"
                                    name="questionName"
                                    value={x.questionName}
                                    onChange={(e) =>
                                      handleInputChangeContacts(e, i)
                                    }
                                    className="global-input"
                                    InputLabelProps={{ shrink: false }}
                                  />
                                </Grid>
                                <Grid item xs={12} className="answer-input">
                                  <TextValidator
                                    variant="outlined"
                                    validators={["required"]}
                                    errorMessages={["Please enter answer"]}
                                    fullWidth
                                    id={`answer_${i}`}
                                    placeholder="Answer *"
                                    name="answer"
                                    value={x.answer}
                                    onChange={(e) =>
                                      handleInputChangeContacts(e, i)
                                    }
                                    className="global-input"
                                    InputLabelProps={{ shrink: false }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={2} className="row-icons-container">
                              {faqSections.questions.length !== 1 && (
                                <Tooltip title="Remove">
                                  <CancelIcon
                                    className={`delete-row-icon`}
                                    onClick={() => handleRemoveClickContacts(i)}
                                  ></CancelIcon>
                                </Tooltip>
                              )}
                              {faqSections.questions.length - 1 === i && (
                                <Tooltip title="Add">
                                  <AddCircleIcon
                                    className={`add-row-icon`}
                                    onClick={handleAddClickContacts}
                                  ></AddCircleIcon>
                                </Tooltip>
                              )}
                            </Grid>
                          </Grid>
                        );
                      })
                    : ""}
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label>&nbsp;</label>
                </Grid>
                <Grid item xs={9}>
                  <div className={`form-buttons-container`}>
                    <Button
                      variant="contained"
                      type="submit"
                      className="global-submit-btn"
                      disabled={showLoadder}
                    >
                      {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
                    </Button>
                    <Button
                      variant="contained"
                      type="reset"
                      onClick={handleClickGoBackToPage}
                      className="global-cancel-btn"
                    >
                      Cancel
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </ValidatorForm>
        </Paper>
      ) : (
        <ComponentLoadderComponent />
      )}
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

export default FaqSections;
