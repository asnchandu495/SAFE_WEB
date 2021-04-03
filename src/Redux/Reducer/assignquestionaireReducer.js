import {
  ASSIGN_USERGROUP_QUESTIONAIRE,
  ASSIGN_QUESTIONAIRE_USERGROUP,
  CHANGE_QUESTIONAIRE_STATUS,
  DELETE_QUESTIONAIRE_USERGROUP,
} from "../utilits";

var intialState = [];
export default function loadQuestionaireReducer(state = intialState, action) {
  switch (action.type) {
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
