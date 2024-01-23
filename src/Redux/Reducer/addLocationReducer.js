import {
  LOAD_LOCATION_SUCCESS,
  CREATE_LOCATION_SUCCESS,
  UPDATE_LOCATION_SUCCESS,
  DELETE_LOCATION_SUCCESS,
} from "../utilits";
//Reducers
//A function that takes 2 arguments and returns application current state and action from mapStateToProps updates redux store and merge them into props components
var intialState = [];
export default function AddLocationReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_LOCATION_SUCCESS:
      return action.loadUserSite;

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
