import React, { useState, useEffect, Component } from "react";
import Grid from "@material-ui/core/Grid";
import { Link as LinkTo, withRouter } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import workflowService from "../../services/workflowService";
import ComponentLoadderComponent from "../common/loadder/componentloadder";

function ActionForm(props) {
  const workflowId = props.match.params.wid;
  const activityId = props.match.params.aid;
  const uActivityId = props.match.params.uaid;
  const workflowApiCall = new workflowService();

  const [formData, setFormData] = useState();
  const [componentLoadder, setComponentLoadder] = useState(true);

  useEffect(() => {
    workflowApiCall
      .getOptionsByActivityId(activityId)
      .then((result) => {
        console.log(result);
        if (result) {
          let dynamicForm = result.configurationDataList;
          let dynamicFormSelected = props.selectedAction.worflowActivityInputs;
          console.log(dynamicFormSelected);
          let newFormCollection = [];
          dynamicForm.map((form) => {
            let remarksForInput = dynamicFormSelected.find((item) => {
              return item.name == form.name ? item.remarksForInput : "";
            });

            let inputIntelliSenseOptions = dynamicFormSelected.find((item) => {
              return item.name == form.name
                ? item.inputIntelliSenseOptions
                : "";
            });

            newFormCollection.push({
              id: form.id,
              inputType: form.inputType,
              name: form.name,
              value: form.value,
              remarksForInput: remarksForInput
                ? remarksForInput.remarksForInput
                : "",
              inputIntelliSenseOptions: inputIntelliSenseOptions
                ? inputIntelliSenseOptions.inputIntelliSenseOptions
                : [],
            });
          });
          console.log(newFormCollection);
          setFormData({
            id: result.id,
            uniqueActivityId: result.uniqueActivityId,
            name: result.name,
            aimWorkflowId: result.workflowId,
            parentActivityId: result.activityId,
            configurationDataList: newFormCollection,
          });
          setComponentLoadder(false);
        } else {
          let dynamicForm = props.selectedAction.worflowActivityInputs;
          let newFormCollection = dynamicForm.map((form) => ({
            id: form.id ? form.id : "",
            inputType: form.inputType,
            name: form.name,
            remarksForInput: form.remarksForInput,
            inputIntelliSenseOptions: form.inputIntelliSenseOptions,
            value: form.value ? form.value : "",
          }));
          setFormData({
            id: "",
            uniqueActivityId: props.selectedAction.uniqueActivityId,
            name: props.selectedAction.name,
            aimWorkflowId: workflowId,
            parentActivityId: activityId,
            configurationDataList: newFormCollection,
          });
          setComponentLoadder(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props]);

  const handleTemplate = (e, editor, index, name) => {
    const list = {
      ...formData,
      configurationDataList: [
        ...formData.configurationDataList.map((con, conIndex) =>
          conIndex == index ? { ...con, [name]: editor } : con
        ),
      ],
    };
    setFormData(list);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = {
      ...formData,
      configurationDataList: [
        ...formData.configurationDataList.map((con, conIndex) =>
          conIndex == index ? { ...con, [name]: value } : con
        ),
      ],
    };
    setFormData(list);
  };

  function formSubmit(e) {
    e.preventDefault();
    workflowApiCall
      .addOptions(formData)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function DisplayFromData(props) {
    switch (props.act.inputType) {
      case "Text":
        return (
          <Grid item xs={12} container key={`inputText_${props.index}`}>
            <Grid item xs={3}>
              <label>{props.act.remarksForInput}</label>
            </Grid>
            <Grid item xs={9}>
              <TextValidator
                variant="outlined"
                validators={["required"]}
                errorMessages={[`Please enter ${props.act.remarksForInput}`]}
                fullWidth
                id={`${props.act.name}_${props.index}`}
                placeholder={props.act.remarksForInput}
                name="value"
                onChange={(e) => handleInputChange(e, props.index)}
                value={props.act.value}
                InputLabelProps={{ shrink: false }}
                className="global-input action-form-input"
              />
            </Grid>
          </Grid>
        );
      case "Template":
        return (
          <Grid item xs={12} container key={`inputTemplate_${props.index}`}>
            <Grid item xs={3}>
              <label>{props.act.remarksForInput}</label>
            </Grid>
            <Grid item xs={9}>
              <CKEditor
                editor={ClassicEditor}
                data={props.act.value}
                id={props.act.name}
                name="value"
                onChange={(event, editor) => {
                  handleTemplate(event, editor.getData(), props.index, "value");
                }}
              />
            </Grid>
          </Grid>
        );
      default:
        return <h4>Not found</h4>;
    }
  }

  return (
    <>
      {componentLoadder ? (
        <ComponentLoadderComponent></ComponentLoadderComponent>
      ) : (
        <ValidatorForm
          className={`global-form full-height`}
          onSubmit={formSubmit}
        >
          <Card className="question-type-card">
            <CardContent className="scrollable-card-actions">
              <Typography gutterBottom variant="h6" component="h6">
                Selected action details{" "}
              </Typography>
              <div className="card-form">
                <Grid container item xs={12} spacing={3} direction="column">
                  {formData.configurationDataList &&
                  formData.configurationDataList.length > 0
                    ? formData.configurationDataList.map((act, index) => {
                        if (act.inputType == "Text") {
                          return (
                            <Grid
                              item
                              xs={12}
                              container
                              key={`inputText_${index}`}
                            >
                              <Grid item xs={3}>
                                <label>{act.remarksForInput}</label>
                              </Grid>
                              <Grid item xs={9}>
                                <TextValidator
                                  variant="outlined"
                                  validators={["required"]}
                                  errorMessages={[
                                    `Please enter ${act.remarksForInput}`,
                                  ]}
                                  fullWidth
                                  id={`${act.name}_${index}`}
                                  placeholder={act.remarksForInput}
                                  name="value"
                                  onChange={(e) => handleInputChange(e, index)}
                                  value={act.value}
                                  InputLabelProps={{ shrink: false }}
                                  className="global-input action-form-input"
                                />
                              </Grid>
                            </Grid>
                          );
                        }
                        if (act.inputType == "Template") {
                          return (
                            <Grid
                              item
                              xs={12}
                              container
                              key={`inputTemplate_${index}`}
                            >
                              <Grid item xs={3}>
                                <label>{act.remarksForInput}</label>
                              </Grid>
                              <Grid item xs={9}>
                                <CKEditor
                                  editor={ClassicEditor}
                                  data={act.value}
                                  id={act.name}
                                  name="value"
                                  onChange={(event, editor) => {
                                    handleTemplate(
                                      event,
                                      editor.getData(),
                                      index,
                                      "value"
                                    );
                                  }}
                                />
                              </Grid>
                            </Grid>
                          );
                        }
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
      )}
    </>
  );
}

export default withRouter(ActionForm);
