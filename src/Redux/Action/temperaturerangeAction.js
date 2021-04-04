import { UPDATE_TEMPERATURE_RANGE } from "../utilits";

import GlobalSettingApiServices from "../../services/globalSettingService";

const GlobalSettingApi = new GlobalSettingApiServices();

export function UpdateTemperatureRange(updateTemp) {
  return { type: UPDATE_TEMPERATURE_RANGE, updateTemp };
}

export function updateTemp(data) {
  return function (dispatch) {
    return GlobalSettingApi.UpdateCovidStateTemperature(data)
      .then((response) => {
        dispatch(UpdateTemperatureRange(data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
