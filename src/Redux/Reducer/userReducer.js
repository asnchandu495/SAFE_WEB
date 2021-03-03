import {
  LOADUSER_SUCCESS,
  CREATEUSER_SUCCESS,
  DELETEUSER_SUCCESS,
  UPDATEEUSER_SUCCESS,
} from "../utilits";
import moment from "moment";
var intialState = [];

export default function loadUserReducer(state = intialState, action) {
  switch (action.type) {
    case LOADUSER_SUCCESS:
      if (intialState.length == 0) {
        return (intialState = action.loadUser);
      } else {
        return state;
      }

    case DELETEUSER_SUCCESS:
      return state.filter((user) => user.id !== action.user);
    case CREATEUSER_SUCCESS:
      return [{ ...action.user }, ...state];
    case UPDATEEUSER_SUCCESS:
      return state.map((user) =>
        user.id === action.user.id ? action.user : user
      );
    default:
      return state;
  }
}
