import Environment from "../shared/Constants";

export default class AuthService {
  constructor() {
    this.baseURL = Environment.baseURL;
    this.authURL = Environment.authURL;
    this.fetch = this.fetch.bind(this);
    this.fetchWithoutToken = this.fetchWithoutToken.bind(this);
    this.login = this.login.bind(this);
    this.loginForChangingOrganization =
      this.loginForChangingOrganization.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  login(getData) {
    // Get a token
    const data = {
      client_id: "SsapAuth",
      grant_type: "password",
      username: getData.username,
      password: getData.password,
      scope: "openid profile ssapauth",
      client_secret: "Flex@123$",
    };

    return this.fetch(`${this.authURL}/connect/token`, {
      method: "POST",
      body:
        "grant_type=" +
        data.grant_type +
        "&username=" +
        getData.username +
        "&password=" +
        getData.password +
        "&client_id=" +
        data.client_id +
        "&scope=" +
        data.scope +
        "&client_secret=" +
        data.client_secret,
    }).then((res) => {
      this.setToken(res.access_token);
      this.setTokenExpiry(res.expires_in);
      return Promise.resolve(res);
    });
  }

  loginForChangingOrganization(username, password) {
    // Get a token
    const data = {
      client_id: "SsapAuth",
      grant_type: "password",
      username: username,
      password: password,
      scope: "openid profile authadminresourceapi flexgraph",
      client_secret: "Gr@ph123$",
    };

    return this.fetchForLoginWhileChangingOrganization(
      `${this.domain}/connect/token`,
      {
        method: "POST",
        body:
          "grant_type=" +
          data.grant_type +
          "&username=" +
          username +
          "&Password=" +
          password +
          "&client_id=" +
          data.client_id +
          "&scope=" +
          data.scope +
          "&client_secret=" +
          data.client_secret,
      }
    ).then((res) => {
      this.setToken(res.access_token);
      this.setTokenExpiry(res.expires_in);
      return Promise.resolve(res);
    });
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    const tokenExpiry = this.getTokenExpiry();
    return !!token && !this.isTokenExpired(tokenExpiry); // handwaiving here
  }

  LoggedInUserDetails() {
    return this.fetch(
      `${this.flexstudioURL}/ApplicationUser/GetLoggedInUserDetails`,
      {
        method: "GET",
      }
    ).then((res) => {
      return Promise.resolve(res);
    });
  }

  ForgotPassword(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetchWithoutToken(`${this.baseURL}/Login/ForgotPassword`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  VerifyOTP(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetchWithoutToken(`${this.baseURL}/Login/VerifyOTP`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  ResetPassword(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetchWithoutToken(`${this.baseURL}/Login/ResetPassword`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  ChangePassword(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetchWithoutToken(`${this.authURL}/AuthAPI/ChangePassword`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  checkLockout(getData) {
    var finalData = JSON.stringify(getData);
    return this.fetchWithoutToken(`${this.authURL}/AuthAPI/Lockout`, {
      method: "POST",
      body: finalData,
    }).then((res) => {
      return Promise.resolve(res);
    });
  }

  isTokenExpired(Expiry) {
    try {
      const tokenExpiry = Expiry;
      return false;
      //   if (tokenExpiry < Date.now() / 1000) {
      //     return true;
      //   } else return false;
    } catch (err) {
      return false;
    }
  }

  setToken(idToken) {
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);
    // localStorage.setItem("org_id", orgId);
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }

  setTokenExpiry(idTokenExpiry) {
    // Saves user token to localStorage
    localStorage.setItem("id_tokenExpiry", idTokenExpiry);
  }

  getTokenExpiry() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_tokenExpiry");
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
    localStorage.removeItem("id_tokenExpiry");
  }

  getProfile() {
    return this.getToken();
  }

  fetch(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {};

    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + this.getToken();
      headers["Accept"] = "application/json";
      headers["Access-Control-Allow-Origin"] = "*";
    } else {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      headers["Accept"] = "application/json";
      headers["Access-Control-Allow-Origin"] = "*";
    }

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
        } else if (response.status === 500) {
          window.location.href = "/InternalServerError";
        }
      });
  }

  fetchWithoutToken(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {};

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
        } else if (response.status === 500) {
          window.location.href = "/InternalServerError";
        }
      });
  }

  // processResponse(response) {
  //   return new Promise((resolve, reject) => {
  //     // will resolve or reject depending on status, will pass both "status" and "data" in either case
  //     let func;
  //     response.status < 400 ? (func = resolve) : (func = reject);
  //     response
  //       .json()
  //       .then(data => func({ status: response.status, data: data }));
  //   });
  // }

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
