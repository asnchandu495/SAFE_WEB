import Environment from "../shared/Constants";

export default class EmergencyContactService {
  constructor() {
    this.baseURL = Environment.baseURL;
    this.authURL = Environment.authURL;
    this.fetch = this.fetch.bind(this);
  }

  ViewAllEmergencyContacts(getLanguages) {
    let languages = "";
    let callURL = '';
    if (getLanguages.length > 0) {
      languages = getLanguages.map(function (el, idx) {
        return "Language=" + el.id;
      }).join("&");
      callURL = `EmergencyContact/ViewAllEmergencyContact?${languages}`;
    } else {
      callURL = 'EmergencyContact/ViewAllEmergencyContact';
    }

    return this.fetch(
      `${this.baseURL}/${callURL}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  DeleteEmergencyContact(getData) {
    return this.fetch(
      `${this.baseURL}/EmergencyContact/DeleteEmergencyContact/` + getData,
      {
        method: "DELETE",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  AddEmergencyContact(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/EmergencyContact/AddEmergencyContact`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  AssignEmergencyContactToUserGroup(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.baseURL}/EmergencyContact/AssignEmergencyContactUserGroup`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateAssignEmergencyContactToUserGroup(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.baseURL}/EmergencyContact/UpdateEmergencyContactUserGroup`,
      {
        method: "PUT",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  ListAssignEmergencyContactToUserGroup(getData) {
    return this.fetch(
      `${this.baseURL}/EmergencyContact/ListAllEmergencyContactUserGroups`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  CancelAssignEmergencyContactToUserGroup(getData) {
    var data = {
      emergencyContactId: getData[1],
      userGroupId: getData[2],
    };
    var finalData = JSON.stringify(data);
    return this.fetch(
      `${this.baseURL}/EmergencyContact/RemoveEmergencyContactUserGroup`,
      {
        method: "DELETE",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  EditEmergencyContact(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/EmergencyContact/EditEmergencyContact`, {
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
        alert("Session expired. Please login to continue");
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
