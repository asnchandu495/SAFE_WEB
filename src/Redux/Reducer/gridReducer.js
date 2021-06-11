import {
  LOADGRIDHISTORY_SUCCESS,
  UPDATEGRIDHISTORY_SUCCESS,
  GETGRIDHISTORY_SUCCESS,
} from "../utilits";
var intialState = [];

export default function loadGridHistoryReducer(state = intialState, action) {
  switch (action.type) {
    case LOADGRIDHISTORY_SUCCESS:
      return action.loadGridHistory;
      break;
    case UPDATEGRIDHISTORY_SUCCESS:
      return state.map((grid) =>
        grid.name == action.gridHistory.name ? action.gridHistory : grid
      );
      break;
    case GETGRIDHISTORY_SUCCESS:
      return state;
      break;
    default:
      return state;
  }
}
