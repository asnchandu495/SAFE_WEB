import {
  LOAD_ASSIGNED_DESIGNATION_SUCCESS,
  CREATE_USER_DESIGNATION_SUCCESS,
  UPDATE_USER_DESIGNATION_SUCCESS,
  DELETE_USER_DESIGNATION_SUCCESS,
} from "../utilits";
var intialState = [];
export default function loadUserGroupReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_ASSIGNED_DESIGNATION_SUCCESS:
      if (intialState.length == 0) {
        return (intialState = action.loadUserDesignation);
      } else {
        return state;
      }

    case CREATE_USER_DESIGNATION_SUCCESS:
      return [{ ...action.userDesignation }, ...state];

    case DELETE_USER_DESIGNATION_SUCCESS:
      return state.filter((user) => user.id !== action.userDesignation);

    case UPDATE_USER_DESIGNATION_SUCCESS:
      return state.map((userDesignation) =>
        userDesignation.id === action.userDesignation.id
          ? action.userDesignation
          : userDesignation
      );
    default:
      return state;
  }
}
