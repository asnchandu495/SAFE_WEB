import {
  PUBLISH_FAQ_SUCCESS,
  LOAD_FAQ_PUBLISH,
  DELETE_PUBLISH_FAQ,
} from "../utilits";

import FaqService from "../../services/faqService";

const faqApiCall = new FaqService();

export function PublishFAQSuccess(FaQ) {
  return { type: PUBLISH_FAQ_SUCCESS, FaQ };
}

export function LoadFaqPublishSuccess(loadFaq) {
  return { type: LOAD_FAQ_PUBLISH, loadFaq };
}

export function DeletePublishFaqSuccess(user) {
  return { type: DELETE_PUBLISH_FAQ, user };
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

export function loadFaq(jsonData) {
  return function (dispatch) {
    // let status = true;
    return faqApiCall
      .ListFAQs(jsonData)
      .then((data) => {
        dispatch(LoadFaqPublishSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function deletePublishFaq(publishdata) {
  return function (dispatch) {
    return faqApiCall
      .deleteSelectedPublishFaq(publishdata)
      .then((response) => {
        dispatch(DeletePublishFaqSuccess(publishdata));
      })
      .catch((error) => {
        throw error;
      });
  };
}
