import {
  PUBLISH_FAQ_SUCCESS,
  LOAD_FAQ_PUBLISH,
  DELETE_PUBLISH_FAQ,
} from "../utilits";

import FaqService from "../../services/faqService";
//Actions are javscript objects that maintain 2 properties type and payload.These actions are "dispatched" by redux store store dispatch api method
//constructor
const faqApiCall = new FaqService();
//To change the state invokes action creators return an action object  known as action from mapDispatchToProps help you to fire an action

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
