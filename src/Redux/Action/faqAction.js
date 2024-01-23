import {
  LOAD_FAQ_SUCCESS,
  DELETE_FAQ_SUCCESS,
  LOAD_FAQ_BYID,
  DELETE_FAQ_SECTION,
} from "../utilits";

import FaqService from "../../services/faqService";
//Actions are javscript objects that maintain 2 properties type and payload.These actions are "dispatched" by redux store store dispatch api method
//constructor
const faqApi = new FaqService();
//To change the state invokes action creators return an action object  known as action from mapDispatchToProps help you to fire an action
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
