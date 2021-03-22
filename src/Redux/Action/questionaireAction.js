import { LOAD_ALL_QUESTIONAIRE,CREATE_QUESTIONAIRE_SUCCESS, } from  "../utilits";
import questionaireService from "../../services/questionaireService";
const questionaireApi = new questionaireService();

export function LoaddAllQuestionaire(loadquestions){
    return { 
        type:LOAD_ALL_QUESTIONAIRE,
        loadquestions
     };
}


export function CreateQuestionaireSuccess(createQuestionaireData) {
    return { type: CREATE_QUESTIONAIRE_SUCCESS, createQuestionaireData };
  }

export function loadquestions(){
 return function (dispatch){
     return questionaireApi.GetAllQuestionarie()
     .then((data)=>{
        dispatch(LoaddAllQuestionaire(data));
     })
     .catch((error)=>{
         throw error;
     });
 };
}




export function createQuestionarieData(data) {
    return function (dispatch) {
      return questionaireApi.AddQuestionarie(data)
        .then((response) => {
          data.id = response.id;
          dispatch(CreateQuestionaireSuccess(data));
        })
        .catch((error) => {
          throw error;
        });
    };
  }
  
  

