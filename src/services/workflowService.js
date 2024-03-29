import Environment from "../shared/Constants";

export default class WorkflowService {
  constructor() {
    this.baseURL = Environment.baseURL;
    this.authURL = Environment.authURL;
    this.fetch = this.fetch.bind(this);
  }

  ListAllWorkflow(data) {
    let groupIds = "";
    let IsActives = "";

    if (data && data != "") {
      groupIds = "UserGroupId=" + data.UserGroupId;
    }

    if (data && data != "") {
      IsActives = "IsActive=" + data.IsActive;
    }

    let apiURL = "";

    if (groupIds != "" && IsActives != "") {
      apiURL = `WorkFlow/GetAllWorkFlow?${groupIds}&${IsActives}`;
    } else if (groupIds != "" && IsActives == "") {
      apiURL = `WorkFlow/GetAllWorkFlow?${groupIds}`;
    } else if (groupIds == "" && IsActives != "") {
      apiURL = `WorkFlow/GetAllWorkFlow?${IsActives}`;
    } else {
      apiURL = `WorkFlow/GetAllWorkFlow?`;
    }

    return this.fetch(`${this.baseURL}/${apiURL}`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  CreateWorkflow(data) {
    var finalData = JSON.stringify(data);
    return this.fetch(`${this.baseURL}/WorkFlow/AddWorkFlow`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetWorkFlowById(id) {
    return this.fetch(`${this.baseURL}/WorkFlow/GetWorkFlowById/${id}`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  updateWorkflow(data) {
    var finalData = JSON.stringify(data);
    return this.fetch(`${this.baseURL}/WorkFlow/UpdateWorkFlow`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  deleteWorkflow(data) {
    return this.fetch(`${this.baseURL}/WorkFlow/DeleteWorkFlow/${data}`, {
      method: "DELETE",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getWorkflowDetails(id) {
    return this.fetch(
      `${this.baseURL}/WorkFlow/GetActivitiesByWorkFlow?AIMWorkflowId=${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  getMasterActivities() {
    return this.fetch(`${this.baseURL}/WorkFlow/GetMasterActivities`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateActivities(data) {
    var finalData = JSON.stringify(data);
    return this.fetch(`${this.baseURL}/WorkFlow/UpdateActivities`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  PublishWorkflow(data) {
    var finalData = JSON.stringify(data);
    return this.fetch(`${this.baseURL}/WorkFlow/PublishWorkFlow`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  DeleteActivity(data) {
    return this.fetch(`${this.baseURL}/WorkFlow/DeleteActivity/${data}`, {
      method: "DELETE",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getAllMasterOptionsForActivity(id) {
    return this.fetch(
      `${this.baseURL}/WorkFlow/GetAllMasterOptionsForActivity?UniqueActivityId=${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  addOptions(data) {
    var finalData = JSON.stringify(data);
    return this.fetch(`${this.baseURL}/WorkFlow/AddOptions`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getOptionsByActivityId(id) {
    return this.fetch(
      `${this.baseURL}/WorkFlow/GetAllOptionsByActivityId?ParentActivityId=${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  updateOptions(data) {
    var finalData = JSON.stringify(data);
    return this.fetch(`${this.baseURL}/WorkFlow/UpdateOptions`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getWorkflowActivities(id) {
    return this.fetch(
      `${this.baseURL}/WorkFlow/GetAllWorkFlows?WorkFlowId=${id}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  DeleteOption(data) {
    return this.fetch(`${this.baseURL}/WorkFlow/DeleteOption/${data}`, {
      method: "DELETE",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  GetActivityById(id) {
    return this.fetch(`${this.baseURL}/WorkFlow/GetActivityById/${id}`, {
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
