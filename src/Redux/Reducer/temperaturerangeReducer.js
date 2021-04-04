import { UPDATE_TEMPERATURE_RANGE } from "../utilits";
export default function loadGlobalSettingReducer(state = {}, action) {
  switch (action.type) {
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
