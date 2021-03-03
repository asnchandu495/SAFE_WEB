import {
  LOAD_LOCATION_SUCCESS,
  CREATE_LOCATION_SUCCESS,
  UPDATE_LOCATION_SUCCESS,
  DELETE_LOCATION_SUCCESS,
} from "../utilits";

var intialState = [];
export default function AddLocationReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_LOCATION_SUCCESS:
      if (intialState.length == 0) {
        return (intialState = action.loadUserSite);
      } else {
        return state;
      }

    case CREATE_LOCATION_SUCCESS:
      return [{ ...action.userSite }, ...state];

    case UPDATE_LOCATION_SUCCESS:
      return state.map((userSite) =>
        userSite.id === action.userSite.id ? action.userSite : userSite
      );

    case DELETE_LOCATION_SUCCESS:
      return state.filter((user) => user.id !== action.userSite);
    default:
      return state;
  }
}
