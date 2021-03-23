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

import PropTypes from "prop-types";
import { connect } from "react-redux";

import AlertBoxComponent from "../common/alert";
import * as QuestionaireAction from "../../Redux/Action/questionaireAction";
function CreateQuestionarie(props) {
  const paramsId = props.match.params.id;
  const questionaireApiCall = new questionaireService();
  const masterApiCall = new MasterDataService();
  
  // const [componentLoadder,setComponentLoadder]=useState(falsse);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [allLanguages,setAllLanguages]=useState([]);
  const [showLoadder, setshowLoadder] = useState(false);
  const [formData, setformData] = useState({
      id:"",
      languageId: "",
      questionnaire: ""
    
  });

useEffect(()=>{
  // Promise.all([
    masterApiCall.getAllLanguages()
    
  // ])
  .then((res)=>{
    // console.log(res);
    setAllLanguages(res);
    setComponentLoadder(false);
  //   if (paramsId != 0) {
  //     alert("fds");
  //     questionaireApiCall
  //       .getSurveyById(paramsId)
  //       .then((questionaireData) => {
  //         setformData(questionaireData);
  //         setAllLanguages(questionaireData.languageId);
  //         setComponentLoadder(false);
  //       })
  //       .catch((error) => {
  //         alert("error");
  //         console.log(error);
  //       });
  //   } else {
  //     setComponentLoadder(false);
  //   }

  })
  .catch((error)=>{
    console.log(error);
  });

},[]);

function handleChange(e) {
  // setisAlertBoxOpened(true);
  const { name, value } = e.target;
  console.log(formData);
  setformData((formData) => ({
    ...formData,
    [name]: value,
  }));
}
function submitForm(){
  // setshowLoadder(true);
  
  var data = formData;
  console.log('result');
  console.log(data);
  if (paramsId != 0) {
    // teamData.manager = selectedTeamManager;s
      props
       .UpdateQuestionaireCall(data)
       .then((result) => {
         setisAlertBoxOpened(false);
         setshowLoadder(false);
         setStateSnackbar(true);
         setToasterMessage("questionaires  Updated");
         settoasterServerity("success");
         setTimeout(() => {
           props.history.push("/questionaires/allquestionaires");
           setshowLoadder(false);
         }, 3000);
       })
       .catch((err) => {
         console.log(err);
        setToasterMessage(err.data.errors);

         settoasterServerity("error");
         setStateSnackbar(true);
         setshowLoadder(false);
       });
   }else{
  props.CreateQuestionaireCall(data)
 .then((result) => {
   console.log(result);
    setStateSnackbar(true);
    setToasterMessage("Added new questionaires.");
    // settoasterServerity("success");
    // setisAlertBoxOpened(false);
    // setTimeout(() => {
    //   setshowLoadder(false);
    //   // setformData({
    //   //   languageId :"",
    //   //   questionnaire: "",
        
    //   // });
      
    // }, 6000);
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
        >Home
        </LinkTo>
        <LinkTo
        color="textPrimary"
        href="#"
        to={`/questionaires/allquestionaires`}
        className="inactive">
           Questionarie
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          {paramsId != 0 ? "Update Questionaire" : "Create Questionaire"}
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <>
      <Paper className={`main-paper`}>
            <ValidatorForm className={`global-form`} onSubmit={submitForm}>
              <Grid container spacing={3}>

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
                        // value={formData.languageId ? formData.languageId : ""}s
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
                      name="questionnaire"
                      onChange={handleChange}
                      value={formData.questionnaire}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
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
                        onClick="#"
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
  // teamDatas: PropTypes.array.isRequired,
  // teamData: PropTypes.array.isRequired,
  // LoadAllUserGroup: PropTypes.func.isRequired,
  CreateQuestionaireCall: PropTypes.func.isRequired,
  UpdateQuestionaireCall: PropTypes.func.isRequired,
};


function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const emptyObject = {};
  const questionaireData =
    id && state.questionaireState.length > 0
      ? getQuestionaireById(state.questionaireState, id)
      : emptyObject;
  return {
    questionaireData,
    questionaireDatas: state.questionaireState,
  };
}

const mapDispatchToProps = {
  // LoadAllUserGroup: QuestionaireAction.GetAllQuestionarie,
  CreateQuestionaireCall: QuestionaireAction.createQuestionaireData,
  UpdateQuestionaireCall: QuestionaireAction.UpdateQuestionaireData,
  
};
// export default CreateQuestionarie;

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuestionarie);

