import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";

//Component(Button) to add a floor location
function CustomToolbarAddFlocation(props) {
  function handleClickCustomAddFlocation() {
    props.setopenAddLocationModal(true);
  }

  return (
    <div className={`maingrid-actions`}>
      <Tooltip title="Add New Location">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className={`add-icon`}
          onClick={handleClickCustomAddFlocation}
        ></Button>
      </Tooltip>
    </div>
  );
}
export default CustomToolbarAddFlocation;
