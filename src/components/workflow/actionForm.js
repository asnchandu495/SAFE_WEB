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
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ActionDetailsForm from "./actionDetailsForm";

function ActionForm(props) {
  const workflowId = props.match.params.wid;
  const activityId = props.match.params.aid;
  const uActivityId = props.match.params.uaid;
  const workflowApiCall = new workflowService();

  const [formData, setFormData] = useState();
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [showLoadder, setshowLoadder] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );

  useEffect(() => {
    setComponentLoadder(true);
    workflowApiCall
      .getOptionsByActivityId(activityId)
      .then((result) => {
        if (result.length > 0) {
          console.log(props.selectedAction);
          result.map((action) => {
            if (
              action.uniqueActivityId == props.selectedAction.uniqueActivityId
            ) {
              console.log(action);
              let actionListFromAPI = action.configurationDataList;
              let actionListFromSelected =
                props.selectedAction.worflowActivityInputs;
              let newFormCollection = [];
              actionListFromSelected.map((ac) => {
                let alreadyAddedAction = actionListFromAPI.find((item) => {
                  return item.name == ac.name ? item : null;
                });

                newFormCollection.push({
                  id: alreadyAddedAction ? alreadyAddedAction.id : "",
                  inputType: alreadyAddedAction
                    ? alreadyAddedAction.inputType
                    : ac.inputType,
                  name: alreadyAddedAction ? alreadyAddedAction.name : ac.name,
                  value: alreadyAddedAction ? alreadyAddedAction.value : "",
                  remarksForInput: ac.remarksForInput,
                  inputIntelliSenseOptions: ac.inputIntelliSenseOptions,
                });
              });
              console.log(newFormCollection);
              setFormData({
                id: action.id,
                uniqueActivityId: action.uniqueActivityId,
                name: action.name,
                aimWorkflowId: action.aimWorkflowId,
                parentActivityId: action.parentActivityId,
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
          });
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
    return false;
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
    setshowLoadder(true);
    e.preventDefault();
    if (formData.id == "") {
      workflowApiCall
        .addOptions(formData)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Action details added");
          settoasterServerity("success");
          setTimeout(() => {
            setshowLoadder(false);
            props.setReloadPage("YES");
          }, 6000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      workflowApiCall
        .updateOptions(formData)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Action details updated");
          settoasterServerity("success");
          setTimeout(() => {
            setshowLoadder(false);
            props.setReloadPage("YES");
          }, 6000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    }
  }

  function gotoPreviousPage() {
    props.history.push(`/workflow/${workflowId}/activities`);
  }

  return (
    <>
      {componentLoadder ? (
        <ComponentLoadderComponent></ComponentLoadderComponent>
      ) : (
        // <ValidatorForm
        //   className={`global-form full-height`}
        //   onSubmit={formSubmit}
        // >
        //   <Card className="question-type-card">
        //     <CardContent className="scrollable-card-actions">
        //       <Typography gutterBottom variant="h6" component="h6">
        //         Selected action details{" "}
        //       </Typography>
        //       <div className="card-form">
        //         <Grid container item xs={12} spacing={3} direction="column">
        //           {formData.configurationDataList &&
        //           formData.configurationDataList.length > 0
        //             ? formData.configurationDataList.map((act, index) => {
        //                 if (act.inputType == "Text") {
        //                   return (
        //                     <Grid
        //                       item
        //                       xs={12}
        //                       container
        //                       key={`inputText_${index}`}
        //                     >
        //                       <Grid item xs={3}>
        //                         <label>{act.remarksForInput}</label>
        //                       </Grid>
        //                       <Grid item xs={9}>
        //                         <TextValidator
        //                           variant="outlined"
        //                           validators={["required"]}
        //                           errorMessages={[
        //                             `Please enter ${act.remarksForInput}`,
        //                           ]}
        //                           fullWidth
        //                           id={`${act.name}_${index}`}
        //                           placeholder={act.remarksForInput}
        //                           name="value"
        //                           onChange={(e) => handleInputChange(e, index)}
        //                           value={act.value}
        //                           InputLabelProps={{ shrink: false }}
        //                           className="global-input action-form-input"
        //                         />
        //                       </Grid>
        //                     </Grid>
        //                   );
        //                 }
        //                 if (act.inputType == "Template") {
        //                   return (
        //                     <Grid
        //                       item
        //                       xs={12}
        //                       container
        //                       key={`inputTemplate_${index}`}
        //                     >
        //                       <Grid item xs={3}>
        //                         <label>{act.remarksForInput}</label>
        //                       </Grid>
        //                       <Grid item xs={9}>
        //                         <CKEditor
        //                           editor={ClassicEditor}
        //                           data={act.value}
        //                           id={act.name}
        //                           name="value"
        //                           onChange={(event, editor) => {
        //                             handleTemplate(
        //                               event,
        //                               editor.getData(),
        //                               index,
        //                               "value"
        //                             );
        //                           }}
        //                         />
        //                       </Grid>
        //                     </Grid>
        //                   );
        //                 }
        //               })
        //             : ""}
        //         </Grid>
        //       </div>
        //     </CardContent>
        //     <CardActions className="action-container">
        //       <div className={`form-buttons-container`}>
        //         <Button
        //           variant="contained"
        //           type="submit"
        //           className="global-submit-btn"
        //           disabled={showLoadder}
        //         >
        //           {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
        //         </Button>
        //         <Button
        //           variant="contained"
        //           type="button"
        //           className="global-cancel-btn"
        //           onClick={gotoPreviousPage}
        //         >
        //           Cancel
        //         </Button>
        //       </div>
        //     </CardActions>
        //   </Card>
        // </ValidatorForm>
        <ActionDetailsForm formData={formData}></ActionDetailsForm>
      )}
      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
    </>
  );
}

export default withRouter(ActionForm);
