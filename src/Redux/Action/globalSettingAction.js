import {
  LOAD_GLOBAL_SETTING_SUCCESS,
  CREATE_GLOBAL_SETTING_SUCCESS,
} from "../utilits";

import GlobalSettingApiServices from "../../services/globalSettingService";

const GlobalSettingApi = new GlobalSettingApiServices();

export function LoadGlobalSettingSuccess(loadGlobalSettingsData) {
  return { type: LOAD_GLOBAL_SETTING_SUCCESS, loadGlobalSettingsData };
}

export function CreateGlobalSettingSuccess(loadGlobalSettingsData) {
  return { type: CREATE_GLOBAL_SETTING_SUCCESS, loadGlobalSettingsData };
}

export function loadGlobalSetting() {
  return function (dispatch) {
    return GlobalSettingApi.getLoadGlobalSetting()
      .then((data) => {
        dispatch(LoadGlobalSettingSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function createGlobalSetting(data) {
  return function (dispatch) {
    return GlobalSettingApi.AddGlobalSetting(data)
      .then((response) => {
        data.id = response.id;
        dispatch(CreateGlobalSettingSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
