import {
  LOAD_EMERGENCY_CONTACT_SUCCESS,
  DELETE_EMERGENCY_CONTACT_SUCCESS,
  CREATE_EMERGENCY_CONTACT_SUCCESS,
  UPDATE_EMERGENCY_CONTACT_SUCCESS,
} from "../utilits";
//Reducers
//A function that takes 2 arguments and returns application current state and action from mapStateToProps updates redux store and merge them into props components
var intialState = [];

export default function loadEmergencyContactReducer(
  state = intialState,
  action
) {
  switch (action.type) {
    case LOAD_EMERGENCY_CONTACT_SUCCESS:
      if (intialState.length == 0) {
        return (intialState = action.loadEmergencyContacts);
      } else {
        return state;
      }
    case CREATE_EMERGENCY_CONTACT_SUCCESS:
      return [{ ...action.emergencyContactData }, ...state];
    case UPDATE_EMERGENCY_CONTACT_SUCCESS:
      return state.map((emergencyContactData) =>
        emergencyContactData.id === action.emergencyContactData.id
          ? action.emergencyContactData
          : emergencyContactData
      );
    case DELETE_EMERGENCY_CONTACT_SUCCESS:
      return state.filter(
        (emrgencyContact) => emrgencyContact.id !== action.emergencyContact
      );
    default:
      return state;
  }
}
