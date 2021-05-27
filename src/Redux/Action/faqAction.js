import { LOAD_FAQ_SUCCESS, DELETE_FAQ_SUCCESS } from "../utilits";

import FaqService from "../../services/faqService";

const faqApi = new FaqService();

export function LoadFaqSuccess(loadUserDesignation) {
  return { type: LOAD_FAQ_SUCCESS, loadUserDesignation };
}

export function DeleteFaqSuccess(userDesignation) {
  return { type: DELETE_FAQ_SUCCESS, userDesignation };
}

export function loadFaq() {
  return function (dispatch) {
    let status = false;
    return faqApi
      .ListFAQs(status)
      .then((data) => {
        dispatch(LoadFaqSuccess(data));
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
