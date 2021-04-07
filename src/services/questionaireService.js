import Environment from "../shared/Constants";

export default class questionaireService {
  constructor() {
    this.baseURL = Environment.baseURL;
    this.authURL = Environment.authURL;
    this.questionaireURL = Environment.quentionaireURL;
    this.fetch = this.fetch.bind(this);
  }

  AddQuestionarie(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.questionaireURL}/Survey/AddSurvey`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  AssignQuestionnaireToUserGroup(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/AssignQuestionnaire/AssignQuestionnaireToUserGroup`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetAllQuestionarie() {
    return this.fetch(`${this.questionaireURL}/Survey/GetAllSurvey`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetALLTypes() {
    return this.fetch(`${this.questionaireURL}/Survey/GetAllTypes`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  ListAllAssignedQuestionnaires() {
    return this.fetch(
      `${this.questionaireURL}/AssignQuestionnaire/ListAllAssignedQuestionnaires`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  deleteQuestionaire(data) {
    return this.fetch(`${this.questionaireURL}/Survey/DeleteSurvey/${data}`, {
      method: "DELETE",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getAllExpressions() {
    return this.fetch(`${this.questionaireURL}/Survey/GetAllExpression`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  DeleteBooleanQuestion(data) {
    return this.fetch(
      `${this.questionaireURL}/BooleanQuestion/DeleteBooleanQuestion/${data}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  DeleteFreeTextQuestion(data) {
    return this.fetch(
      `${this.questionaireURL}/FreeTextQuestion/DeleteFreeTextQuestion/${data}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  DeleteTimeQuestion(data) {
    return this.fetch(
      `${this.questionaireURL}/QuestionTime/DeleteTimeQuestion/${data}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  DeleteDateQuestion(data) {
    return this.fetch(
      `${this.questionaireURL}/QuestionDate/DeleteDateQuestion/${data}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  DeleteNumericQuestion(data) {
    return this.fetch(
      `${this.questionaireURL}/NumericQuestion/DeleteNumericQuestion/${data}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  DeleteSinglechoiceQuestion(data) {
    return this.fetch(
      `${this.questionaireURL}/SingleChoiceQuestion/DeleteSingleChoiceQuestion/${data}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  DeleteMultichoiceQuestion(data) {
    return this.fetch(
      `${this.questionaireURL}/MultipleChoiceQuestion/DeleteMultiChoiceQuestion/${data}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  RemoveQuestionnaireFromUserGroup(data) {
    return this.fetch(
      `${this.questionaireURL}/RemoveQuestionnaire/RemoveQuestionnaireFromUserGroup/${data}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }
  updateQuestionaire(data) {
    var finalData = JSON.stringify(data);
    return this.fetch(`${this.questionaireURL}/Survey/UpdateSurvey`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  ChangeQuestionnaireStatus(data) {
    var finalData = JSON.stringify(data);
    return this.fetch(
      `${this.questionaireURL}/AssignQuestionnaire/ChangeQuestionnaireStatus`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  getSurveyById(id) {
    return this.fetch(`${this.questionaireURL}/Survey/GetSurveyById/${id}`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetBooleanQuestionById(id) {
    return this.fetch(
      `${this.questionaireURL}/BooleanQuestion/GetBooleanQuestionById/${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetFreeTextQuestion(id) {
    return this.fetch(
      `${this.questionaireURL}/FreeTextQuestion/GetFreeTextQuestion/${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetDateTimeById(id) {
    return this.fetch(
      `${this.questionaireURL}/QuestionDate/GetDateTimeById/${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetTimeQuestionById(id) {
    return this.fetch(
      `${this.questionaireURL}/QuestionTime/GetTimeQuestionById/${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetNumeicQuestionById(id) {
    return this.fetch(
      `${this.questionaireURL}/NumericQuestion/GetNumeicQuestionById/${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetMultipleChoicQuestionById(id) {
    return this.fetch(
      `${this.questionaireURL}/MultipleChoiceQuestion/GetMultipleChoicQuestionById/${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateFreeTextQuestion(data) {
    var finalData = JSON.stringify(data);
    return this.fetch(
      `${this.questionaireURL}/FreeTextQuestion/UpdateFreeTextQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetAllQuestionsBySurveyId(id) {
    return this.fetch(
      `${this.questionaireURL}/Survey/GetAllQuestionsBySurveyId?SurveyId=${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetEvaluationId(id) {
    return this.fetch(
      `${this.questionaireURL}/Evaluation/GetEvaluation/${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  AddBoolenQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/BooleanQuestion/AddBooleanQuestion`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  AddFreeTextQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/FreeTextQuestion/AddFreeTextQuestion`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  AddDateQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.questionaireURL}/QuestionDate/AddDateQuestion`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  AddEvaluationResultForQuestionnaire(data) {
    var finalData = JSON.stringify(data);
    return this.fetch(
      `${this.questionaireURL}/Evaluation/AddEvaluationResultForQuestionnaire`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  updateEvaluationResultForQuestionnaire(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/Evaluation/UpdateEvaluationResultForQuestionnaire`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  AddTimeQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.questionaireURL}/QuestionTime/AddTimeQuestion`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateTimeQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/QuestionTime/UpdateTimeQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  AddNumericQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/NumericQuestion/AddNumericQuestion`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateFreeTextQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/FreeTextQuestion/UpdateFreeTextQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  AddSingleChoiceQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/SingleChoiceQuestion/AddSingleChoiceQuestion`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  AddMultiChoiceQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/MultipleChoiceQuestion/AddMultipleChoiceQuestion`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateMultiChoiceQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/MultipleChoiceQuestion/UpdateMultipleChoiceQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetSingleChoiceQuestion(id) {
    return this.fetch(
      `${this.questionaireURL}/SingleChoiceQuestion/GetSingleChoiceQuestion/${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateBoolenQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/BooleanQuestion/UpdateBooleanQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateDateQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/QuestionDate/UpdateDateQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateTimeQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/QuestionTime/UpdateTimeQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateNumericQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/NumericQuestion/UpdateNumericQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateSingleChoiceQuestion(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/SingleChoiceQuestion/UpdateSingleChoiceQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateSingleChoiceFlags(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/SingleChoiceQuestion/AddPositiveConformityForSingleChoiceQuestion`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateMultiChoiceFlags(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/MultipleChoiceQuestion/AddPositiveConformityForMultipleChoice`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  addBooleanConditionalJump(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/BooleanQuestion/CreateBooleanConditionalQuestion`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  addNumericConditionalJump(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/NumericQuestion/AddConditionalNumericQuestion`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  addDateConditionalJump(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/QuestionDate/AddConditionalDateQuestion`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  addTimeConditionalJump(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/QuestionTime/AddConditionalTimeQuestion`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  addSingleChoiceConditionalJump(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/SingleChoiceQuestion/AddConditionalSingleChoiceQuestion`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  addMultiChoiceConditionalJump(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/MultipleChoiceQuestion/AddConditionalMultipleChoiceQuestion`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  getAllOrderofExecution(id) {
    return this.fetch(
      `${this.questionaireURL}/OrderOfExecution/GetAllOrderOfExecution?SurveyId=${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  ChangeQuestionOrder(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/OrderOfExecution/AddOrderOfExecution`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  ChangeQuestionOrderUpdate(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/OrderOfExecution/EditOrderOfExecution`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetBooleanConditionQuestionById(id) {
    return this.fetch(
      `${this.questionaireURL}/BooleanQuestion/GetBooleanConditionalQuestion/${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  updateBooleanConditionalJump(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/BooleanQuestion/UpdateBooleanConditionalQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetDateTimeBooleanById(id) {
    return this.fetch(
      `${this.questionaireURL}/QuestionDate/GetConditionalDateQuestion/${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  updateDateConditionalJump(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/QuestionDate/UpdateConditionalDateQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetTimeQuestionBooleanById(id) {
    return this.fetch(
      `${this.questionaireURL}/QuestionTime/GetConditionalTimeQuestion/${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  updateTimeConditionalJump(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/QuestionTime/UpdateConditionalTimeQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetNumeicQuestionBoooleanById(id) {
    return this.fetch(
      `${this.questionaireURL}/NumericQuestion/GetNumericConditionalQuestion/${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  updateNumericConditionalJump(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/NumericQuestion/UpdateConditionalNumericQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetSingleChoiceBooleanQuestion(id) {
    return this.fetch(
      `${this.questionaireURL}/SingleChoiceQuestion/GetSingleChoiceConditionalQuestion/${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  updateSingleChoiceConditionalJump(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/SingleChoiceQuestion/UpdateSingleChoiceConditionalQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetMultipleChoicQuestionBooleanById(id) {
    return this.fetch(
      `${this.questionaireURL}/MultipleChoiceQuestion/GetConditionalMultipleChoiceQuestion/${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  updateMultiChoiceConditionalJump(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.questionaireURL}/MultipleChoiceQuestion/UpdateConditionalMultiChoiceQuestion`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }

  fetch(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {};

    headers["Authorization"] = "Bearer " + this.getToken();
    headers["Accept"] = "application/json";
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Content-Type"] = "application/json";

    return fetch(url, {
      headers,
      crossDomain: true,
      ...options,
    })
      .then(this.processResponse)
      .then((response) => {
        return response.data;
      })
      .catch((response) => {
        if (response.status === 400) {
          throw response;
        } else if (response.status === 403) {
          throw response;
        }
      });
  }

  processResponse(response) {
    return new Promise((resolve, reject) => {
      // will resolve or reject depending on status, will pass both "status" and "data" in either case
      let func;
      response.status < 400 ? (func = resolve) : (func = reject);
      if (response.status === 204) {
        response.then((data) =>
          func({ status: response.status, data: { status: "success" } })
        );
      } else if (response.status === 500) {
        window.location.href = "/InternalServerError";
      } else if (response.status === 401) {
        window.location.href = "/Unauthorized";
      } else if (response.status === 502) {
        window.location.href = "/ServerError";
      } else {
        response
          .json()
          .then((data) => func({ status: response.status, data: data }));
      }
    });
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw response;
    }
  }
}
