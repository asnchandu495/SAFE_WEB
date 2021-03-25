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

  deleteQuestionaire(data) {
    return this.fetch(`${this.questionaireURL}/Survey/DeleteSurvey/${data}`, {
      method: "DELETE",
    }).then((res) => {
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
