import Environment from "../shared/Constants";

export default class UserService {
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

  ListApplicationUsers() {
    return this.fetch(`${this.baseURL}/ApplicationUser/ListApplicationUsers`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetApplicationUsersById(id) {
    return this.fetch(
      `${this.baseURL}/ApplicationUser/ViewApplicationUser/` + id,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  DeleteApplicationUser(getId) {
    return this.fetch(
      `${this.baseURL}/ApplicationUser/DeleteApplicationUser/${getId}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  AddApplicationUser(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/ApplicationUser/AddApplicationUser`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateApplicationUser(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/ApplicationUser/UpdateApplicationUser`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  /// Assign Users

  UpdateSitesToUser(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/ApplicationUser/AddUserToSite`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateApplicationUserRole(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.baseURL}/ApplicationUser/UpdateApplicationUserRole`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateApplicationUserTeam(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/ApplicationUser/AddUserToTeam`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateApplicationUserPrimaryGroup(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/ApplicationUser/AssignUserToGroups`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateApplicationUserSecondaryGroup(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/ApplicationUser/AssignUserToGroups`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  /////// End here
  getCovidStateInfo(userId) {
    return this.fetch(
      `${this.baseURL}/ApplicationUser/ViewCOVIDStatus/${userId}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateUserCovidState(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/ApplicationUser/UpdateUserCOVIDStatus`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateUserCovidTempearture(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/ApplicationUser/UpdateTemperature`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getShiftInfo(userId) {
    return this.fetch(
      `${this.baseURL}/ApplicationUser/ViewShiftStatus/${userId}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateUserShiftInfo(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/ApplicationUser/UpdateUserShiftInfo`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getProfileDetails() {
    return this.fetch(
      `${this.baseURL}/ApplicationUser/GetLoggedInUserDetails`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  updateApplicationDashboard(val = null) {
    return new Promise((resolve) => {
      resolve(val);
    });
  }

  bulkUserFileUpload(data) {
    return this.fetch(
      `${this.baseURL}/ApplicationUserBulkUpload/AddBulkUploadRequest`,
      {
        method: "POST",
        body: data,
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
