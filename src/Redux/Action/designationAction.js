import {
  LOAD_ASSIGNED_DESIGNATION_SUCCESS,
  CREATE_USER_DESIGNATION_SUCCESS,
  DELETE_USER_DESIGNATION_SUCCESS,
  UPDATE_USER_DESIGNATION_SUCCESS,
} from "../utilits";

import UserDesignationApiServices from "../../services/designationService";

const UserDesignationApi = new UserDesignationApiServices();

export function LoadUserDesignationSuccess(loadUserDesignation) {
  return { type: LOAD_ASSIGNED_DESIGNATION_SUCCESS, loadUserDesignation };
}

export function CreateUserDesignationSuccess(userDesignation) {
  return { type: CREATE_USER_DESIGNATION_SUCCESS, userDesignation };
}

export function UpdateUserDesignationSuccess(userDesignation) {
  return { type: UPDATE_USER_DESIGNATION_SUCCESS, userDesignation };
}

export function DeleteUserDesignationSuccess(userDesignation) {
  return { type: DELETE_USER_DESIGNATION_SUCCESS, userDesignation };
}

export function loadUserDesignation() {
  return function (dispatch) {
    return UserDesignationApi.getListAssignedDesignations()
      .then((data) => {
        dispatch(LoadUserDesignationSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function createUserDesignation(data) {
  var designationId = Math.random();
  data.id = designationId.toString();
  return function (dispatch) {
    return UserDesignationApi.AddAssignedDesignation(data)
      .then((response) => {
        data.id = response.id;
        dispatch(CreateUserDesignationSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function updateUserDesignation(data) {
  return function (dispatch) {
    return UserDesignationApi.UpdateAssignedDesignation(data)
      .then((response) => {
        dispatch(UpdateUserDesignationSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function deleteUserDesignation(data) {
  return function (dispatch) {
    return UserDesignationApi.DeleteSelectedAssignedDesignation(data)
      .then((response) => {
        dispatch(DeleteUserDesignationSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
