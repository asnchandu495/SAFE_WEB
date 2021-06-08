import {
  LOADGRIDHISTORY_SUCCESS,
  UPDATEGRIDHISTORY_SUCCESS,
  GETGRIDHISTORY_SUCCESS,
} from "../utilits";

export function LoadGridHistorySuccess(loadGridHistory) {
  return { type: LOADGRIDHISTORY_SUCCESS, loadGridHistory };
}

export function UpdateGridHistorySuccess(gridHistory) {
  return { type: UPDATEGRIDHISTORY_SUCCESS, gridHistory };
}

export function GetGridHistorySuccess(data) {
  return { type: GETGRIDHISTORY_SUCCESS, data };
}

export function loadGridsPages(gridPages) {
  return function (dispatch) {
    return dispatch(LoadGridHistorySuccess(gridPages));
  };
}

export function getGridsPages() {
  return function (dispatch) {
    return dispatch(GetGridHistorySuccess(null));
  };
}

export function updateGridsPages(sendData) {
  return function (dispatch) {
    return dispatch(UpdateGridHistorySuccess(sendData));
  };
}
