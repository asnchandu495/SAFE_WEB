import { LOADGRIDHISTORY_SUCCESS, UPDATEGRIDHISTORY_SUCCESS } from "../utilits";
var intialState = [];

export default function loadGridHistoryReducer(state = intialState, action) {
  switch (action.type) {
    case LOADGRIDHISTORY_SUCCESS:
      return state;
      break;
    case UPDATEGRIDHISTORY_SUCCESS:
      return state.map((user) =>
        user.id === action.user.id ? action.user : user
      );
      break;
    default:
      return state;
  }
}
