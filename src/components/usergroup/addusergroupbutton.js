import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { Link, withRouter } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  fabButtonIconToolbar: {
    height: 32,
    maxHeight: 32,
  },
  extendedIcon: {
    marginLeft: -10,
  },
  ButtonConatiner:{
      marginBottom:0,
      textAlign:"right",
      paddingRight:15,
      display:"contents"
  }
//   margin-bottom: 0;
//   text-align: right;
//   padding-right: 15px;
//   display: contents;
}));

function CustomToolbarAddUserGroup(props) {
  var loggedinUserRoles = props.loggedinUserRoles;
  const classes = useStyles();

  return (
    <div className={classes.ButtonConatiner}>
        <Tooltip title="Add new usergroup">
          <Fab
            color="primary"
            variant="extended"
            aria-label="add"
            className={[
              classes.fabButtonIconToolbar,
              "globalAddNewButton",
            ].join(" ")}
            component={Link}
            to="/usergroups/add-usergroup"
          >
            <AddIcon className={classes.extendedIcon} />
            Add New
          </Fab>
        </Tooltip>
    </div>
  );
}
export default CustomToolbarAddUserGroup;
