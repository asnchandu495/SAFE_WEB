import {
  LOAD_FAQ_SUCCESS,
  DELETE_FAQ_SUCCESS,
  LOAD_FAQ_BYID,
  DELETE_FAQ_SECTION,
} from "../utilits";
//Reducers
//A function that takes 2 arguments and returns application current state and action from mapStateToProps updates redux store and merge them into props components
var intialState = [];
export default function loadFaqReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_FAQ_SUCCESS:
      return action.loadUserDesignation;

    case DELETE_FAQ_SUCCESS:
      return state.filter((user) => user.id !== action.userDesignation);
    case LOAD_FAQ_BYID:
      return action.loadFAQData;

    case DELETE_FAQ_SECTION:
      // return state.sections.filter(
      //   (sec) => sec.id != action.deleteFaqSection.sectionId
      // );
      return {
        ...state,
        sections: state.sections.filter(
          (item) => item.id !== action.deleteFaqSection.sectionId
        ),
      };
    default:
      return state;
  }
}
