import { LOAD_ALL_QUESTIONAIRE } from "../utilits";

var initialState=[];
export default function loadQuestionaireReducer(state=initialState,action){
    switch(action.type){
        case LOAD_ALL_QUESTIONAIRE:
        return action.loadquestionaire;
        default:
            return state;
    }

}
