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
import questionaireService from "../../services/questionaireService";
const questionaireApi = new questionaireService();

export function LoaddAllQuestionaire(loadquestions) {
  return { type: LOAD_ALL_QUESTIONAIRE, loadquestions };
}

export function CreateQuestionaireSuccess(createQuestionaireData) {
  return { type: CREATE_QUESTIONAIRE_SUCCESS, createQuestionaireData };
}

export function DeleteQuestionaireSuccess(deleteQuestionaireData) {
  return { type: DELETE_QUESTIONAIRE_SUCCESS, deleteQuestionaireData };
}

export function UpdateQuestionaireSuccess(UpdateQuestionaireData) {
  return { type: UPDATE_QUESTIONAIRE_SUCCESS, UpdateQuestionaireData };
}

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

export function loadquestions() {
  return function (dispatch) {
    return questionaireApi
      .GetAllQuestionarie()
      .then((data) => {
        console.log(data);
        dispatch(LoaddAllQuestionaire(data));
      })
      .catch((error) => {
        console.log(error);
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

export function createQuestionaireData(data) {
  return function (dispatch) {
    return questionaireApi
      .AddQuestionarie(data)
      .then((response) => {
        data.id = response.id;
        dispatch(CreateQuestionaireSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function assignQuestionaire(data) {
  return function (dispatch) {
    return questionaireApi
      .AssignQuestionnaireToUserGroup(data)
      .then((response) => {
        data.id = response.id;
        dispatch(AssignQuestionaireUsergroup(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function deleteQuestionaireData(data) {
  return function (dispatch) {
    return questionaireApi
      .deleteQuestionaire(data)
      .then((response) => {
        dispatch(DeleteQuestionaireSuccess(data));
      })
      .catch((error) => {
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

export function UpdateQuestionaireData(data) {
  return function (dispatch) {
    return questionaireApi
      .updateQuestionaire(data)
      .then((response) => {
        dispatch(UpdateQuestionaireSuccess(data));
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
