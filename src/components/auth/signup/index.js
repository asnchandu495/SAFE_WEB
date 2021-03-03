import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import "../../../shared/style.css";

const useStyles = makeStyles((theme) => ({}));

export default function SignUp(props) {
  const classes = useStyles();

  const [formData, SetformData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  function UserSignIn() {
    props.history.push("/");
  }

  function handleChange(e) {
    const { name, value } = e.target;
    SetformData((logInForm) => ({
      ...logInForm,
      [name]: value,
    }));
  }

  function handleSubmit() {
    props.history.push("/");
  }

  return (
    <>
      <Card className="main-paper-auth-signup">
        <CardContent>
          <Typography className="auth-page-title">Sign Up</Typography>
          <ValidatorForm
            className={`auth-form ${classes.form}`}
            onSubmit={handleSubmit}
          >
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextValidator
                  variant="outlined"
                  validators={["required"]}
                  errorMessages={["Please enter first name"]}
                  margin="normal"
                  fullWidth
                  id="firstName"
                  label="First Name *"
                  name="firstName"
                  autoComplete="firstName"
                  onChange={handleChange}
                  value={formData.firstName}
                  autoFocus
                />
              </Grid>
              <Grid item xs={6}>
                <TextValidator
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lastName"
                  onChange={handleChange}
                  value={formData.lastName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextValidator
                  variant="outlined"
                  validators={["required", "isEmail", "matchRegexp:^.{0,50}$"]}
                  errorMessages={[
                    "Please enter email id",
                    "Email id is not valid",
                    "Maximum 50 characters",
                  ]}
                  margin="normal"
                  fullWidth
                  id="emailId"
                  label="Email id *"
                  name="emailId"
                  autoComplete="emailId"
                  onChange={handleChange}
                  value={formData.emailId}
                />
              </Grid>
              <Grid item xs={6}>
                <TextValidator
                  variant="outlined"
                  validators={[
                    "required",
                    "minNumber:0",
                    "maxNumber:9999999999",
                    "matchRegexp:^[0-9]*$",
                  ]}
                  errorMessages={[
                    "Please enter mobile number",
                    "Enter valid number",
                    "Maximum allowed 10 digits",
                    "Only numbers are allowed",
                  ]}
                  margin="normal"
                  fullWidth
                  id="mobileNumber"
                  label="Mobile Number *"
                  name="mobileNumber"
                  autoComplete="mobileNumber"
                  onChange={handleChange}
                  value={formData.mobileNumber}
                />
              </Grid>
              <Grid item xs={6}>
                <TextValidator
                  variant="outlined"
                  validators={["required"]}
                  errorMessages={["Please enter password"]}
                  margin="normal"
                  fullWidth
                  id="password"
                  label="Password *"
                  name="password"
                  autoComplete="password"
                  onChange={handleChange}
                  value={formData.password}
                />
              </Grid>
              <Grid item xs={6}>
                <TextValidator
                  variant="outlined"
                  validators={["required"]}
                  errorMessages={["Please re-enter password"]}
                  margin="normal"
                  fullWidth
                  id="confirmPassword"
                  label="Confirm Password *"
                  name="confirmPassword"
                  autoComplete="confirmPassword"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="auth-submit-btn"
            >
              Submit
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={UserSignIn}>
                  {"Already registered? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </ValidatorForm>
        </CardContent>
      </Card>
    </>
  );
}
