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

function CreateQuestionarie(props) {
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
  const [isDuplicate, setIsDuplicate] = useState(false);
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
        if (paramsId != 0) {
          questionaireApiCall
            .getSurveyById(paramsId)
            .then((questionaireData) => {
              setformData(questionaireData);

              setComponentLoadder(false);
            })
            .catch((error) => {
              alert("error");
              console.log(error);
            });
        } else {
          setComponentLoadder(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleChange(e) {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    if (name == "name") {
      checkUnqueName(value);
    }

    setformData((formData) => ({
      ...formData,
      [name]: value,
    }));
  }

  function checkUnqueName(value) {
    if (props.match.params.id != 0) {
      if (props.questionaireDatas && props.questionaireDatas.length > 0) {
        let filteredData = props.questionaireDatas.filter((x) => {
          return x.id != props.match.params.id;
        });
        let matchedValue = filteredData.find(
          (x) => x.name.toLowerCase() == value.toLowerCase()
        );
        if (matchedValue) {
          setIsDuplicate(true);
        } else {
          setIsDuplicate(false);
        }
      }
    } else {
      if (props.questionaireDatas && props.questionaireDatas.length > 0) {
        let matchedValue = props.questionaireDatas.find(
          (x) => x.name.toLowerCase() == value.toLowerCase()
        );
        if (matchedValue) {
          setIsDuplicate(true);
        } else {
          setIsDuplicate(false);
        }
      }
    }
  }

  function handleClickGoBack() {
    props.history.push("/questionaires/allquestionaires");
  }

  function handleChangeQuestionnaire(e, value) {
    console.log(value);
    setselectedUserQuestionnaire(value);
  }

  function submitForm() {
    setshowLoadder(true);

    var data = formData;

    if (paramsId != 0) {
      props
        .UpdateQuestionaireCall(data)
        .then((result) => {
          setisAlertBoxOpened(false);
          setshowLoadder(false);
          setStateSnackbar(true);
          setToasterMessage("Questionnaire  Updated");
          settoasterServerity("success");
          setTimeout(() => {
            props.history.push("/questionaires/allquestionaires");
            setshowLoadder(false);
          }, 3000);
        })
        .catch((err) => {
          // console.log(err);
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      props
        .CreateQuestionaireCall(data)
        .then((result) => {
          setisAlertBoxOpened(false);

          setStateSnackbar(true);
          setToasterMessage("Added new questionnaire.");
          settoasterServerity("success");

          setTimeout(() => {
            props.history.push("/questionaires/allquestionaires");
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
          {paramsId != 0 ? "Update Questionnaire" : "Create Questionnaire"}
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
                        "matchRegexp:^.{0,100}$",
                      ]}
                      errorMessages={[
                        "Please enter questionarie",
                        "Special charcters are not allowed",
                        "Maximum 100 characters",
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
                    {isDuplicate ? (
                      <FormHelperText className="error-msg">
                        This name already exists.
                      </FormHelperText>
                    ) : (
                      ""
                    )}
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

export function getQuestionaireById(users, id) {
  return users.find((user) => user.id === id) || null;
}

CreateQuestionarie.propTypes = {
  CreateQuestionaireCall: PropTypes.func.isRequired,
  UpdateQuestionaireCall: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const emptyObject = {};
  const questionaireData =
    id && state.questionaireState
      ? getQuestionaireById(state.questionaireState, id)
      : emptyObject;
  return {
    questionaireData,
    questionaireDatas: state.questionaireState,
  };
}

const mapDispatchToProps = {
  CreateQuestionaireCall: QuestionaireAction.createQuestionaireData,
  UpdateQuestionaireCall: QuestionaireAction.UpdateQuestionaireData,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuestionarie);
