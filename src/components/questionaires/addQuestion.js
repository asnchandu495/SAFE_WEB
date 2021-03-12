import React, { useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link as LinkTo } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

function AddQuestion(props) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <div className="innerpage-container">
      <Breadcrumbs aria-label="breadcrumb" className="global-breadcrumb">
        <LinkTo
          color="inherit"
          href="#"
          to={`/home/dashboard`}
          className="inactive"
        >
          Home
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`questionaires/allquestionaires`}
          className="inactive"
        >
          Questionaires
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="inactive">
          Selected questionaire name
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Add questions
        </LinkTo>
      </Breadcrumbs>
      <Paper className="main-paper main-paper-add-question">
        <Grid container spacing={0}>
          <Grid item xs={12} sm={3}>
            <Paper className="list-questions">
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
            </Paper>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Paper className="add-new-question">
              <Card className="question-type-card">
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h6">
                    Question type
                  </Typography>
                  <div className="card-form">
                    <FormControl variant="outlined" fullWidth>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value=""
                        name="gender"
                        // onChange={handleChange}
                        placeholder="Gender"
                        InputLabelProps={{ shrink: false }}
                        className="global-input single-select"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={"Male"}>Male</MenuItem>
                        <MenuItem value={"Female"}>Female</MenuItem>
                        <MenuItem value={"Others"}>Others</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </CardContent>
                <CardActions className="action-container">
                  <Button size="small" color="primary">
                    Next
                  </Button>
                </CardActions>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default AddQuestion;
