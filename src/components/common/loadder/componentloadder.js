import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./index.css";

// Circular progress component to display if api call takes more time (loadder)
export default function compnentLoadder() {
  return <CircularProgress disableShrink className="ComponentLoadderPostion" />;
}
