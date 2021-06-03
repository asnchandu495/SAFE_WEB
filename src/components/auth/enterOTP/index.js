import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { Link as LinkTo } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import ToasterMessageComponent from "../../common/toaster";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import AuthService from "../../../services/authService";

export default function EnterOtp(props) {
  const authApiCall = new AuthService();

  const [formData, SetformData] = useState({
    otp: "",
  });
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [toasterServerity, settoasterServerity] = useState("");
  const [showLoadder, setshowLoadder] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    SetformData((forgotPasswordForm) => ({
      ...forgotPasswordForm,
      [name]: value,
    }));
  }

  function handleSubmit() {
    setshowLoadder(true);
    var data = formData;
    data.otp = parseInt(data.otp);
    authApiCall
      .VerifyOTP(data)
      .then((res) => {
        props.history.push("/reset-password/" + res.validId);
        setshowLoadder(false);
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
        setshowLoadder(false);
      });
  }

  function UserResendOTP() {
    var userEmailId = localStorage.getItem("UserEmailId");
    var data = { email: userEmailId };
    authApiCall
      .ForgotPassword(data)
      .then((res) => {
        setToasterMessage("An OTP sent to your email id.");
        settoasterServerity("success");
        setStateSnackbar(true);
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
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
                OTP
              </label>
              <TextValidator
                variant="outlined"
                margin="normal"
                validators={[
                  "required",
                  "matchRegexp:^[0-9]*$",
                  "minNumber:99999",
                ]}
                errorMessages={[
                  "Please enter otp",
                  "Only numbers",
                  "Minimum allowed is 6 digits",
                ]}
                fullWidth
                id="otp"
                placeholder="OTP"
                name="otp"
                autoComplete="otp"
                onChange={handleChange}
                value={formData.otp}
              />
            </Grid>
            <Grid item xs={12} className="button-container">
              <Button
                type="submit"
                className="global-submit-btn"
                disabled={showLoadder}
              >
                {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
              </Button>
            </Grid>
            <Grid item xs={12} className="quick-link-container">
              <Grid container>
                <Grid item xs className="grid-align-center">
                  <LinkTo href="#" to="/">
                    Sign in
                  </LinkTo>
                </Grid>
                <Grid item xs className="grid-align-right">
                  <Button
                    type="button"
                    onClick={UserResendOTP}
                    className="global-info-btn"
                  >
                    {"Resend OTP "}
                  </Button>
                </Grid>
              </Grid>
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
