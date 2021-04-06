import {
  LIST_ALL_QUESTIONS,
  DELETE_SELECTED_BOOLEAN_QUESTION,
  DELETE_SELECTED_DATE_QUESTION,
  DELETE_FREETEXT_QUESTION,
  DELETE_MULTICHOICE_QUESTION,
  DELETE_NUMERIC_QUESTION,
  DELETE_SINGLECHOICE_QUESTION,
} from "../utilits";
import questionaireService from "../../services/questionaireService";
const questionaireApi = new questionaireService();

export function Listallquestions(listallquestions) {
  return { type: LIST_ALL_QUESTIONS, listallquestions };
}

export function DeleteSelectedBooleanQuestion(deleteSelectedQuestionData) {
  return { type: DELETE_SELECTED_BOOLEAN_QUESTION, deleteSelectedQuestionData };
}

export function DeleteSelectedDateQuestion(deleteSelecteddateQuestionData) {
  return {
    type: DELETE_SELECTED_DATE_QUESTION,
    deleteSelecteddateQuestionData,
  };
}

export function DeleteSelectedFreetextQuestion(
  deleteSelectedfreetextQuestionData
) {
  return {
    type: DELETE_FREETEXT_QUESTION,
    deleteSelectedfreetextQuestionData,
  };
}

export function DeleteSelectedMultiQuestion(deleteSelectedmultiQuestionData) {
  return {
    type: DELETE_MULTICHOICE_QUESTION,
    deleteSelectedmultiQuestionData,
  };
}

export function DeleteSelectedNumericQuestion(
  deleteSelectednumericQuestionData
) {
  return {
    type: DELETE_NUMERIC_QUESTION,
    deleteSelectednumericQuestionData,
  };
}

export function DeleteSelectedSinglechoiceQuestion(
  deleteSelectedsingleQuestionData
) {
  return {
    type: DELETE_SINGLECHOICE_QUESTION,
    deleteSelectedsingleQuestionData,
  };
}

export function listallquestions(id) {
  return function (dispatch) {
    return questionaireApi
      .GetAllQuestionsBySurveyId(id)
      .then((data) => {
        console.log(data);
        dispatch(Listallquestions(data));
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  };
}

export function DeleteBooleanQuestion(data) {
  return function (dispatch) {
    return questionaireApi
      .DeleteBooleanQuestion(data)
      .then((response) => {
        dispatch(DeleteSelectedBooleanQuestion(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function DeleteDateQuestion(data) {
  return function (dispatch) {
    return questionaireApi
      .DeleteDateQuestion(data)
      .then((response) => {
        dispatch(DeleteSelectedDateQuestion(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
export function DeleteFreeQuestion(data) {
  return function (dispatch) {
    return questionaireApi
      .DeleteFreeTextQuestion(data)
      .then((response) => {
        dispatch(DeleteSelectedFreetextQuestion(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function DeleteMultichoiceQuestion(data) {
  return function (dispatch) {
    return questionaireApi
      .DeleteMultichoiceQuestion(data)
      .then((response) => {
        dispatch(DeleteSelectedMultiQuestion(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function DeleteNumericQuestion(data) {
  return function (dispatch) {
    return questionaireApi
      .DeleteNumericQuestion(data)
      .then((response) => {
        dispatch(DeleteSelectedNumericQuestion(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function DeleteSinglechoiceQuestion(data) {
  return function (dispatch) {
    return questionaireApi
      .DeleteSinglechoiceQuestion(data)
      .then((response) => {
        dispatch(DeleteSelectedSinglechoiceQuestion(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
