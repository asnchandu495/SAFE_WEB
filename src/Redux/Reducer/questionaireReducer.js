import {
  LOAD_ALL_QUESTIONAIRE,
  CREATE_QUESTIONAIRE_SUCCESS,
  DELETE_QUESTIONAIRE_SUCCESS,
  UPDATE_QUESTIONAIRE_SUCCESS,
} from "../utilits";

var intialState = [];
export default function loadQuestionaireReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_ALL_QUESTIONAIRE:
      return action.loadquestions;

    // return state;
    case CREATE_QUESTIONAIRE_SUCCESS:
      return [{ ...action.createQuestionaireData }, ...state];
    case UPDATE_QUESTIONAIRE_SUCCESS:
      return state.map((UpdateQuestionaireData) =>
        UpdateQuestionaireData.id === action.UpdateQuestionaireData.id
          ? action.UpdateQuestionaireData
          : UpdateQuestionaireData
      );
    case DELETE_QUESTIONAIRE_SUCCESS:
      return state.filter(
        (deleteQuestionaireData) =>
          deleteQuestionaireData.id !== action.deleteQuestionaireData
      );
    default:
      return state;
  }
}
