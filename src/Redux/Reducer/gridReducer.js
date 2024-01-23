import {
  LOADGRIDHISTORY_SUCCESS,
  UPDATEGRIDHISTORY_SUCCESS,
  GETGRIDHISTORY_SUCCESS,
} from "../utilits";
//Reducers
//A function that takes 2 arguments and returns application current state and action from mapStateToProps updates redux store and merge them into props components
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
