import React from "react";
import {
  makeStyles,
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";

const theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "13px !important",
        color: "#dae0e4 !important",
        backgroundColor: "#27292B !important",
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  infoIconSize: {
    fontSize: 20,
    marginLeft: 5,
    color: "#212121 !important",
  },
  tooltipMargin: {
    marginBottom: "-5px !important",
  },
}));

/**
Tooltip component 
common  Info Component  to display on click of hover
 * @param  {} props
 */
function TooltipComponent(props) {
  const classes = useStyles();

  return (
    <MuiThemeProvider theme={theme}>
      <Tooltip title={`${props.tooltipMessage}`}>
        <InfoIcon
          className={`${classes.infoIconSize} ${
            props.isMarginBottom ? classes.tooltipMargin : ""
          }`}
        />
      </Tooltip>
    </MuiThemeProvider>
  );
}

export default TooltipComponent;
