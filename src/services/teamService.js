import Environment from "../shared/Constants";

export default class TeamService {
  constructor() {
    this.baseURL = Environment.baseURL;
    this.authURL = Environment.authURL;
    this.fetch = this.fetch.bind(this);
  }

  getTeamManager() {
    return this.fetch(`${this.baseURL}/Team/GetManager`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  createTeams(data) {
    var finalData = JSON.stringify(data);
    return this.fetch(`${this.baseURL}/Team/CreateTeam`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  updateTeams(data) {
    var finalData = JSON.stringify(data);
    return this.fetch(`${this.baseURL}/Team/UpdateTeam`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  deleteTeam(data) {
    return this.fetch(`${this.baseURL}/Team/DeleteTeam/${data}` , {
      method: "DELETE",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  assignUserGroups(data) {
    var finalData = JSON.stringify(data);
    return this.fetch(`${this.baseURL}/Group/AssignUserGroups`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  viewApplicationUserByTeamId(id) {
    return this.fetch(`${this.baseURL}/Team/ViewApplicationUserByTeamId?Id=${id}`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }
  getTeamList(){
    return this.fetch(`${this.baseURL}/Team/ListTeams`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  assignUserGroups(data) {
    var finalData = JSON.stringify(data);
    return this.fetch(`${this.baseURL}/Group/AssignUserGroups`, {
      method: "POST",
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
}
