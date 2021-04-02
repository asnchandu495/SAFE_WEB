import {
  LOAD_ALL_QUESTIONAIRE,
  CREATE_QUESTIONAIRE_SUCCESS,
  DELETE_QUESTIONAIRE_SUCCESS,
  UPDATE_QUESTIONAIRE_SUCCESS,
  ASSIGN_USERGROUP_QUESTIONAIRE,
  ASSIGN_QUESTIONAIRE_USERGROUP,
  CHANGE_QUESTIONAIRE_STATUS,
  DELETE_QUESTIONAIRE_USERGROUP,
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
    case ASSIGN_USERGROUP_QUESTIONAIRE:
      return action.loadAssignQuestionnaire;
    case ASSIGN_QUESTIONAIRE_USERGROUP:
      return [{ ...action.assignQuestionaire }, ...state];

    // case CHANGE_QUESTIONAIRE_STATUS:
    //   return state.map((changeQuestionaireStatus) =>
    //     changeQuestionaireStatus.id === action.changeQuestionaireStatus.id
    //       ? action.changeQuestionaireStatus
    //       : changeQuestionaireStatus
    //   );

    case CHANGE_QUESTIONAIRE_STATUS:
      return state.map((changeQuestionaireStatus) =>
        changeQuestionaireStatus.id === action.ChangeQuestionnaireStatus
          ? {
              ...changeQuestionaireStatus,
              Active: action.status,
            }
          : changeQuestionaireStatus
      );
    case DELETE_QUESTIONAIRE_USERGROUP:
      return state.filter(
        (deleteQuestionaire) =>
          deleteQuestionaire.id !== action.deleteQuestionaireUsergroupData
      );
    default:
      return state;
  }
}
