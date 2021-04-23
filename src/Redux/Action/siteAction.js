import {
  LOAD_LIST_SITE_SUCCESS,
  CREATE_SITE_SUCCESS,
  UPDATE_SITE_SUCCESS,
  DELETE_SITE_SUCCESS,
  DELETE_SITE_FLOOR_SUCCESS,
  UPDATE_SITE_FLOOR_SUCCESS,
  LOAD__SITE_SECURITY_SUCCESS,
} from "../utilits";

import SiteApiServices from "../../services/siteService";

const SiteStateApi = new SiteApiServices();

export function LoadSiteSuccess(loadUserSite) {
  return { type: LOAD_LIST_SITE_SUCCESS, loadUserSite };
}

export function LoadbySiteorSecurityManagerSuccess(loadUserSiteSecurity) {
  return { type: LOAD__SITE_SECURITY_SUCCESS, loadUserSiteSecurity };
}

export function CreateSiteSuccess(userSite) {
  return { type: CREATE_SITE_SUCCESS, userSite };
}

export function UpdateSiteSuccess(userSite) {
  return { type: UPDATE_SITE_SUCCESS, userSite };
}

export function UpdateSiteFloorSuccess(userSite) {
  return { type: UPDATE_SITE_FLOOR_SUCCESS, userSite };
}

export function DeleteSiteSuccess(userSite) {
  return { type: DELETE_SITE_SUCCESS, userSite };
}

export function DeleteSiteFloorSuccess(userSite) {
  return { type: DELETE_SITE_FLOOR_SUCCESS, userSite };
}

export function loadSite() {
  return function (dispatch) {
    return SiteStateApi.getListSite()
      .then((data) => {
        dispatch(LoadSiteSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function loadSitesbySiteorSecurityManager(data) {
  return function (dispatch) {
    return SiteStateApi.getAllSitesbySiteorSecurityManager(data)
      .then((data) => {
        dispatch(LoadbySiteorSecurityManagerSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function createSite(data) {
  return function (dispatch) {
    return SiteStateApi.AddSite(data)
      .then((response) => {
        data.id = response.id;
        dispatch(CreateSiteSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function updateSite(data) {
  return function (dispatch) {
    return SiteStateApi.UpdateSite(data)
      .then((response) => {
        dispatch(UpdateSiteSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function updateSiteFloor(data) {
  return function (dispatch) {
    return SiteStateApi.UpdateSiteFloor(data)
      .then((response) => {
        dispatch(UpdateSiteFloorSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function deleteSite(data) {
  return function (dispatch) {
    return SiteStateApi.DeleteSite(data)
      .then((response) => {
        dispatch(DeleteSiteSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function deleteSiteFloor(data) {
  return function (dispatch) {
    return SiteStateApi.DeleteSiteFloor(data)
      .then((response) => {
        dispatch(DeleteSiteFloorSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
