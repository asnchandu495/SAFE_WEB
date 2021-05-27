import { PUBLISH_FAQ_SUCCESS, LOAD_FAQ_PUBLISH } from "../utilits";

import FaqService from "../../services/faqService";

const faqApiCall = new FaqService();

export function PublishFAQSuccess(FaQ) {
  return { type: PUBLISH_FAQ_SUCCESS, FaQ };
}

export function LoadFaqPublishSuccess(loadFaq) {
  return { type: LOAD_FAQ_PUBLISH, loadFaq };
}

export function PublishFAQ(data) {
  return function (dispatch) {
    return faqApiCall
      .PublishFAQ(data)
      .then((response) => {
        dispatch(PublishFAQSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function loadFaq() {
  return function (dispatch) {
    let status = true;
    return faqApiCall
      .ListFAQs(status)
      .then((data) => {
        dispatch(LoadFaqPublishSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
