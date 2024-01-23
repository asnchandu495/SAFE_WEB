import {
  LOAD_USER_GROUP_SUCCESS,
  CREATE_USER_GROUP_SUCCESS,
  DELETE_USER_GROUP_SUCCESS,
  UPDATE_USER_GROUP_SUCCESS,
} from "../utilits";

import UserGroupApiServices from "../../services/userGroupService";
//Actions are javscript objects that maintain 2 properties type and payload.These actions are "dispatched" by redux store store dispatch api method
//constructor
const UserGroupApi = new UserGroupApiServices();
//To change the state invokes action creators return an action object  known as action from mapDispatchToProps help you to fire an action

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
