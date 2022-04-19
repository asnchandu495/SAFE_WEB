import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Link as LinkTo } from "react-router-dom";
import CardContent from "@material-ui/core/CardContent";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import ToasterMessageComponent from "../../common/toaster";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import AuthService from "../../../services/authService";

export default function ForgotPassword(props) {
  const authApiCall = new AuthService();

  const [formData, SetformData] = useState({
    email: "",
  });
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [toasterServerity, settoasterServerity] = useState("");
  const [showLoadder, setshowLoadder] = useState(false);
  /**
   * Handle Change
   * Text
   * @param  {} e
   */
  function handleChange(e) {
    const { name, value } = e.target;
    SetformData((forgotPasswordForm) => ({
      ...forgotPasswordForm,
      [name]: value,
    }));
  }
  /**
    * Handle Submit

   */
  function handleSubmit() {
    setshowLoadder(true);
    authApiCall
      .ForgotPassword(formData)
      .then((res) => {
        localStorage.setItem("UserEmailId", formData.email);
        setToasterMessage("OTP sent to your registered email ID.");
        settoasterServerity("success");
        setStateSnackbar(true);
        setTimeout(() => {
          props.history.push("/verify-otp");
          setshowLoadder(false);
        }, 4000);
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
                id="email"
                placeholder="Email id"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                value={formData.email}
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
              <LinkTo href="#" to="/">
                Already registered? Sign in
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
