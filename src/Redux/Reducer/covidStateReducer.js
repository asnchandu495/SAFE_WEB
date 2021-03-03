import {
  LOAD_COVID_STATE_SUCCESS,
  UPDATE_COVID_STATE_SUCCESS,
  CREATE_COVID_STATE_SUCCESS,
  DELETE_COVID_STATE_SUCCESS,
} from "../utilits";
var intialState = [];
export default function loadCovidStateReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_COVID_STATE_SUCCESS:
      if (intialState.length == 0) {
        return (intialState = action.loadUserDesignation);
      } else {
        return state;
      }

    case CREATE_COVID_STATE_SUCCESS:
      return [{ ...action.userDesignation }, ...state];

    case DELETE_COVID_STATE_SUCCESS:
      return state.filter((user) => user.id !== action.userDesignation);

    case UPDATE_COVID_STATE_SUCCESS:
      return state.map((userDesignation) =>
        userDesignation.id === action.userDesignation.id
          ? action.userDesignation
          : userDesignation
      );
    default:
      return state;
  }
}
