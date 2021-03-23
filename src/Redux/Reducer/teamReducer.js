import {
  LOAD_ALL_TEAMS,
  CREATE_TEAM_SUCCESS,
  UPDATE_TEAM_SUCCESS,
  DELETE_TEAM_SUCCESS,
} from "../utilits";
var intialState = [];

export default function loadallteamsReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_ALL_TEAMS:
      // console.log('statae');
      // console.log(action.loadTeam);
      return action.loadTeam;
    case CREATE_TEAM_SUCCESS:
      return [{ ...action.createTeamData }, ...state];
    case UPDATE_TEAM_SUCCESS:
      return state.map((updateTeamData) =>
        updateTeamData.id === action.updateTeamData.id
          ? action.updateTeamData
          : updateTeamData
      );
    case DELETE_TEAM_SUCCESS:
      return state.filter(
        (deleteTeamData) => deleteTeamData.id !== action.deleteTeamData
      );
    default:
      return state;
  }
}
