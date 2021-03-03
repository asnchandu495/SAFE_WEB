import React, { Fragment, useState, useEffect } from "react";
import { Prompt } from "react-router-dom";

function AlertBoxContainer(props) {
  return (
    <Prompt
      when={props.isAlertBoxOpened}
      message="You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?"
    />
  );
}

export default AlertBoxContainer;
