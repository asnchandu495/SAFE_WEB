import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { Link as LinkTo } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import ToasterMessageComponent from "../../common/toaster";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import AuthService from "../../../services/authService";
import GlobalSettingApiServices from "../../../services/globalSettingService";

export default function ResetPassword(props) {
  const authApiCall = new AuthService();
  const GlobalSettingApi = new GlobalSettingApiServices();
  const [formData, SetformData] = useState({
    validId: "",
    password: "",
    confirmPassword: "",
  });
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [toasterServerity, settoasterServerity] = useState("");
  const [showLoadder, setshowLoadder] = useState(false);
  const [passwordLength, setpasswordLength] = useState();

  useEffect(() => {
    GlobalSettingApi.getLoadGlobalSetting()
      .then((getPasswordLength) => {
        setpasswordLength(getPasswordLength.maxPasswordlength);
      })
      .catch((err) => {
        console.log(err);
      });
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== formData.password) {
        return false;
      }
      return true;
    });
  }, [formData]);

  function handleChange(e) {
    const { name, value } = e.target;
    SetformData((formData) => ({
      ...formData,
      [name]: value,
    }));
  }

  function handleSubmit() {
    setshowLoadder(true);
    var data = formData;
    data.validId = props.match.params.id;
    authApiCall
      .ResetPassword(data)
      .then((res) => {
        props.history.push("/");
        setshowLoadder(false);
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
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <TextValidator
                variant="outlined"
                margin="normal"
                validators={[
                  "required",
                  "matchRegexp:^.{" + passwordLength + ",}$",
                ]}
                errorMessages={[
                  "Please enter password",
                  "Minimum 8 characters",
                ]}
                fullWidth
                name="password"
                placeholder="Password"
                type="password"
                id="password"
                autoComplete="password"
                onChange={handleChange}
                value={formData.password}
              />
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="confirmPassword" className="input-label">
                Confirm password
              </label>
              <TextValidator
                variant="outlined"
                margin="normal"
                validators={[
                  "required",
                  "isPasswordMatch",
                  "matchRegexp:^.{" + passwordLength + ",}$",
                ]}
                errorMessages={[
                  "Please re-enter password",
                  "Password mismatch",
                  "Minimum 8 characters",
                ]}
                fullWidth
                name="confirmPassword"
                placeholder="Confirm password"
                type="password"
                id="confirmPassword"
                autoComplete="confirmPassword"
                onChange={handleChange}
                value={formData.confirmPassword}
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
