import {
  LOADGRIDHISTORY_SUCCESS,
  UPDATEGRIDHISTORY_SUCCESS,
  GETGRIDHISTORY_SUCCESS,
} from "../utilits";
//Actions are javscript objects that maintain 2 properties type and payload.These actions are "dispatched" by redux store store dispatch api method
//constructor
//To change the state invokes action creators return an action object  known as action from mapDispatchToProps help you to fire an action

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
