import {
  LOAD_GLOBAL_SETTING_SUCCESS,
  CREATE_GLOBAL_SETTING_SUCCESS,
  UPDATE_TEMPERATURE_RANGE,
  LOAD_GLOBAL_SETTING_WITHOUT_API_SUCCESS,
} from "../utilits";
//Reducers
//A function that takes 2 arguments and returns application current state and action from mapStateToProps updates redux store and merge them into props components
export default function loadGlobalSettingReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_GLOBAL_SETTING_SUCCESS:
      return action.loadGlobalSettingsData;
    case CREATE_GLOBAL_SETTING_SUCCESS:
      return action.loadGlobalSettingsData;
    case LOAD_GLOBAL_SETTING_WITHOUT_API_SUCCESS:
      return state;
    default:
      return state;
  }
}
