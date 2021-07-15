import Environment from "../shared/Constants";

export default class FaqService {
  constructor() {
    this.baseURL = Environment.baseURL;
    this.authURL = Environment.authURL;
    this.fetch = this.fetch.bind(this);
  }

  ListFAQs(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/FAQ/GetAllFaqs`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  CreateFAQ(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/FAQ/AddFaq`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateFaq(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/FAQ/UpdateFaq`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  deleteSelectedFaq(data) {
    return this.fetch(`${this.baseURL}/FAQ/DeleteFaq/` + data, {
      method: "DELETE",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  deleteSelectedPublishFaq(data) {
    return this.fetch(`${this.baseURL}/FAQ/DeleteFaq/` + data, {
      method: "DELETE",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  AddSectionToFaq(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/FAQ/AddSectionToFaq`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateSectionToFaq(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/FAQ/UpdateFaqSection`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getFaqById(getId) {
    return this.fetch(`${this.baseURL}/FAQ/GetFaqById/${getId}`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getFaqUserGroups(getId) {
    return this.fetch(`${this.baseURL}/FAQ/GetAllFaqUserGroups`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  AssignFAQToForm(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/FAQ/AddFaqToUserGroup`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  DisassociateFaq(data) {
    return this.fetch(`${this.baseURL}/FAQ/RemoveFaqFromUserGroup/` + data, {
      method: "DELETE",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  ChangeFqaGroupStatus(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/FAQ/UpdateStatusForFaq`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  PublishFAQ(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/FAQ/PublishFAQ`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
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

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw response;
    }
  }
}
