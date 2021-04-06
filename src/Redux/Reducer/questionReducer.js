import {
  LIST_ALL_QUESTIONS,
  DELETE_SELECTED_BOOLEAN_QUESTION,
  DELETE_SELECTED_DATE_QUESTION,
  DELETE_FREETEXT_QUESTION,
  DELETE_MULTICHOICE_QUESTION,
  DELETE_NUMERIC_QUESTION,
  DELETE_SINGLECHOICE_QUESTION,
} from "../utilits";

var intialState = [];
export default function loadQuestionaireReducer(state = intialState, action) {
  switch (action.type) {
    case LIST_ALL_QUESTIONS:
      return action.listallquestions;
    case DELETE_SELECTED_BOOLEAN_QUESTION:
      console.log(action);
      return state.filter(
        (deleteQuestion) =>
          deleteQuestion.id != action.deleteSelectedQuestionData
      );
    case DELETE_SELECTED_DATE_QUESTION:
      console.log(action);
      return state.filter(
        (deleteQuestion) =>
          deleteQuestion.id != action.deleteSelecteddateQuestionData
      );
    case DELETE_FREETEXT_QUESTION:
      console.log(action);
      return state.filter(
        (deleteQuestion) =>
          deleteQuestion.id != action.deleteSelectedfreetextQuestionData
      );
    case DELETE_MULTICHOICE_QUESTION:
      console.log(action);
      return state.filter(
        (deleteQuestion) =>
          deleteQuestion.id != action.deleteSelectedmultiQuestionData
      );
    case DELETE_NUMERIC_QUESTION:
      console.log(action);
      return state.filter(
        (deleteQuestion) =>
          deleteQuestion.id != action.deleteSelectednumericQuestionData
      );
    case DELETE_SINGLECHOICE_QUESTION:
      console.log(action);
      return state.filter(
        (deleteQuestion) =>
          deleteQuestion.id != action.deleteSelectedsingleQuestionData
      );
    default:
      return state;
  }
}
