import {
  LOAD_GLOBAL_SETTING_SUCCESS,
  CREATE_GLOBAL_SETTING_SUCCESS,
  UPDATE_TEMPERATURE_RANGE,
} from "../utilits";
export default function loadGlobalSettingReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_GLOBAL_SETTING_SUCCESS:
      return action.loadGlobalSettingsData;
    case CREATE_GLOBAL_SETTING_SUCCESS:
      return action.loadGlobalSettingsData;
    case UPDATE_TEMPERATURE_RANGE:
      return state.map((UpdateQuestionaireData) =>
        UpdateQuestionaireData.id === action.updateTemp.id
          ? action.updateTemp
          : UpdateQuestionaireData
      );
    default:
      return state;
  }
}
