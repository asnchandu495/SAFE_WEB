import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { connect } from "react-redux";
import * as UserGroupAction from "../../Redux/Action/userGroupAction";
import PropTypes from "prop-types";
import AlertBoxComponent from "../common/alert";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";

import Autocomplete from "@material-ui/lab/Autocomplete";
import teamService from '../../services/teamService';



  
function CreateTeam(props) {
  
  
    const [formFieldValidation, setformFieldValidation] = useState({
        securityManager: false,
        siteManager: false,
        country: false,
      });
      const[teamManagers,setTeamManagers]=useState([]);
      const[selectedTeamManager,setSelectedTeamManager]=useState({});
      const [stateSnackbar, setStateSnackbar] = useState(false);
    const [toasterMessage, setToasterMessage] = useState("");
    const [toasterServerity, settoasterServerity] = useState("");
    const [componentLoadder, setComponentLoadder] = useState(false);
    const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
      "array"
    );
  const [showLoadder, setshowLoadder] = useState(false);
      // const userGroupUpdateid = match.params.id;    
      
      const teamApiCall = new teamService();


      const[formData,SetformData]=useState({
        "id": "",
        "name": "",
        "description": "",
        "manager": {
            "name": "string",
            "id": "string"
        }
    });
      
      useEffect(() => {
       teamApiCall.getTeamManager()
       .then((res)=>{
        
           setTeamManagers(res);
       })
       .catch((error) => {
        console.log(error);
      });
      }, []);


 function handleChange(e) {
     const { name, value } = e.target;
      SetformData((formData) => ({
        ...formData,
        [name]: value,
      }));
    }
   function handleChangeTeamManagers(event, value) {
   setSelectedTeamManager(value);
  }

function teamCreation(e){
  setshowLoadder(true);
  e.preventDefault();
 
   const teamData=formData;
  teamData.manager=selectedTeamManager;
  // console.log(teamData);
  teamApiCall.createTeams(teamData)
  .then((result) => {
    setStateSnackbar(true);
    setToasterMessage("Team  Created");
    settoasterServerity("success");
    setTimeout(() => {
      props.history.push("/teams/allteams");
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

    return(
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
        to={`usergroups/allusergroups`}
        className="inactive">
        Teams
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`usergroups/allusergroups`}
          className="inactive"
        >
          Create Team
        </LinkTo>
        
            </Breadcrumbs>
        <Paper className="main-paper">
        <ValidatorForm className={`global-form`} onSubmit={teamCreation}>
        <Grid container spacing={3}>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">Team Name</label>
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
                      "Please enter team  name",
                      "Special charcters are not allowed",
                      "Maximum 50 characters",
                    ]}
                    fullWidth
                    id="name"
                    placeholder="Team name"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                    InputLabelProps={{ shrink: false }}
                    className="global-input"
                  />
                  
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label>Description</label>
                </Grid>
                <Grid item xs={5}>
                  <TextValidator
                    variant="outlined"
                    fullWidth
                    id="description"
                    placeholder="Add description"
                    validators={["matchRegexp:^.{0,150}$"]}
                    errorMessages={["Maximum 150 characters"]}
                    name="description"
                    onChange={handleChange}
                    multiline
                    rows={2}
                    value={formData.description}
                    className="global-input global-input-multiline"
                    InputLabelProps={{ shrink: false }}
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label>Manager</label>
                </Grid>
                <Grid item xs={5}>
                      
                      <Autocomplete
                        id="tags-outlined"
                        options={teamManagers}
                        getOptionLabel={(option) => option.name}
                        onChange={handleChangeTeamManagers}
                        defaultValue="#"
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select  manager"
                          />
                        )}
                      />
                      {formFieldValidation.securityManager ? (
                        <FormHelperText className="error-msg">
                          Please select  manager{" "}
                        </FormHelperText>
                      ) : (
                        ""
                      )}
                    </Grid></Grid>
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
export default CreateTeam;