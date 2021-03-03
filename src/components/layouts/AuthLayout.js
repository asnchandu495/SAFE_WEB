import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import AuthService from "../../services/authService";
import Logo from "../assets/Logo.svg";
import "../../styles/styles.scss";
import "./AuthLayout.scss";

function AuthLayout(props) {
  const { children } = props;
  const authApiCall = new AuthService();

  useEffect(() => {
    if (authApiCall.loggedIn()) {
      props.history.push("/home/dashboard");
    }
  }, [props]);

  return (
    <div className="auth-main-container">
      <Container component="main" className="main-container-auth" maxWidth="xs">
        <img
          src={Logo}
          className="logo"
          alt="Sutherland Safe"
          title="Sutherland Safe"
        ></img>
        <p className="safe-text">Safe</p>
        <Card className="main-paper-auth">{children}</Card>
      </Container>
    </div>
  );
}

export default withRouter(AuthLayout);
