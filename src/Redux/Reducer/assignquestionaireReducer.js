import {
  ASSIGN_USERGROUP_QUESTIONAIRE,
  ASSIGN_QUESTIONAIRE_USERGROUP,
  CHANGE_QUESTIONAIRE_STATUS,
  DELETE_QUESTIONAIRE_USERGROUP,
} from "../utilits";

var intialState = [];
export default function loadQuestionaireReducer(state = intialState, action) {
  console.log(action);
  switch (action.type) {
    case ASSIGN_USERGROUP_QUESTIONAIRE:
      return action.loadAssignQuestionnaire;

    case ASSIGN_QUESTIONAIRE_USERGROUP:
      return [{ ...action.assignQuestionaire }, ...state];

    case CHANGE_QUESTIONAIRE_STATUS:
      return state.map((changeQuestionaireStatus) =>
        changeQuestionaireStatus.id == action.ChangeQuestionnaireStatus.id
          ? {
              ...changeQuestionaireStatus,
              status: action.ChangeQuestionnaireStatus.status,
            }
          : changeQuestionaireStatus
      );

    case DELETE_QUESTIONAIRE_USERGROUP:
      return state.filter(
        (deleteQuestionaire) =>
          deleteQuestionaire.id != action.deleteQuestionaireUsergroupData
      );
    default:
      return state;
  }
}
