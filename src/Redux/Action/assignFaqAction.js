import {
  LOAD_ASSIGN_FAQ_SUCCESS,
  CREATE_ASSIGN_FAQ_SUCCESS,
  CHANGE_ASSIGN_FAQ_STATUS_SUCCESS,
  DELETE_ASSIGN_FAQ_SUCCESS,
} from "../utilits";

import FaqService from "../../services/faqService";
//Actions are javscript objects that maintain 2 properties type and payload.These actions are "dispatched" by redux store store dispatch api method
//constructor
const faqApiCall = new FaqService();
//To change the state invokes action creators return an action object  known as action from mapDispatchToProps help you to fire an action

export function LoadFaqAssignSuccess(loadAssignFaQ) {
  return { type: LOAD_ASSIGN_FAQ_SUCCESS, loadAssignFaQ };
}

export function CreateFaqAssignSuccess(AssignFaQ) {
  return { type: CREATE_ASSIGN_FAQ_SUCCESS, AssignFaQ };
}

export function DeleteFaqAssignSuccess(AssignFaQ) {
  return { type: DELETE_ASSIGN_FAQ_SUCCESS, AssignFaQ };
}

export function UpdateFaqAssignSuccess(AssignFaQ) {
  return { type: CHANGE_ASSIGN_FAQ_STATUS_SUCCESS, AssignFaQ };
}

export function loadAssignFaq() {
  return function (dispatch) {
    return faqApiCall
      .getFaqUserGroups()
      .then((data) => {
        dispatch(LoadFaqAssignSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function CreateAssignFaq(data) {
  return function (dispatch) {
    return faqApiCall
      .AssignFAQToForm(data)
      .then((response) => {
        data.id = response.id;
        dispatch(CreateFaqAssignSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function deleteAssignFaq(data) {
  return function (dispatch) {
    return faqApiCall
      .DisassociateFaq(data)
      .then((response) => {
        dispatch(DeleteFaqAssignSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function UpdateFaqAssign(data) {
  return function (dispatch) {
    return faqApiCall
      .ChangeFqaGroupStatus(data)
      .then((response) => {
        dispatch(UpdateFaqAssignSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
