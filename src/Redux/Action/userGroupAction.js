import {
  LOAD_USER_GROUP_SUCCESS,
  CREATE_USER_GROUP_SUCCESS,
  DELETE_USER_GROUP_SUCCESS,
  UPDATE_USER_GROUP_SUCCESS,
} from "../utilits";

import UserGroupApiServices from "../../services/userGroupService";

const UserGroupApi = new UserGroupApiServices();

export function LoadUserGroupSuccess(loadUserGroup) {
  return { type: LOAD_USER_GROUP_SUCCESS, loadUserGroup };
}

export function CreateUserGroupSuccess(userGroup) {
  return { type: CREATE_USER_GROUP_SUCCESS, userGroup };
}

export function UpdateUserGroupSuccess(userGroup) {
  return { type: UPDATE_USER_GROUP_SUCCESS, userGroup };
}

export function DeleteUserGroupSuccess(userGroup) {
  return { type: DELETE_USER_GROUP_SUCCESS, userGroup };
}

export function loadUserGroup() {
  return function (dispatch) {
    return UserGroupApi.loadUserGroup()
      .then((data) => {
        dispatch(LoadUserGroupSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function createUserGroup(data) {
  return function (dispatch) {
    return UserGroupApi.addUserGroup(data)
      .then((response) => {
        data.id = response.id;
        dispatch(CreateUserGroupSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function updateUserGroup(data) {
  return function (dispatch) {
    return UserGroupApi.updateUserGroup(data)
      .then((response) => {
        dispatch(UpdateUserGroupSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function deleteUserGroup(data) {
  return function (dispatch) {
    return UserGroupApi.deleteUserGroup(data)
      .then((response) => {
        dispatch(DeleteUserGroupSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
