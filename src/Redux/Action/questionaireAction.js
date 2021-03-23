import {
  LOAD_ALL_QUESTIONAIRE,
  CREATE_QUESTIONAIRE_SUCCESS,
  DELETE_QUESTIONAIRE_SUCCESS,
  UPDATE_QUESTIONAIRE_SUCCESS,
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
