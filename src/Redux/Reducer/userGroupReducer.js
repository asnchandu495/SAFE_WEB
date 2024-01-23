import {
  LOAD_USER_GROUP_SUCCESS,
  CREATE_USER_GROUP_SUCCESS,
  DELETE_USER_GROUP_SUCCESS,
  UPDATE_USER_GROUP_SUCCESS,
} from "../utilits";
//Reducers
//A function that takes 2 arguments and returns application current state and action from mapStateToProps updates redux store and merge them into props components
var intialState = [];
export default function loadUserGroupReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_USER_GROUP_SUCCESS:
      if (intialState.length == 0) {
        return (intialState = action.loadUserGroup);
      } else {
        return state;
      }

    case CREATE_USER_GROUP_SUCCESS:
      return [{ ...action.userGroup }, ...state];

    case DELETE_USER_GROUP_SUCCESS:
      return state.filter((user) => user.id !== action.userGroup);

    case UPDATE_USER_GROUP_SUCCESS:
      return state.map((userGroup) =>
        userGroup.id === action.userGroup.id ? action.userGroup : userGroup
      );
    default:
      return state;
  }
}
