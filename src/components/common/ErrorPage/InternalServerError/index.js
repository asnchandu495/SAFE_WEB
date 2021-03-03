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

function Internalserver(props) {
  const classes = useStyles();
  function LoginPage() {
    props.history.push("/");
  }
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <div className="textColour">Oops</div>
        <h3 className="headingText">Hey! Something went wrong.</h3>
        <p className="normalText">
          Just Get in touch with your administrator and get it rolling.
        </p>
        <b>
          <a href="#" onClick={LoginPage}>
            Login
          </a>
        </b>
      </div>
    </Container>
  );
}
export default Internalserver;
