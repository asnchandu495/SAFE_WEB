import { LOAD_ALL_TEAMS } from "../utilits";
var intialState = [];

export default function loadallteamsReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_ALL_TEAMS:
      return action.loadTeam;
    default:
      return state;
  }
}
