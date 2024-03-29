import React, { Fragment, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { connect } from "react-redux";
import * as TeamAction from "../../Redux/Action/teamAction";
import PropTypes from "prop-types";
import AlertBoxComponent from "../common/alert";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import Autocomplete from "@material-ui/lab/Autocomplete";
import teamService from "../../services/teamService";

function CreateTeam(props) {
  const [formFieldValidation, setformFieldValidation] = useState({
    manager: false,
  });
  const [teamManagers, setTeamManagers] = useState([]);
  const [selectedTeamManager, setSelectedTeamManager] = useState();
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);

  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const teamId = props.match.params.id;

  const teamApiCall = new teamService();

  const [formData, SetformData] = useState({
    id: "",
    name: "",
    description: "",
    manager: {},
  });

  useEffect(() => {
    teamApiCall
      .getTeamManager()
      .then((res) => {
        setTeamManagers(res);
        if (teamId != 0) {
          teamApiCall
            .viewApplicationUserByTeamId(teamId)
            .then((teamData) => {
              SetformData(teamData);
              setSelectedTeamManager(teamData.manager);
              setComponentLoadder(false);
            })
            .catch((error) => {
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

  /**
   * Handle change
   * Binding data with the form fields also calls the check unique function
   * @param  {} e
   */
  function handleChange(e) {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    if (name == "name") {
      checkUnqueName(value);
    }
    SetformData((formData) => ({
      ...formData,
      [name]: value,
    }));
  }

  //Method to check if there's any duplicacy in the teams name
  function checkUnqueName(value) {
    if (props.match.params.id != 0) {
      if (props.teamDatas && props.teamDatas.length > 0) {
        let filteredData = props.teamDatas.filter((x) => {
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
      if (props.teamDatas && props.teamDatas.length > 0) {
        let matchedValue = props.teamDatas.find(
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

  //Method to handle the dropdown and set the state
  function handleChangeTeamManagers(event, value) {
    setisAlertBoxOpened(true);
    setSelectedTeamManager(value);
  }
  //Method after form submit and checks the form validations here if manager  is selected from dropdown then redirect or else stay in
  function teamCreation(e) {
    e.preventDefault();
    SelectManagerValidation();
    if (selectedTeamManager) {
      SubmitUserForm();
    } else {
      return false;
    }
  }

  //Method after form submit and validations to add or update a team
  function SubmitUserForm() {
    setshowLoadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    var teamData = formData;
    if (teamId != 0) {
      teamData.manager = selectedTeamManager;
      props
        .UpdateTeamCall(teamData)
        .then((result) => {
          setisAlertBoxOpened(false);
          setshowLoadder(false);
          setStateSnackbar(true);
          setToasterMessage("Team  Updated");
          settoasterServerity("success");
          setTimeout(() => {
            props.history.push("/teams/allteams");
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
    } else {
      teamData.manager = selectedTeamManager;

      props
        .CreateTeamCall(teamData)

        .then((result) => {
          setisAlertBoxOpened(false);
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
  }
  //Method to redirect to  on click of cancel
  function redirectToAllTeam() {
    props.history.push("/teams/allteams");
  }

  //Validating  and setting the state on change of the select manager dropdown
  function SelectManagerValidation() {
    if (selectedTeamManager) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["manager"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["manager"]: true,
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
          to={`/teams/allteams`}
          className="inactive"
        >
          Teams
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          {teamId != 0 ? "Update Team " : "Create Team "}
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <Paper className="main-paper">
          <ValidatorForm className={`global-form`} onSubmit={teamCreation}>
            <Grid container spacing={3}>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="input-label required">Team Name</label>
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
                      "Special character  not allowed",
                      "Maximum 50 characters",
                    ]}
                    fullWidth
                    id="name"
                    placeholder="Team name"
                    name="name"
                    autoComplete="name"
                    onChange={handleChange}
                    value={formData.name}
                    autoFocus
                    InputLabelProps={{ shrink: false }}
                    className="global-input"
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
                  <label htmlFor="password" className="input-label required">
                    Manager
                  </label>
                </Grid>
                <Grid item xs={5}>
                  <Autocomplete
                    id="tags-outlined"
                    // /options={teamManagers}
                    options={
                      teamManagers && teamManagers.length > 0
                        ? teamManagers
                        : []
                    }
                    getOptionLabel={(option) => option.name}
                    onChange={handleChangeTeamManagers}
                    // defaultValue={formData.manager ? formData.manager : {}}
                    defaultValue={selectedTeamManager}
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
                  {formFieldValidation.manager ? (
                    <FormHelperText className="error-msg">
                      Please select manager{" "}
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
                      onClick={redirectToAllTeam}
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

/**
 * Get Team By Id
 * Method to find the conatct user on id return 1st  matched element
 * @param  {} users--   teamId
 * @param  {} id---id
 */
export function getTeamById(users, id) {
  return users.find((user) => user.id === id) || null;
}

//Validate the data recieved from the props
CreateTeam.propTypes = {
  teamDatas: PropTypes.array.isRequired,
  teamData: PropTypes.array.isRequired,
  LoadAllUserGroup: PropTypes.func.isRequired,
  CreateTeamCall: PropTypes.func.isRequired,
  UpdateTeamCall: PropTypes.func.isRequired,
};

//Update the redux the store and merge them into props
function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const emptyObject = {};
  const teamData =
    id && state.team.length > 0 ? getTeamById(state.team, id) : emptyObject;
  return {
    teamData,
    teamDatas: state.team,
  };
}

// Customizing the functions your component receives, and how they dispatch actions
const mapDispatchToProps = {
  LoadAllUserGroup: TeamAction.loadTeam,
  CreateTeamCall: TeamAction.createTeamData,
  UpdateTeamCall: TeamAction.updateTeamData,
};
//Connect the component with redux store
export default connect(mapStateToProps, mapDispatchToProps)(CreateTeam);
