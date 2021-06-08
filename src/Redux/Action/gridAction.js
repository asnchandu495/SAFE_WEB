import { LOADGRIDHISTORY_SUCCESS, UPDATEGRIDHISTORY_SUCCESS } from "../utilits";

export function LoadGridHistorySuccess(loadGridHistory) {
  return { type: LOADGRIDHISTORY_SUCCESS, loadGridHistory };
}

export function UpdateGridHistorySuccess(gridHistory) {
  return { type: UPDATEGRIDHISTORY_SUCCESS, gridHistory };
}

export function loadFaq() {
  return function (dispatch) {
    let status = false;
    return faqApi
      .ListFAQs(status)
      .then((data) => {
        dispatch(LoadGridHistorySuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function deleteFaq(data) {
  return function (dispatch) {
    return faqApi
      .deleteSelectedFaq(data)
      .then((response) => {
        dispatch(UpdateGridHistorySuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
