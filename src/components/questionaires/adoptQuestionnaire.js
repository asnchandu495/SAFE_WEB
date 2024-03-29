import React, { useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import MasterDataService from "../../services/masterDataService";
import questionaireService from "../../services/questionaireService";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import AlertBoxComponent from "../common/alert";
import * as QuestionaireAction from "../../Redux/Action/questionaireAction";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

function AdoptQuestionnaire(props) {
  const questionaireApiCall = new questionaireService();
  const masterApiCall = new MasterDataService();
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [selectedUserQuestionnaire, setselectedUserQuestionnaire] = useState();
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [QuestionaireList, setQuestionaireList] = useState();
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [allLanguages, setAllLanguages] = useState([]);
  const [showLoadder, setshowLoadder] = useState(false);
  const [formData, setformData] = useState({
    surveyId: "",
    isCopyEvaluation: false,
    isCopyOrder: false,
    title: "",
    languageId: "",
  });
  const [selectedQuestionOption, setSelectedQuestionOption] = useState("");
  const [formFieldValidation, setformFieldValidation] = useState({
    userquestionnaire: false,
  });

  useEffect(() => {
    Promise.all([
      masterApiCall.getAllLanguages(),
      questionaireApiCall.GetAllQuestionarie(),
    ])
      .then(([res, getQuestionaireList]) => {
        setAllLanguages(res);
        setQuestionaireList(getQuestionaireList);
        setComponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
/**
   * Handle Change
   * Data binding of the form fields
   * sets the state formdata
   * @param  {} -target element
   */
  function handleChange(e) {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;

    setformData((formData) => ({
      ...formData,
      [name]: value,
    }));
  }
 /**
   * Handle click go back
   * Method on click of cancel 
   * To navigate 
   * @param  {} -target element
   */
  function handleClickGoBack() {
    props.history.push("/questionaires/allquestionaires");
  }
   /**
   * Handle change questionnaire
   * Method on change of dropdown 
   * sets the state selected user qquestionnaire
   * @param  {} -target element
   * value is the dropdown change value
   */
  function handleChangeQuestionnaire(e, value) {
    setselectedUserQuestionnaire(value);
  }
  /**
   * Handle change adoption
   * Method on change of radio button 
   * sets the state selected  qquestionnaire adoption
   * @param  {} -target element
  
   */
  function handleChangeAdoptOption(e) {
    setSelectedQuestionOption(e.target.value);
  }
 /**
  *  Adopt questionnaire
   * Method on form submit 
   * To validate before submitting
   * @param  {} -target element
   
   */
  function adoptQuestionnaire(e) {
    e.preventDefault();
    SelectUserQuestionnaire();
    if (selectedUserQuestionnaire) {
      submitForm();
    } else {
      return false;
    }
  }
 /**
  *  submit form
   * Method on form submit 
   * After validating the form whether a question is adopted or not
   * @param  {} -target element
   * */
   
  function submitForm() {
    setshowLoadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    let data = formData;
    data.surveyId = selectedUserQuestionnaire.id;
    if (selectedQuestionOption == "questions") {
      data.isCopyOrder = false;
      data.isCopyEvaluation = false;
    }
    if (selectedQuestionOption == "order") {
      data.isCopyOrder = true;
      data.isCopyEvaluation = false;
    }
    if (selectedQuestionOption == "evaluation") {
      data.isCopyOrder = true;
      data.isCopyEvaluation = true;
    }
    questionaireApiCall
      .adoptExistingQuestionarie(data)
      .then((res) => {
        setisAlertBoxOpened(false);
        setStateSnackbar(true);
        setToasterMessage("Questionarie is adopted.");
        settoasterServerity("success");
        setTimeout(() => {
          props.history.push(`/questionaires/allquestionaires`);
          setshowLoadder(false);
        }, 6000);
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
        setshowLoadder(false);
      });
  }
  /**
   *  Select user questionnaire
   * Method for validationg form 
   
   */
  function SelectUserQuestionnaire() {
    if (selectedUserQuestionnaire) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["userquestionnaire"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["userquestionnaire"]: true,
      }));
    }
  }

  return (
    <div className="innerpage-container">
      <AlertBoxComponent isAlertBoxOpened={isAlertBoxOpened} />
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
          Adopt From Existing Questionnaire
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <>
          <Paper className={`main-paper`}>
            <ValidatorForm
              className={`global-form`}
              onSubmit={adoptQuestionnaire}
            >
              <Grid container spacing={3}>
                <Grid item container xs={12}>
                  <Grid item xs={3}>
                    <label className="required">Questionnaire Title</label>
                  </Grid>
                  <Grid item xs={5}>
                    <TextValidator
                      variant="outlined"
                      validators={[
                        "required",
                        "matchRegexp:^[a-zA-Z0-9 ]*$",
                        "matchRegexp:^.{0,50}$",
                      ]}
                      errorMessages={[
                        "Please enter questionnaire",
                        "Special charcters are not allowed",
                        "Maximum 50 characters",
                      ]}
                      fullWidth
                      id="title"
                      placeholder="Title"
                      name="title"
                      onChange={handleChange}
                      value={formData.title}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                </Grid>
                <Grid item cs={12} container>
                  <Grid item xs={3}>
                    <label className="required">Questionnaire</label>
                  </Grid>
                  <Grid item xs={5}>
                    <FormControl variant="outlined" fullWidth>
                      <Autocomplete
                        id="tags-outlined"
                        options={
                          QuestionaireList && QuestionaireList
                            ? QuestionaireList
                            : []
                        }
                        getOptionLabel={(option) => option.name}
                        defaultValue={selectedUserQuestionnaire}
                        onChange={handleChangeQuestionnaire}
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select questionnaire"
                          />
                        )}
                      />
                    </FormControl>
                    {formFieldValidation.userquestionnaire ? (
                      <FormHelperText className="error-msg">
                        Please select questionnaire{" "}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
                <Grid item container xs={12}>
                  <Grid item xs={3}>
                    <label className="required">Language</label>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        id="demo-simple-select-outlined-label"
                        shrink={false}
                        className="select-label"
                      >
                        {formData.languageId == "" ? " Select language" : ""}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        placeholder="Select language"
                        name="languageId"
                        value={formData.languageId ? formData.languageId : ""}
                        onChange={handleChange}
                        required
                        InputLabelProps={{ shrink: false }}
                        className="global-input single-select"
                      >
                        <MenuItem value="">None</MenuItem>
                        {allLanguages.length > 0
                          ? allLanguages.map((lan) => {
                              return (
                                <MenuItem value={lan.id}>{lan.name}</MenuItem>
                              );
                            })
                          : ""}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item cs={12} container>
                  <Grid item xs={3}>
                    <label className="required">Configure Questionnaire</label>
                  </Grid>
                  <Grid item xs={8}>
                    {/* <FormControl variant="outlined" fullWidth> */}
                    <RadioGroup
                      aria-label="adoptOption"
                      name="adoptOption"
                      value={selectedQuestionOption}
                      onChange={handleChangeAdoptOption}
                    >
                      <FormControlLabel
                        value="questions"
                        control={<Radio required />}
                        label="Adopt only questions"
                      />
                      <FormControlLabel
                        value="order"
                        control={<Radio required />}
                        label="Adopt questions with order of execution"
                      />
                      <FormControlLabel
                        value="evaluation"
                        control={<Radio required />}
                        label="Adopt questions with order of execution and evaluation result"
                      />
                    </RadioGroup>
                    {/* </FormControl> */}
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
                        onClick={handleClickGoBack}
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
        </>
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

export default AdoptQuestionnaire;
