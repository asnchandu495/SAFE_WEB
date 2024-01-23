import {
  LOAD_GLOBAL_SETTING_SUCCESS,
  CREATE_GLOBAL_SETTING_SUCCESS,
  UPDATE_TEMPERATURE_RANGE,
  LOAD_GLOBAL_SETTING_WITHOUT_API_SUCCESS,
} from "../utilits";

import GlobalSettingApiServices from "../../services/globalSettingService";
//Actions are javscript objects that maintain 2 properties type and payload.These actions are "dispatched" by redux store store dispatch api method
//constructor
const GlobalSettingApi = new GlobalSettingApiServices();
//To change the state invokes action creators return an action object  known as action from mapDispatchToProps help you to fire an action
export function LoadGlobalSettingWithoutAPISuccess(data) {
  return { type: LOAD_GLOBAL_SETTING_WITHOUT_API_SUCCESS, data };
}

export function LoadGlobalSettingSuccess(loadGlobalSettingsData) {
  return { type: LOAD_GLOBAL_SETTING_SUCCESS, loadGlobalSettingsData };
}

export function CreateGlobalSettingSuccess(loadGlobalSettingsData) {
  return { type: CREATE_GLOBAL_SETTING_SUCCESS, loadGlobalSettingsData };
}

export function UpdateTemperatureRange(updateTemp) {
  return { type: UPDATE_TEMPERATURE_RANGE, updateTemp };
}

export function loadGlobalSetting() {
  return function (dispatch) {
    return GlobalSettingApi.getLoadGlobalSetting()
      .then((data) => {
        if (data) {
          dispatch(LoadGlobalSettingSuccess(data));
        } else {
          dispatch(LoadGlobalSettingSuccess({}));
        }
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function loadGlobalSettingWithoutAPICall() {
  return function (dispatch) {
    return dispatch(LoadGlobalSettingWithoutAPISuccess(null));
  };
}

export function createGlobalSetting(data) {
  return function (dispatch) {
    return GlobalSettingApi.AddGlobalSetting(data)
      .then((response) => {
        dispatch(CreateGlobalSettingSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function updateTemp(data) {
  return function (dispatch) {
    return GlobalSettingApi.UpdateCovidStateTemperature(data)
      .then((response) => {
        setTimeout(async function () {
          try {
            const data = await GlobalSettingApi.getLoadGlobalSetting();
            dispatch(LoadGlobalSettingSuccess(data));
          } catch (error) {
            throw error;
          }
        }, 5000);
      })
      .catch((error) => {
        throw error;
      });
  };
}
