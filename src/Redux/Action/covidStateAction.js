import {
  LOAD_COVID_STATE_SUCCESS,
  CREATE_COVID_STATE_SUCCESS,
  UPDATE_COVID_STATE_SUCCESS,
  DELETE_COVID_STATE_SUCCESS,
} from "../utilits";

import CovidStateApiServices from "../../services/covidStateServices";
//Actions are javscript objects that maintain 2 properties type and payload.These actions are "dispatched" by redux store store dispatch api method
//constructor
const CovidStateApi = new CovidStateApiServices();
//To change the state invokes action creators return an action object  known as action from mapDispatchToProps help you to fire an action
export function LoadCovidStateSuccess(loadUserDesignation) {
  return { type: LOAD_COVID_STATE_SUCCESS, loadUserDesignation };
}

export function CreateCovidStateSuccess(userDesignation) {
  return { type: CREATE_COVID_STATE_SUCCESS, userDesignation };
}

export function UpdateCovidStateSuccess(userDesignation) {
  return { type: UPDATE_COVID_STATE_SUCCESS, userDesignation };
}

export function DeleteCovidStateSuccess(userDesignation) {
  return { type: DELETE_COVID_STATE_SUCCESS, userDesignation };
}

export function loadCovidState() {
  return function (dispatch) {
    return CovidStateApi.getListCovidState()
      .then((data) => {
        dispatch(LoadCovidStateSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function createCovidState(data) {
  var designationId = Math.random();
  data.id = designationId.toString();
  return function (dispatch) {
    return CovidStateApi.AddCovidState(data)
      .then((response) => {
        data.id = response.id;
        dispatch(CreateCovidStateSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function updateCovidState(data) {
  return function (dispatch) {
    return CovidStateApi.UpdateCovidState(data)
      .then((response) => {
        dispatch(UpdateCovidStateSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function deleteCovidState(data) {
  return function (dispatch) {
    return CovidStateApi.DeleteCovidState(data)
      .then((response) => {
        dispatch(DeleteCovidStateSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
