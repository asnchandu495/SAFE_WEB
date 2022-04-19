import React, { useState, Fragment, useEffect } from "react";
import "./index.css";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  "@global": {
    body: {
      backgroundColor: "#fff",
    },
  },
  paper: {
    marginTop: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: "5px",
    backgroundColor: "#20639B",
  },
}));

function Unauthorized(props) {
  const classes = useStyles();

  localStorage.removeItem("id_token");
  localStorage.removeItem("id_tokenExpiry");

  /**
   * Login Page
   * Redirect to login if unauthorised
   */
  function LoginPage() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("id_tokenExpiry");
    props.history.push("/");
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <div className="textColour">401 Error</div>
        <h3 className="headingText">
          Hey! you are building something exciting. But it seems the
          administrator has not given you access to this page.
        </h3>
        <p className="normalText">
          Just Get in touch with your administrator and get it rolling. click
          here to{" "}
          <b>
            <a href="#" onClick={LoginPage}>
              Login
            </a>
          </b>
        </p>
      </div>
    </Container>
  );
}
export default Unauthorized;
