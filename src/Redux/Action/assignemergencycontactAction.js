import {
  LOAD_ASSIGN_EMERGENCY_CONTACT_SUCCESS,
  CREATE_ASSIGN_EMERGENCY_CONTACT_SUCCESS,
  UPDATE_ASSIGN_EMERGENCY_CONTACT_SUCCESS,
  DELETE_ASSIGN_EMERGENCY_CONTACT_SUCCESS,
} from "../utilits";

import AssignEmergencyContactApiServices from "../../services/emergencyContactService";

const AssignEmergencyContactApi = new AssignEmergencyContactApiServices();

export function LoadAssignEmergencyContactListSuccess(
  loadAssignEmergencyContacts
) {
  return {
    type: LOAD_ASSIGN_EMERGENCY_CONTACT_SUCCESS,
    loadAssignEmergencyContacts,
  };
}

export function CreateAssignEmergencyContactSuccess(
  assignemergencyContactData
) {
  return {
    type: CREATE_ASSIGN_EMERGENCY_CONTACT_SUCCESS,
    assignemergencyContactData,
  };
}

export function UpdateAssignEmergencyContactSuccess(
  assignemergencyContactData,
  status
) {
  return {
    type: UPDATE_ASSIGN_EMERGENCY_CONTACT_SUCCESS,
    assignemergencyContactData,
    status,
  };
}

export function DeleteAssignEmergencyContactSuccess(
  assignemergencyContactData
) {
  return {
    type: DELETE_ASSIGN_EMERGENCY_CONTACT_SUCCESS,
    assignemergencyContactData,
  };
}

export function LoadAllAssignEmergencyContactList() {
  return function (dispatch) {
    return AssignEmergencyContactApi.ListAssignEmergencyContactToUserGroup()
      .then((data) => {
        dispatch(LoadAssignEmergencyContactListSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function CreateNewAssignEmergencyContact(data) {
  return function (dispatch) {
    return AssignEmergencyContactApi.AssignEmergencyContactToUserGroup(data)
      .then((response) => {
        data.id = response.id;
        dispatch(CreateAssignEmergencyContactSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function UpdateAssignEmergencyContact(data, status, getData) {
  return function (dispatch) {
    return AssignEmergencyContactApi.UpdateAssignEmergencyContactToUserGroup(
      getData
    )
      .then((response) => {
        dispatch(UpdateAssignEmergencyContactSuccess(data, status));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function DeletAssignEmergencyContactList(data) {
  var deletedId = data[0];
  return function (dispatch) {
    return AssignEmergencyContactApi.CancelAssignEmergencyContactToUserGroup(
      data
    )
      .then((response) => {
        dispatch(DeleteAssignEmergencyContactSuccess(deletedId));
      })
      .catch((error) => {
        throw error;
      });
  };
}
