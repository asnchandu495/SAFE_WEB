import {
    LOAD_ACM_SUCCESS,
    GET_ACM_SUCCESS,
} from "../utilits";

var intialState = [];

export default function loadACMReducer(state = intialState, action) {
    switch (action.type) {
        case LOAD_ACM_SUCCESS:
            return action.loadACM;
            break;
        case GET_ACM_SUCCESS:
            return state;
            break;
        default:
            return state;
    }
}
