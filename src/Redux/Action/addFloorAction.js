import {
  LOAD_FLOOR_SUCCESS,
  CREATE_FLOOR_SUCCESS,
  UPDATE_FLOOR_SUCCESS,
  DELETE_FLOOR_SUCCESS,
} from "../utilits";

import SiteApiServices from "../../services/siteService";

const SiteStateApi = new SiteApiServices();

export function LoadFloorSuccess(loadUserSite) {
  return { type: LOAD_FLOOR_SUCCESS, loadUserSite };
}

export function CreateFloorSuccess(userSite) {
  return { type: CREATE_FLOOR_SUCCESS, userSite };
}

export function UpdateFloorSuccess(userSite) {
  return { type: UPDATE_FLOOR_SUCCESS, userSite };
}

export function DeleteFloorSuccess(userSite) {
  return { type: DELETE_FLOOR_SUCCESS, userSite };
}

export function loadFloor(id) {
  return function (dispatch) {
    return SiteStateApi.getListFloor(id)
      .then((data) => {
        console.log(data);
        dispatch(LoadFloorSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function loadFloorWithEmptyData(i) {
  return function (dispatch) {
    var value = [];
    return SiteStateApi.UpdateFllorWithEmptyData().then((res) => {
      dispatch(LoadFloorSuccess(value));
    });
  };
}

export function createFloor(data) {
  var designationId = Math.random();
  return function (dispatch) {
    return SiteStateApi.AddFloor(data)
      .then((response) => {
        data.id = response.id;
        dispatch(CreateFloorSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function updateFloor(data) {
  return function (dispatch) {
    return SiteStateApi.UpdateFloor(data)
      .then((response) => {
        dispatch(UpdateFloorSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function DeleteFloor(data) {
  return function (dispatch) {
    return SiteStateApi.DeleteFloor(data)
      .then((response) => {
        dispatch(DeleteFloorSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
