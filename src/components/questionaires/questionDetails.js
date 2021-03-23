import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SettingsIcon from "@material-ui/icons/Settings";
import Grid from "@material-ui/core/Grid";

function QuestionDetails(props) {
  return (
    <Card className="question-type-card">
      <CardContent className="scrollable-card">
        <Typography gutterBottom variant="h6" component="h6">
          View question details
          <div className="action-buttons-container question-actions">
            <Tooltip title="Edit">
              <Button
                variant="contained"
                color="default"
                startIcon={<EditIcon />}
                className={`edit-icon`}
              ></Button>
            </Tooltip>
            <Tooltip title="Conditional jump">
              <Button
                variant="contained"
                color="default"
                startIcon={<SettingsIcon />}
                className={`view-icon`}
              ></Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                variant="contained"
                color="default"
                startIcon={<DeleteIcon />}
                className={`delete-icon`}
              ></Button>
            </Tooltip>
          </div>
        </Typography>
        <div className="card-form">
          <Grid container item xs={12} spacing={3} direction="column">
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>Question type :</label>
              </Grid>
              <Grid item xs={9}>
                <label>Boolean</label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>Question :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  This is a test boolean question to be displayed in the list.
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>Description :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  This is a test boolean question to be displayed in the list.
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>Red flag answer :</label>
              </Grid>
              <Grid item xs={9}>
                <label>True</label>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </CardContent>
      {/* <CardActions className="action-container">
        <Button type="button" size="small" color="primary">
          Close
        </Button>
      </CardActions> */}
    </Card>
  );
}

export default QuestionDetails;
