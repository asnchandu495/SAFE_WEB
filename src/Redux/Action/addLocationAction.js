import {
  LOAD_LOCATION_SUCCESS,
  CREATE_LOCATION_SUCCESS,
  UPDATE_LOCATION_SUCCESS,
  DELETE_LOCATION_SUCCESS,
} from "../utilits";

import SiteApiServices from "../../services/siteService";

const SiteStateApi = new SiteApiServices();

export function LoadLocationSuccess(loadUserSite) {
  return { type: LOAD_LOCATION_SUCCESS, loadUserSite };
}

export function CreateLocationSuccess(userSite) {
  return { type: CREATE_LOCATION_SUCCESS, userSite };
}

export function UpdateLocationSuccess(userSite) {
  return { type: UPDATE_LOCATION_SUCCESS, userSite };
}

export function DeleteLocationSuccess(userSite) {
  return { type: DELETE_LOCATION_SUCCESS, userSite };
}

export function loadLocation(id) {
  return function (dispatch) {
    return SiteStateApi.getListLocation(id)
      .then((data) => {
        dispatch(LoadLocationSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function createLocation(data) {
  return function (dispatch) {
    var id = Math.random().toString();
    return SiteStateApi.CreateSitelocation(data)
      .then((response) => {
        data.id = id;
        dispatch(CreateLocationSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function updateLocation(data) {
  return function (dispatch) {
    return SiteStateApi.UpdateLocation(data)
      .then((response) => {
        dispatch(UpdateLocationSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function DeleteLocation(data) {
  return function (dispatch) {
    return SiteStateApi.DeleteLocation(data)
      .then((response) => {
        dispatch(DeleteLocationSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
