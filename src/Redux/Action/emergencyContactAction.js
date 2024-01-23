import {
  LOAD_EMERGENCY_CONTACT_SUCCESS,
  DELETE_EMERGENCY_CONTACT_SUCCESS,
  CREATE_EMERGENCY_CONTACT_SUCCESS,
  UPDATE_EMERGENCY_CONTACT_SUCCESS,
} from "../utilits";
import EmergencyContactService from "../../services/emergencyContactService";
//Actions are javscript objects that maintain 2 properties type and payload.These actions are "dispatched" by redux store store dispatch api method
//constructor
const EmergencyContactApiCall = new EmergencyContactService();
//To change the state invokes action creators return an action object  known as action from mapDispatchToProps help you to fire an action
export function LoadEmergencyContactListSuccess(loadEmergencyContacts) {
  return { type: LOAD_EMERGENCY_CONTACT_SUCCESS, loadEmergencyContacts };
}

export function CreateEmergencyContactSuccess(emergencyContactData) {
  return { type: CREATE_EMERGENCY_CONTACT_SUCCESS, emergencyContactData };
}

export function UpdateEmergencyContactSuccess(emergencyContactData) {
  return { type: UPDATE_EMERGENCY_CONTACT_SUCCESS, emergencyContactData };
}

export function DeleteEmergencyContactSuccess(emergencyContact) {
  return { type: DELETE_EMERGENCY_CONTACT_SUCCESS, emergencyContact };
}

export function LoadAllEmergencyContactList(getLanguage) {
  return function (dispatch) {
    return EmergencyContactApiCall.ViewAllEmergencyContacts(getLanguage)
      .then((response) => {
        dispatch(LoadEmergencyContactListSuccess(response));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function CreateNewEmergencyContact(data) {
  return function (dispatch) {
    return EmergencyContactApiCall.AddEmergencyContact(data)
      .then((response) => {
        data.id = response.id;
        dispatch(CreateEmergencyContactSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function UpdateEmergencyContact(data) {
  return function (dispatch) {
    return EmergencyContactApiCall.EditEmergencyContact(data)
      .then((response) => {
        dispatch(UpdateEmergencyContactSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function DeletEmergencyContactList(data) {
  return function (dispatch) {
    return EmergencyContactApiCall.DeleteEmergencyContact(data)
      .then((response) => {
        dispatch(DeleteEmergencyContactSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
