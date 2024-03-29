import {
  LOAD_ALL_TEAMS,
  CREATE_TEAM_SUCCESS,
  UPDATE_TEAM_SUCCESS,
  DELETE_TEAM_SUCCESS,
} from "../utilits";
//Reducers
//A function that takes 2 arguments and returns application current state and action from mapStateToProps updates redux store and merge them into props components
var intialState = [];

export default function loadallteamsReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_ALL_TEAMS:
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
