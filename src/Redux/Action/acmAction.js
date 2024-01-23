import { LOAD_ACM_SUCCESS, GET_ACM_SUCCESS } from "../utilits";
import ACMService from "../../services/acmService";
//constructor
const acmApiCall = new ACMService();
//To change the state invokes action creators return an action object  known as state from mapDispatchToProps help you to fire an action
export function LoadACMSuccess(loadACM) {
  return { type: LOAD_ACM_SUCCESS, loadACM };
}

export function GetACMSuccess(data) {
  return { type: GET_ACM_SUCCESS, data };
}

export function loadACM() {
  return function (dispatch) {
    return acmApiCall
      .getACMDetails()
      .then((acmData) => {
        console.log(acmData);
        dispatch(LoadACMSuccess(acmData));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function getACM() {
  return function (dispatch) {
    return dispatch(GetACMSuccess(null));
  };
}
