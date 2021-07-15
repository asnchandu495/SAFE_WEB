import Environment from "../shared/Constants";

export default class MasterDataService {
  constructor() {
    this.baseURL = Environment.baseURL;
    this.authURL = Environment.authURL;
    this.fetch = this.fetch.bind(this);
  }

  getDesignations(id) {
    return this.fetch(`${this.baseURL}/Designation/GetDesignations`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getCountries(id) {
    return this.fetch(`${this.baseURL}/Master/GetCountries`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getTeams(id) {
    return this.fetch(`${this.baseURL}/Team/GetTeams`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getUserRoles(id) {
    return this.fetch(`${this.baseURL}/Master/GetUserRoles`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getUserPrimaryRoles() {
    return this.fetch(`${this.baseURL}/Master/GetUserRoles`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getSites(id) {
    return this.fetch(`${this.baseURL}/Master/GetSites`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getCOVIDStates() {
    return this.fetch(`${this.baseURL}/Master/GetCOVIDStates`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getAllSuperVisor() {
    return this.fetch(
      `${this.baseURL}/ApplicationUser/GetAllSupervisorsByRole`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  getAllLanguages() {
    return this.fetch(`${this.baseURL}/Language/GetAllLanguages`, {
      method: "GET",
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
