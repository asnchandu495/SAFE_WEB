import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import AuthService from "../../services/authService";
import GlobalSettingApiServices from "../../services/globalSettingService";

const useStyles = makeStyles((theme) => ({}));

export default function ChangePassword(props) {
  const thisUserId = props.userId;
  const GlobalSettingApi = new GlobalSettingApiServices();
  const classes = useStyles();

  const authApiCall = new AuthService();

  const [formData, SetformData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    statusMessage: "test message",
    userId: thisUserId,
  });
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState("");
  const [toasterServerity, settoasterServerity] = useState("array");
  const [passwordLength, setpasswordLength] = useState();
  const [showLoadder, setshowLoadder] = useState(false);

  useEffect(() => {
    GlobalSettingApi.getLoadGlobalSetting()
      .then((getPasswordLength) => {
        setpasswordLength(getPasswordLength.maxPasswordlength);
      })
      .catch((err) => {
        console.log(err);
      });
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== formData.newPassword) {
        return false;
      }
      return true;
    });
  }, [formData.confirmPassword, formData.newPassword]);

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
    authApiCall
      .ChangePassword(data)
      .then((res) => {
        setStateSnackbar(true);
        setToasterMessage(
          "Your account password is updated. Login with your new password."
        );
        settoasterServerity("success");
        setTimeout(() => {
          setshowLoadder(false);
          localStorage.removeItem("id_token");
          localStorage.removeItem("id_tokenExpiry");
          window.location.replace("/");
        }, 3000);
      })
      .catch((err) => {
        setToasterMessage(err.data.error_description);
        settoasterServerity("error");
        settoasterErrorMessageType("object");
        setStateSnackbar(true);
        setshowLoadder(false);
      });
  }

  return (
    <Container>
      <CssBaseline />
      <Card className="main-paper-auth">
        <CardContent>
          <Typography className="changepwd-page-title">
            Change Password
          </Typography>
          <ValidatorForm
            className={`global-form change-password-form`}
            onSubmit={handleSubmit}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextValidator
                  variant="outlined"
                  validators={["required"]}
                  errorMessages={["Please enter old password"]}
                  fullWidth
                  name="oldPassword"
                  placeholder="Old Password *"
                  type="password"
                  id="oldPassword"
                  autoComplete="oldPassword"
                  onChange={handleChange}
                  value={formData.oldPassword}
                  className="global-input"
                  InputLabelProps={{ shrink: false }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidator
                  variant="outlined"
                  validators={[
                    "required",

                    "matchRegexp:^.{" + passwordLength + ",}$",
                  ]}
                  errorMessages={[
                    "Please enter new password",

                    "Minimum 8 characters",
                  ]}
                  fullWidth
                  name="newPassword"
                  placeholder="New Password *"
                  type="password"
                  id="newPassword"
                  autoComplete="newPassword"
                  onChange={handleChange}
                  value={formData.newPassword}
                  className="global-input"
                  InputLabelProps={{ shrink: false }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidator
                  variant="outlined"
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
                  placeholder="Confirm password *"
                  type="password"
                  id="confirmPassword"
                  autoComplete="confirmPassword"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                  className="global-input"
                  InputLabelProps={{ shrink: false }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} className="submit-button">
              <Button
                variant="contained"
                type="submit"
                className="global-submit-btn"
                disabled={showLoadder}
              >
                {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
              </Button>
            </Grid>
          </ValidatorForm>
        </CardContent>
      </Card>
      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
    </Container>
  );
}
