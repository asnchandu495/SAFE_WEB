import React, { useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert, AlertTitle } from "@material-ui/lab";
import "../../../styles/styles.scss";

/**
 *  Toaster component
 *  common toaster component to display either on success or failure of the api call
 * @param  {} props
 */
function ToasterComponent(props) {
  const [errorMsg, setErrorMsg] = useState();

  useEffect(() => {
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

    setErrorMsg(finalErrorMsg);
  }, [props]);

  /**
   * Handle Close Snackbar
   * method on click of toaster close
   * @param  {} event
   * @param  {} reason
   */
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
              {errorMsg ? errorMsg.map((msg) => <li key={msg}>{msg}</li>) : ""}
            </ul>
          </span>
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ToasterComponent;
