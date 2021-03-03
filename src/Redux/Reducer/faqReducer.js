import { LOAD_FAQ_SUCCESS, DELETE_FAQ_SUCCESS } from "../utilits";
var intialState = [];
export default function loadFaqReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_FAQ_SUCCESS:
      return action.loadUserDesignation;

    case DELETE_FAQ_SUCCESS:
      return state.filter((user) => user.id !== action.userDesignation);

    default:
      return state;
  }
}
