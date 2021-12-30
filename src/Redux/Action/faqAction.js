import {
  LOAD_FAQ_SUCCESS,
  DELETE_FAQ_SUCCESS,
  LOAD_FAQ_BYID,
  DELETE_FAQ_SECTION,
} from "../utilits";

import FaqService from "../../services/faqService";

const faqApi = new FaqService();

export function LoadFaqSuccess(loadUserDesignation) {
  return { type: LOAD_FAQ_SUCCESS, loadUserDesignation };
}

export function DeleteFaqSuccess(userDesignation) {
  return { type: DELETE_FAQ_SUCCESS, userDesignation };
}
export function LoadGetIDFAQ(loadFAQData) {
  return { type: LOAD_FAQ_BYID, loadFAQData };
}
export function DeleteFaqSectionSuccess(deleteFaqSection) {
  return { type: DELETE_FAQ_SECTION, deleteFaqSection };
}

export function loadFaq(jsondata) {
  return function (dispatch) {
    return faqApi
      .ListFAQs(jsondata)
      .then((data) => {
        dispatch(LoadFaqSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
export function loadGetFAQ(jsondata) {
  return function (dispatch) {
    return faqApi
      .getFaqById(jsondata)
      .then((data) => {
        dispatch(LoadGetIDFAQ(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
export function deleteFaq(data) {
  return function (dispatch) {
    return faqApi
      .deleteSelectedFaq(data)
      .then((response) => {
        dispatch(DeleteFaqSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
export function deleteFaqSection(data) {
  return function (dispatch) {
    return faqApi
      .deleteSectionFaq(data)
      .then((response) => {
        dispatch(DeleteFaqSectionSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
