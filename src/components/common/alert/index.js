import React, { Fragment, useState, useEffect } from "react";
import { Prompt } from "react-router-dom";

/**
 * Alert Box Conatiner
 * common alert message component if user redirects to another page without saving existing
 * @param  {} props
 */
function AlertBoxContainer(props) {
  return (
    <Prompt
      when={props.isAlertBoxOpened}
      message="You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?"
    />
  );
}

export default AlertBoxContainer;
