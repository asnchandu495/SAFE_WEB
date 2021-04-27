import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { Link as LinkTo } from "react-router-dom";
import { ValidatorForm } from "react-material-ui-form-validator";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import RichTextEditor from "react-rte";

function ActionForm(props) {
  const [templateValue, setTemplateValue] = useState(
    RichTextEditor.createEmptyValue()
  );

  const onChangeTemplate = (value) => {
    setTemplateValue(value);
  };

  return (
    <ValidatorForm className={`global-form full-height`}>
      <Card className="question-type-card">
        <CardContent className="scrollable-card-actions">
          <Typography gutterBottom variant="h6" component="h6">
            Selected action details
          </Typography>
          <div className="card-form">
            <Grid container item xs={12} spacing={3} direction="column">
              <Grid item xs={12} container>
                <Grid item xs={3}>
                  <label>Template</label>
                </Grid>
                <Grid item xs={9}>
                  <RichTextEditor
                    value={templateValue}
                    onChange={onChangeTemplate}
                  />
                </Grid>
              </Grid>
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
