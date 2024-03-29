import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CardContent from "@material-ui/core/CardContent";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Link as LinkTo } from "react-router-dom";
import AuthService from "../../../services/authService";
import ToasterMessageComponent from "../../common/toaster";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as GridAction from "../../../Redux/Action/gridAction";
import * as AcmAction from "../../../Redux/Action/acmAction";
import NotificationService from "../../../services/notificationService";
import GlobalSettingApiServices from "../../../services/globalSettingService";

const GreenCheckbox = withStyles({
  root: {
    color: "#B7B7B7",
    "&$checked": {
      color: "#fff",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

function Signin(props) {
  const authApiCall = new AuthService();
  const notificationApiCall = new NotificationService();
  const GlobalSettingApi = new GlobalSettingApiServices();
  const [formData, SetformData] = useState({
    username: "",
    password: "",
  });
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState("");
  const [toasterServerity, settoasterServerity] = useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [applicationUsers, setApplicationUsers] = useState([]);
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [gridPages, setGridPages] = useState([
    { name: "users", page: 1 },
    { name: "sites", page: 1 },
    { name: "designations", page: 1 },
    { name: "covidStates", page: 1 },
    { name: "faqs", page: 1 },
    { name: "userGroups", page: 1 },
    { name: "emergencyContacts", page: 1 },
    { name: "teams", page: 1 },
    { name: "questionnaire", page: 1 },
    { name: "workflows", page: 1 },
  ]);
  const [acm, setAcm] = useState([]);
  const [durationLock, setDurationLock] = useState();

  useEffect(() => {
    setComponentLoadder(true);
    Promise.all([
      notificationApiCall.GetAllUserCommunicationsForLoggedInUser(),
      GlobalSettingApi.getLoadGlobalSetting(),
    ])

      .then(([loggedinUserDetails, getLockDuration]) => {
        setApplicationUsers(loggedinUserDetails);
        setDurationLock(getLockDuration.durationToLockUserAccount);
        setComponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  /**
   * Handle change
   * Binding data with the form fields also calls the check unique function
   * @param  {} e-target element
   */
  function handleChange(e) {
    const { name, value } = e.target;
    SetformData((logInForm) => ({
      ...logInForm,
      [name]: value,
    }));
  }

  /**
  Method on click of submit to call the api and 
  limit the number of wrong attempts  if valid redirect to
  home page
   */
  function handleSubmit() {
    setshowLoadder(true);
    let loginData = formData;
    let lockOutData = { emailId: loginData.username };
    authApiCall
      .checkLockout(lockOutData)
      .then((res) => {
        if (res) {
          setToasterMessage(
            `Your account is locked due to failed attempts. Please try after ${durationLock} mins.`
          );
          settoasterServerity("error");
          settoasterErrorMessageType("object");
          setStateSnackbar(true);
          setshowLoadder(false);
        } else {
          authApiCall
            .login(loginData)
            .then((response) => {
              let authLoginData = { isLoggedOut: false, tokenType: "web" };
              authApiCall
                .UpdateConcurrentLoginForAuth(authLoginData)
                .then((response) => {
                  props.loadGridsPages(gridPages);
                  props.loadACM();
                  setshowLoadder(false);
                  props.history.push("/home/dashboard");
                })
                .catch((err) => {});
            })
            .catch((err) => {
              // setToasterMessage(err.data.error);
              setToasterMessage("Invalid Username or Password");
              settoasterServerity("error");
              settoasterErrorMessageType("object");
              setStateSnackbar(true);
              setshowLoadder(false);
            });
        }
      })
      .catch((err) => {
        setToasterMessage(err.data.error);
        settoasterServerity("error");
        settoasterErrorMessageType("object");
        setStateSnackbar(true);
        setshowLoadder(false);
      });
  }

  return (
    <>
      <CardContent>
        <ValidatorForm className={`auth-form`} onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <label htmlFor="username" className="input-label">
                Email
              </label>
              <TextValidator
                variant="outlined"
                margin="normal"
                validators={["required", "isEmail", "matchRegexp:^.{0,50}$"]}
                errorMessages={[
                  "Please enter email id",
                  "Email id is not valid",
                  "Maximum 50 characters",
                ]}
                fullWidth
                id="username"
                placeholder="Enter your email"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={handleChange}
                value={formData.username}
                InputLabelProps={{ shrink: false }}
              />
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <TextValidator
                variant="outlined"
                margin="normal"
                validators={["required"]}
                errorMessages={["Please enter password"]}
                fullWidth
                name="password"
                placeholder="Enter your password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
                value={formData.password}
                InputLabelProps={{ shrink: false }}
              />
            </Grid>
            {/* <Grid item xs={12} className="checkbox-container">
              <FormControlLabel
                control={
                  <GreenCheckbox
                    name="checkedG"
                  />
                }
                label={
                  <span>
                    I agree to <LinkTo to="/"> Terms of use</LinkTo> &{" "}
                    <LinkTo to="/">Privacy policy</LinkTo>
                  </span>
                }
              />
            </Grid> */}
            <Grid item xs={12} className="button-container">
              <Button
                type="submit"
                className="global-submit-btn"
                disabled={showLoadder}
              >
                {showLoadder ? <ButtonLoadderComponent /> : "Sign In"}
              </Button>
            </Grid>
            <Grid item xs={12} className="quick-link-container">
              <LinkTo href="#" to="/ForgotPassword">
                Forgot password?
              </LinkTo>
            </Grid>
          </Grid>
        </ValidatorForm>
      </CardContent>
      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
    </>
  );
}
//Validates the data received from the props

Signin.propTypes = {
  loadGridsPages: PropTypes.func.isRequired,
  loadACM: PropTypes.func.isRequired,
};
//Update the redux store and merge with the props
function mapStateToProps(state, ownProps) {
  return {
    GridData: state.gridHistory,
    acmData: state.acmData,
  };
}
// Customizing the functions your component receives, and how they dispatch actions
const mapDispatchToProps = {
  loadGridsPages: GridAction.loadGridsPages,
  loadACM: AcmAction.loadACM,
};
//Connect the component with redux store
export default connect(mapStateToProps, mapDispatchToProps)(Signin);
