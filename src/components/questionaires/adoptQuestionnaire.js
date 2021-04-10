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

function AdoptQuestionnaire(props) {
  const paramsId = props.match.params.id;
  const questionaireApiCall = new questionaireService();
  const masterApiCall = new MasterDataService();
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [selectedUserQuestionnaire, setselectedUserQuestionnaire] = useState();
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [QuestionaireList, setQuestionaireList] = useState();
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [allLanguages, setAllLanguages] = useState([]);
  const [showLoadder, setshowLoadder] = useState(false);
  const [formData, setformData] = useState({
    // id: "",
    name: "",
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

  function handleChange(e) {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;

    setformData((formData) => ({
      ...formData,
      [name]: value,
    }));
  }

  function handleClickGoBack() {
    props.history.push("/questionaires/allquestionaires");
  }

  function handleChangeQuestionnaire(e, value) {
    setselectedUserQuestionnaire(value);
  }

  function submitForm() {
    setshowLoadder(true);
    var data = formData;
    setshowLoadder(false);
  }

  return (
    <div className="innerpage-container">
      <AlertBoxComponent isAlertBoxOpened={isAlertBoxOpened} />
      <Breadcrumbs aria-label="breadcrumb" className="global-breadcrumb">
        <LinkTo
          color="inherit"
          href="#"
          to={`home/dashboard`}
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
          Adopt from existing Questionnaire
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <>
          <Paper className={`main-paper`}>
            <ValidatorForm className={`global-form`} onSubmit={submitForm}>
              <Grid container spacing={3}>
                <Grid item container xs={12}>
                  <Grid item xs={3}>
                    <label className="required">Questionnarie Title</label>
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
                        "Please enter questionarie",
                        "Special charcters are not allowed",
                        "Maximum 50 characters",
                      ]}
                      fullWidth
                      id="title"
                      placeholder="Title"
                      name="name"
                      onChange={handleChange}
                      value={formData.name}
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
                        defaultValue="#"
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
                      />{" "}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item cs={12} container>
                  <Grid item xs={3}>
                    <label className="required">Configure Questionnaire</label>
                  </Grid>
                  <Grid item xs={5}>
                    <FormControl variant="outlined" fullWidth>
                      <RadioGroup
                        aria-label="gender"
                        name="gender1"
                        // value={value}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label="Adopt only questions"
                        />
                        <FormControlLabel
                          value="male"
                          control={<Radio />}
                          label="Adopt questions with order of execution"
                        />
                        <FormControlLabel
                          value="other"
                          control={<Radio />}
                          label="Adopt questions with order of execution and evaluation result"
                        />
                      </RadioGroup>
                    </FormControl>
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