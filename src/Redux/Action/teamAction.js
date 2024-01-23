import {
  LOAD_ALL_TEAMS,
  CREATE_TEAM_SUCCESS,
  UPDATE_TEAM_SUCCESS,
  DELETE_TEAM_SUCCESS,
} from "../utilits";
import TeamService from "../../services/teamService";
//Actions are javscript objects that maintain 2 properties type and payload.These actions are "dispatched" by redux store store dispatch api method
//constructor
const teamApiCall = new TeamService();
//To change the state invokes action creators return an action object  known as action from mapDispatchToProps help you to fire an action

export function LoadAllTeams(loadTeam) {
  return { type: LOAD_ALL_TEAMS, loadTeam };
}

export function CreateTeamsSuccess(createTeamData) {
  return { type: CREATE_TEAM_SUCCESS, createTeamData };
}

export function UpdateTeamsSuccess(updateTeamData) {
  return { type: UPDATE_TEAM_SUCCESS, updateTeamData };
}

export function DeleteTeamsSuccess(deleteTeamData) {
  return { type: DELETE_TEAM_SUCCESS, deleteTeamData };
}

export function loadTeam() {
  return function (dispatch) {
    return teamApiCall
      .getTeamList()
      .then((data) => {
        dispatch(LoadAllTeams(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function deleteTeamData(data) {
  return function (dispatch) {
    return teamApiCall
      .deleteTeam(data)
      .then((response) => {
        dispatch(DeleteTeamsSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function createTeamData(data) {
  return function (dispatch) {
    return teamApiCall
      .createTeams(data)
      .then((response) => {
        data.id = response.id;
        dispatch(CreateTeamsSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function updateTeamData(data) {
  return function (dispatch) {
    return teamApiCall
      .updateTeams(data)
      .then((response) => {
        dispatch(UpdateTeamsSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
