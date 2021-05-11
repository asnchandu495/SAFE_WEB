import React, { useState, Fragment, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import { useParams } from "react-router-dom";
import ComponentLoadderComponent from "../common/loadder/componentloadder";

function ActionList(props) {
  const [selectedIndex, setSelectedIndex] = useState("001");
  const [selectedActivityActions, setSelectedActivityActions] = useState([
    {
      id: "001",
      name: "User",
      isSaved: true,
    },
    {
      id: "002",
      name: "Security Manager",
      isSaved: false,
    },
    {
      id: "003",
      name: "Site Manager",
      isSaved: false,
    },
    {
      id: "004",
      name: "Team Manager",
      isSaved: false,
    },
    {
      id: "005",
      name: "Supervisor",
      isSaved: false,
    },
    {
      id: "006",
      name: "Site BHR",
      isSaved: true,
    },
    {
      id: "007",
      name: "HR Manager",
      isSaved: true,
    },
  ]);
  const [componentLoadder, setComponentLoadder] = useState(true);

  function searchActions(e) {
    var input = e.target.value;
    var filter = input.toLowerCase();
    var nodes = document.getElementsByClassName("actionlistitems");

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].innerText.toLowerCase().includes(filter)) {
        nodes[i].style.display = "block";
      } else {
        nodes[i].style.display = "none";
      }
    }
  }

  function handleListItemClick(action) {
    props.setSelectedAction(action);
  }

  return (
    <List component="nav">
      <ListItem className="search-list-input">
        <TextField
          variant="outlined"
          fullWidth
          id="groupName"
          placeholder="Search by action..."
          name="groupName"
          onChange={searchActions}
          InputLabelProps={{ shrink: false }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </ListItem>
      {props.allActivityOptions && props.allActivityOptions.length > 0
        ? props.allActivityOptions.map((act, index) => {
            return (
              <div
                className="actionlistitems"
                key={"action=" + act.uniqueActivityId}
              >
                <ListItem
                  button
                  selected={selectedIndex == act.uniqueActivityId}
                  onClick={() => handleListItemClick(act)}
                  alignItems="flex-start"
                >
                  <ListItemText
                    secondary={<p className="question-name">{act.name}</p>}
                  />
                  {/* {act.isSaved ? (
                <DoneAllIcon className="already-saved"></DoneAllIcon>
              ) : (
                ""
              )} */}
                </ListItem>
                <Divider component="li" />
              </div>
            );
          })
        : ""}
    </List>
  );
}

export default ActionList;
