import Environment from "../shared/Constants";

export default class HealthCheckService {
  constructor() {
    this.baseURL = Environment.baseURL;
    this.authURL = Environment.authURL;
    this.questionaireURL = Environment.quentionaireURL;
    this.fetch = this.fetch.bind(this);
  }

  getUserHealthChecks(getData) {
    let RespondentIds = "";

    RespondentIds = getData.userId.map(function (el, idx) {
      return "RespondentIds=" + el.id;
    }).join("&");

    return this.fetch(
      `${this.questionaireURL}/Response/GetAllUsersResponse?${RespondentIds}&FromDate=${getData.fromDate}&ToDate=${getData.toDate}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  getAllResponsesbyId(id) {
    return this.fetch(
      `${this.questionaireURL}/Survey/GetAllAnswers?ResponseId=${id}`,
      {
        method: "GET",
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
        alert("You have been signed out because either your last session expired or you are currently signed in on another device.");
        localStorage.removeItem("id_token");
        localStorage.removeItem("id_tokenExpiry");
        window.location.href = "/";
      } else if (response.status === 502) {
        window.location.href = "/ServerError";
      } else {
        response
          .json()
          .then((data) => func({ status: response.status, data: data }));
      }
    });
  }
}
