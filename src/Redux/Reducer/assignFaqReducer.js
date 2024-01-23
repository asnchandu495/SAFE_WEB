import {
  LOAD_ASSIGN_FAQ_SUCCESS,
  CREATE_ASSIGN_FAQ_SUCCESS,
  DELETE_ASSIGN_FAQ_SUCCESS,
  CHANGE_ASSIGN_FAQ_STATUS_SUCCESS,
} from "../utilits";
//Reducers
//A function that takes 2 arguments and returns application current state and action from mapStateToProps updates redux store and merge them into props components
var intialState = [];
export default function loadAssignFaqReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_ASSIGN_FAQ_SUCCESS:
      return action.loadAssignFaQ;

    case CREATE_ASSIGN_FAQ_SUCCESS:
      return [{ ...action.AssignFaQ }, ...state];

    case DELETE_ASSIGN_FAQ_SUCCESS:
      return state.filter((assignFaq) => assignFaq.id !== action.AssignFaQ);

    case CHANGE_ASSIGN_FAQ_STATUS_SUCCESS:
      return state.map((assignGroup) =>
        assignGroup.id === action.AssignFaQ.id
          ? {
              ...assignGroup,
              isActive: action.AssignFaQ.isActive,
            }
          : assignGroup
      );

    default:
      return state;
  }
}
