import {
    LOAD_ACM_SUCCESS,
    GET_ACM_SUCCESS,
} from "../utilits";

export function LoadACMSuccess(loadACM) {
    return { type: LOAD_ACM_SUCCESS, loadACM };
}

export function GetACMSuccess(data) {
    return { type: GET_ACM_SUCCESS, data };
}

export function loadACM(acmData) {
    return function (dispatch) {
        return dispatch(LoadACMSuccess(acmData));
    };
}

export function getACM() {
    return function (dispatch) {
        return dispatch(GetACMSuccess(null));
    };
}
