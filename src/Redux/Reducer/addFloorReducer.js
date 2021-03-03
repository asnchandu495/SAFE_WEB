import {
  LOAD_FLOOR_SUCCESS,
  CREATE_FLOOR_SUCCESS,
  UPDATE_FLOOR_SUCCESS,
  DELETE_FLOOR_SUCCESS,
} from "../utilits";

var intialState = [];
export default function AddFloorReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_FLOOR_SUCCESS:
      if (intialState.length == 0) {
        return (intialState = action.loadUserSite);
      } else {
        return state;
      }

    case CREATE_FLOOR_SUCCESS:
      return [{ ...action.userSite }, ...state];

    case UPDATE_FLOOR_SUCCESS:
      return state.map((userSite) =>
        userSite.id === action.userSite.id ? action.userSite : userSite
      );

    case DELETE_FLOOR_SUCCESS:
      return state.filter((user) => user.id !== action.userSite);
    default:
      return state;
  }
}
