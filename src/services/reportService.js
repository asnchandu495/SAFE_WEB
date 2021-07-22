import Environment from "../shared/Constants";

export default class ReportService {
  constructor() {
    this.baseURL = Environment.baseURL;
    this.authURL = Environment.authURL;
    this.fetch = this.fetch.bind(this);
  }

  getSocialDistancingReport(getData) {
    return this.fetch(
      `${this.baseURL}/ApplicationUser/GetAllSocialDistancingBreaches?FromDate=${getData.startDate}&ToDate=${getData.endDate}${getData.userId.id != "all" ? '&UserId=' + getData.userId.userId : ''}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  getSocialDistancingIndoorReport(data) {
    let SiteIds = "";
    let LocationIds = "";
    let apiURL = '';
    SiteIds = "SiteId=" + data.SiteId;

    if (data.LocationId.length > 0) {
      LocationIds = data.LocationId.map(function (el, idx) {
        return "LocationId=" + el;
      }).join("&");
      apiURL = `ApplicationUser/GetAllInDoorSocialDistancingBreaches?${LocationIds}&${SiteIds}&StartDate=${data.startDate}&EndDate=${data.endDate}`;
    } else {
      LocationIds = "LocationId=[]";
      apiURL = `ApplicationUser/GetAllInDoorSocialDistancingBreaches?${SiteIds}&StartDate=${data.startDate}&EndDate=${data.endDate}`;
    }

    return this.fetch(
      `${this.baseURL}/${apiURL}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  getGeoFencingReport(getData) {
    return this.fetch(
      `${this.baseURL}/ApplicationUserGeoBreach/GetAllGeoBreach?FromDate=${getData.startDate}&ToDate=${getData.endDate}${getData.userId.id != "all" ? '&UserId=' + getData.userId.userId : ''}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  getContactTracingRlapReport(getData) {
    return this.fetch(
      `${this.baseURL}/Reports/ContactTrace/rlap?StartDate=${getData.startDate}&EndDate=${getData.endDate}&UserId=${getData.userId.userId}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  getContactTracingBleReport(getData) {
    return this.fetch(
      `${this.baseURL}/ApplicationUser/GetContactTracingInfoForBLE?StartDate=${getData.startDate}&EndDate=${getData.endDate}&UserBaseAccountId=${getData.userId.userId}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  getAccessBreachReport(data) {
    let SiteIds = "";
    let LocationIds = "";
    let apiURL = '';
    SiteIds = "SiteId=" + data.SiteId;

    if (data.LocationId.length > 0) {
      LocationIds = data.LocationId.map(function (el, idx) {
        return "LocationId=" + el;
      }).join("&");
      apiURL = `Reports/GetAllAccessBreaches?${LocationIds}&${SiteIds}&StartDate=${data.startDate}&EndDate=${data.endDate}`;
    } else {
      LocationIds = "LocationId=[]";
      apiURL = `Reports/GetAllAccessBreaches?${SiteIds}&StartDate=${data.startDate}&EndDate=${data.endDate}`;
    }
    return this.fetch(`${this.baseURL}/${apiURL}`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  getDensityThresholdReport(data) {
    let SiteIds = "";
    let LocationIds = "";
    let apiURL = '';
    SiteIds = "SiteId=" + data.SiteId;

    if (data.LocationId.length > 0) {
      LocationIds = data.LocationId.map(function (el, idx) {
        return "LocationId=" + el;
      }).join("&");
      apiURL = `ApplicationUser/GetAllDensityThresholdBreaches?${LocationIds}&${SiteIds}&StartDate=${data.startDate}&EndDate=${data.endDate}`;
    } else {
      LocationIds = "LocationId=[]";
      apiURL = `ApplicationUser/GetAllDensityThresholdBreaches?${SiteIds}&StartDate=${data.startDate}&EndDate=${data.endDate}`;
    }

    return this.fetch(`${this.baseURL}/${apiURL}`, {
      method: "GET",
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  notifyContactTracingBLE(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetch(
      `${this.baseURL}/ApplicationUser/AlertToContactList`,
      {
        method: "POST",
        body: finalData,
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  getOfficeStaffReport(data) {
    let SiteIds = "";
    let TeamIds = "";

    TeamIds = "Teams=" + data.Teams;
    SiteIds = "SiteId=" + data.site;

    let apiURL = `ApplicationUser/GetAllNumberOfStaffInTheOffice?${TeamIds}&${SiteIds}&FilterDate=${data.FilterDate}&Frequency=${parseInt(data.frequency)}`;

    return this.fetch(`${this.baseURL}/${apiURL}`, {
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
}
