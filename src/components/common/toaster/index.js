import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert, AlertTitle } from "@material-ui/lab";
import "../../../styles/styles.scss";

function ToasterComponent(props) {
  let messageArray = [props.toasterMessage];
  let finalErrorMsg = [];
  if (props.toasterServerity === "error") {
    if (props.toasterErrorMessageType === "object") {
      finalErrorMsg = messageArray;
    } else {
      for (var index in messageArray) {
        for (var key in messageArray[index]) {
          let getErrorObject = messageArray[index];
          finalErrorMsg.push(getErrorObject[key][0]);
        }
      }
    }
  } else if (props.toasterServerity === "success") {
    finalErrorMsg = messageArray;
  } else if (props.toasterErrorMessageType === "text") {
    finalErrorMsg = messageArray;
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    props.setStateSnackbar(false);
  };

  return (
    <div className="ToasterContainer">
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={props.stateSnackbar}
        onClose={handleCloseSnackbar}
        autoHideDuration={5000}
      >
        <Alert onClose={handleCloseSnackbar} severity={props.toasterServerity}>
          <AlertTitle>
            {props.toasterServerity === "success" ? "Success" : "Error"}
          </AlertTitle>
          <span id="client-snackbar" className={"toastermessage"}>
            <ul className={"toastermessagelistconatiner"}>
              {finalErrorMsg.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          </span>
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ToasterComponent;
