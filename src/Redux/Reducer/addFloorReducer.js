import {
  LOAD_FLOOR_SUCCESS,
  CREATE_FLOOR_SUCCESS,
  UPDATE_FLOOR_SUCCESS,
  DELETE_FLOOR_SUCCESS,
} from "../utilits";
//Reducers
//A function that takes 2 arguments and returns application current state and action from mapStateToProps updates redux store and merge them into props components
var intialState = [];
export default function AddFloorReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_FLOOR_SUCCESS:
      return action.loadUserSite;

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
