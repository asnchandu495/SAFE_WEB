import {
  LIST_ALL_QUESTIONS,
  DELETE_SELECTED_BOOLEAN_QUESTION,
  DELETE_SELECTED_DATE_QUESTION,
  DELETE_FREETEXT_QUESTION,
  DELETE_MULTICHOICE_QUESTION,
  DELETE_NUMERIC_QUESTION,
  DELETE_SINGLECHOICE_QUESTION,
} from "../utilits";
//Reducers
//A function that takes 2 arguments and returns application current state and action from mapStateToProps updates redux store and merge them into props components
var intialState = [];
export default function loadQuestionaireReducer(state = intialState, action) {
  switch (action.type) {
    case LIST_ALL_QUESTIONS:
      return action.listallquestions;
    case DELETE_SELECTED_BOOLEAN_QUESTION:
      return state.filter(
        (deleteQuestion) =>
          deleteQuestion.id != action.deleteSelectedQuestionData
      );
    case DELETE_SELECTED_DATE_QUESTION:
      return state.filter(
        (deleteQuestion) =>
          deleteQuestion.id != action.deleteSelecteddateQuestionData
      );
    case DELETE_FREETEXT_QUESTION:
      return state.filter(
        (deleteQuestion) =>
          deleteQuestion.id != action.deleteSelectedfreetextQuestionData
      );
    case DELETE_MULTICHOICE_QUESTION:
      return state.filter(
        (deleteQuestion) =>
          deleteQuestion.id != action.deleteSelectedmultiQuestionData
      );
    case DELETE_NUMERIC_QUESTION:
      return state.filter(
        (deleteQuestion) =>
          deleteQuestion.id != action.deleteSelectednumericQuestionData
      );
    case DELETE_SINGLECHOICE_QUESTION:
      return state.filter(
        (deleteQuestion) =>
          deleteQuestion.id != action.deleteSelectedsingleQuestionData
      );
    default:
      return state;
  }
}
