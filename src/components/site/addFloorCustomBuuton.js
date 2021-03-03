import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";

function CustomToolbarAddFloor(props) {
  function handleClickCustomAddFloor() {
    props.setopenaddFloorModal(true);
    props.setSelectedRowId("");
  }

  return (
    <div className={`maingrid-actions`}>
      <Tooltip title="Add new floor">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className={`add-icon`}
          onClick={handleClickCustomAddFloor}
        ></Button>
      </Tooltip>
    </div>
  );
}
export default CustomToolbarAddFloor;
