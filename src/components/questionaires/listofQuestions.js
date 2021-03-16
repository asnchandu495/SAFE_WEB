import React, { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

function ListofQuestions(props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <List component="nav">
      <ListItem
        button
        selected={selectedIndex === 0}
        onClick={(event) => handleListItemClick(event, 0)}
        alignItems="flex-start"
      >
        <ListItemAvatar>
          <Avatar>1</Avatar>
        </ListItemAvatar>
        <ListItemText
          secondary={
            <p className="question-name">
              {
                "Your question here Your question here Your question here Your question here Your question here Your question here"
              }
            </p>
          }
        />
      </ListItem>
      <Divider component="li" />
      <ListItem
        button
        selected={selectedIndex === 1}
        onClick={(event) => handleListItemClick(event, 1)}
        alignItems="flex-start"
      >
        <ListItemAvatar>
          <Avatar>1</Avatar>
        </ListItemAvatar>
        <ListItemText
          secondary={
            <p className="question-name">
              {
                "Your question here Your question here Your question here Your question here Your question here Your question here"
              }
            </p>
          }
        />
      </ListItem>
      <Divider component="li" />
      <ListItem
        button
        selected={selectedIndex === 2}
        onClick={(event) => handleListItemClick(event, 2)}
        alignItems="flex-start"
      >
        <ListItemAvatar>
          <Avatar>1</Avatar>
        </ListItemAvatar>
        <ListItemText
          secondary={
            <p className="question-name">
              {
                "Your question here Your question here Your question here Your question here Your question here Your question here"
              }
            </p>
          }
        />
      </ListItem>
      <Divider component="li" />
    </List>
  );
}

export default ListofQuestions;
