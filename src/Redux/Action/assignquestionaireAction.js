import {
  ASSIGN_USERGROUP_QUESTIONAIRE,
  ASSIGN_QUESTIONAIRE_USERGROUP,
  CHANGE_QUESTIONAIRE_STATUS,
  DELETE_QUESTIONAIRE_USERGROUP,
} from "../utilits";

import questionaireService from "../../services/questionaireService";
//Actions are javscript objects that maintain 2 properties type and payload.These actions are "dispatched" by redux store store dispatch api method
//constructor
const questionaireApi = new questionaireService();
//To change the state invokes action creators return an action object  known as action from mapDispatchToProps help you to fire an action

export function AssignUsergroupQuestionaire(loadAssignQuestionnaire) {
  return { type: ASSIGN_USERGROUP_QUESTIONAIRE, loadAssignQuestionnaire };
}

export function ChangeQuestionnaireStatusSuccess(ChangeQuestionnaireStatus) {
  return { type: CHANGE_QUESTIONAIRE_STATUS, ChangeQuestionnaireStatus };
}

export function AssignQuestionaireUsergroup(assignQuestionaire) {
  return { type: ASSIGN_QUESTIONAIRE_USERGROUP, assignQuestionaire };
}

export function DeleteQuestionaireUsergroup(deleteQuestionaireUsergroupData) {
  return {
    type: DELETE_QUESTIONAIRE_USERGROUP,
    deleteQuestionaireUsergroupData,
  };
}

export function assignQuestionaire(data) {
  return function (dispatch) {
    return questionaireApi
      .AssignQuestionnaireToUserGroup(data)
      .then((response) => {
        data.id = response.id;
        data.groupDetails = data.groupdetails;
        data.questionnaireDetails = data.questionnairedetails;
        dispatch(AssignQuestionaireUsergroup(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function loadAssignQuestionnaire() {
  return function (dispatch) {
    return questionaireApi
      .ListAllAssignedQuestionnaires()
      .then((data) => {
        dispatch(AssignUsergroupQuestionaire(data));
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  };
}

export function deleteQuestionaireUsergroupData(data) {
  return function (dispatch) {
    return questionaireApi
      .RemoveQuestionnaireFromUserGroup(data)
      .then((response) => {
        dispatch(DeleteQuestionaireUsergroup(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function ChangeQuestionnaireStatus(data) {
  return function (dispatch) {
    return questionaireApi
      .ChangeQuestionnaireStatus(data)
      .then((response) => {
        dispatch(ChangeQuestionnaireStatusSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
