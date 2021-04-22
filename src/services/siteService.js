import Environment from "../shared/Constants";

export default class SiteService {
  constructor() {
    this.baseURL = Environment.baseURL;
    this.authURL = Environment.authURL;
    this.fetch = this.fetch.bind(this);
  }

  getListSite(id) {
    return this.fetch(`${this.baseURL}/Master/GetSites`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }
  getAllSitesbySiteorSecurityManager(id) {
    return this.fetch(
      `${this.baseURL}/Site/GetAllSitesbySiteorSecurityManager`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  getSiteById(id) {
    return this.fetch(`${this.baseURL}/Site/GetSiteById/` + id, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  DeleteSite(getId) {
    return this.fetch(`${this.baseURL}/Site/DeleteSite/${getId}`, {
      method: "DELETE",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  AddSite(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/Site/AddSite`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateSite(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/Site/UpdateSiteBasicInfo`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  // Api Call For Floor

  getListFloor(id) {
    return this.fetch(
      `${this.baseURL}/Site/GetAllFloorsBySiteId?SiteId=` + id,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateFllorWithEmptyData(val) {
    return new Promise((resolve) => {
      resolve(val);
    });
  }

  DeleteFloor(getId) {
    return this.fetch(`${this.baseURL}/Site/DeleteFloor/${getId}`, {
      method: "DELETE",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  AddFloor(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/Site/AddFloorsToSite`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateFloor(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/Site/UpdateFloor?`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateSiteFloor(val) {
    return new Promise((resolve) => {
      resolve(val);
    });
  }

  DeleteSiteFloor(val) {
    return new Promise((resolve) => {
      resolve(val);
    });
  }

  // Api call for Loaction

  getListLocation(id) {
    return this.fetch(
      `${this.baseURL}/Site/GetAllLocationsBySiteId?SiteId=` + id,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  // DeleteLocaton(getId) {
  //   return this.fetch(`${this.baseURL}/Site/GetAllLocationsBySiteId/${getId}`, {
  //     method: "DELETE",
  //   }).then((res) => {
  //     return Promise.resolve(res);
  //   });
  // }

  CreateSitelocation(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/Site/AddLocationToSite`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  DeleteLocation(getId) {
    return this.fetch(`${this.baseURL}/Site/DeleteLocation/${getId}`, {
      method: "DELETE",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  UpdateLocation(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(`${this.baseURL}/Site/UpdateLocation`, {
      method: "PUT",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getSiteManagers(id) {
    return this.fetch(`${this.baseURL}/Site/SiteManager`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getLocationManagers(id) {
    return this.fetch(`${this.baseURL}/Site/SecurityManager`, {
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
