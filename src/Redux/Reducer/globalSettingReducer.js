import {
  LOAD_GLOBAL_SETTING_SUCCESS,
  CREATE_GLOBAL_SETTING_SUCCESS,
  UPDATE_TEMPERATURE_RANGE,
  LOAD_GLOBAL_SETTING_WITHOUT_API_SUCCESS,
} from "../utilits";
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
