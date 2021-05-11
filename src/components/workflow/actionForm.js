import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { Link as LinkTo } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import RichTextEditor from "react-rte";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

function ActionForm(props) {
  const [templateValue, setTemplateValue] = useState(
    RichTextEditor.createEmptyValue()
  );

  const onChangeTemplate = (value) => {
    setTemplateValue(value);
  };

  function DisplayFromData(props) {
    switch (props.act.inputType) {
      case "Text":
        return (
          <Grid item xs={12} container>
            <Grid item xs={3}>
              <label>{props.act.remarksForInput}</label>
            </Grid>
            <Grid item xs={9}>
              <TextValidator
                variant="outlined"
                validators={["required"]}
                errorMessages={[`Please enter ${props.act.remarksForInput}`]}
                fullWidth
                id={props.act.name}
                placeholder={props.act.remarksForInput}
                name={props.act.name}
                // onChange={handleChange}
                value={""}
                InputLabelProps={{ shrink: false }}
                className="global-input action-form-input"
              />
            </Grid>
          </Grid>
        );
      case "Template":
        return (
          <Grid item xs={12} container>
            <Grid item xs={3}>
              <label>{props.act.remarksForInput}</label>
            </Grid>
            <Grid item xs={9}>
              <RichTextEditor
                value={templateValue}
                onChange={onChangeTemplate}
              />
            </Grid>
          </Grid>
        );
      default:
        return <h4>Not found</h4>;
    }
  }

  return (
    <ValidatorForm className={`global-form full-height`}>
      <Card className="question-type-card">
        <CardContent className="scrollable-card-actions">
          <Typography gutterBottom variant="h6" component="h6">
            Selected action details{" "}
          </Typography>
          <div className="card-form">
            <Grid container item xs={12} spacing={3} direction="column">
              {props.selectedAction &&
              props.selectedAction.worflowActivityInputs.length > 0
                ? props.selectedAction.worflowActivityInputs.map((act) => {
                    return <DisplayFromData act={act}></DisplayFromData>;
                  })
                : ""}
            </Grid>
          </div>
        </CardContent>
        <CardActions className="action-container">
          <div className={`form-buttons-container`}>
            <Button
              variant="contained"
              type="submit"
              className="global-submit-btn"
            >
              Submit
            </Button>
            <Button
              variant="contained"
              type="reset"
              className="global-cancel-btn"
            >
              Cancel
            </Button>
          </div>
        </CardActions>
      </Card>
    </ValidatorForm>
  );
}

export default ActionForm;
