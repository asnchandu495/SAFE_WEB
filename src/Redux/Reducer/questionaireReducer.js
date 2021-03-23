import { LOAD_ALL_QUESTIONAIRE,CREATE_QUESTIONAIRE_SUCCESS,DELETE_QUESTIONAIRE_SUCCESS,UPDATE_QUESTIONAIRE_SUCCESS, } from "../utilits";

var initialState=[];
export default function loadQuestionaireReducer(state=initialState,action){
    switch(action.type){
        case LOAD_ALL_QUESTIONAIRE:
        return action.loadquestionaire;
        case CREATE_QUESTIONAIRE_SUCCESS:
        return [{ ...action.createQuestionaireData }, ...state];
        case UPDATE_QUESTIONAIRE_SUCCESS:
        return state.map((updateQuestionaireData) =>
        updateQuestionaireData.id === action.updateQuestionaireData.id
          ? action.updateQuestionaireData
          : updateQuestionaireData
      );
        case DELETE_QUESTIONAIRE_SUCCESS:
            return state.filter(
              (deleteQuestionaireData) => deleteQuestionaireData.id !== action.deleteQuestionaireData
            );
        default:
            return state;
    }

}
