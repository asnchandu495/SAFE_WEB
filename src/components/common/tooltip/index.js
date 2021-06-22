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
                fontSize: "13px",
                color: "#dae0e4",
                backgroundColor: "#27292B",
            },
        },
    },
});

const useStyles = makeStyles((theme) => ({
    infoIconSize: {
        fontSize: 20,
        marginLeft: 5,

    },
    tooltipMargin: {
        marginBottom: -5
    }
}));

function TooltipComponent(props) {
    const classes = useStyles();

    return (
        <MuiThemeProvider theme={theme}>
            <Tooltip title={`${props.tooltipMessage}`}>
                <InfoIcon className={`${classes.infoIconSize} ${props.isMarginBottom ? classes.tooltipMargin : ''}`} />
            </Tooltip>
        </MuiThemeProvider>
    );
}

export default TooltipComponent;
