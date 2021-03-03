import {
  LOAD_ASSIGN_EMERGENCY_CONTACT_SUCCESS,
  CREATE_ASSIGN_EMERGENCY_CONTACT_SUCCESS,
  UPDATE_ASSIGN_EMERGENCY_CONTACT_SUCCESS,
  DELETE_ASSIGN_EMERGENCY_CONTACT_SUCCESS,
} from "../utilits";

var intialState = [];

export default function loadAssignEmergencyContactReducer(
  state = intialState,
  action
) {
  switch (action.type) {
    case LOAD_ASSIGN_EMERGENCY_CONTACT_SUCCESS:
      if (intialState.length == 0) {
        return (intialState = action.loadAssignEmergencyContacts);
      } else {
        return state;
      }
    case CREATE_ASSIGN_EMERGENCY_CONTACT_SUCCESS:
      return [{ ...action.assignemergencyContactData }, ...state];
    case UPDATE_ASSIGN_EMERGENCY_CONTACT_SUCCESS:
      return state.map((emergencyContactData) =>
        emergencyContactData.id === action.assignemergencyContactData
          ? {
              ...emergencyContactData,
              isActive: action.status,
            }
          : emergencyContactData
      );
    case DELETE_ASSIGN_EMERGENCY_CONTACT_SUCCESS:
      return state.filter(
        (emrgencyContact) =>
          emrgencyContact.id !== action.assignemergencyContactData
      );
    default:
      return state;
  }
}
