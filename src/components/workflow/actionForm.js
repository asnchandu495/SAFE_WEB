import React, { useState, useEffect, Component } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo, withRouter } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import workflowService from "../../services/workflowService";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";

const initialState = {
  mouseX: null,
  mouseY: null,
};

const editorConfiguration = {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "underline",
    "bulletedList",
    "numberedList",
    "link",
    "strikethrough",
    "fontcolor",
    "FontBackgroundColor",
    "FontSize",
    "Alignment",
    "fontFamily",
    "insertTable",
  ],
  fontSize: {
    options: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  },
  fontFamily: {
    options: ["default", "Arial", "Times New Roman"],
    supportAllValues: true,
  },
};

function ActionForm(props) {
  const workflowId = props.match.params.wid;
  const activityId = props.match.params.aid;
  const uActivityId = props.match.params.uaid;
  const actionId = props.match.params.actionId;
  const workflowApiCall = new workflowService();

  const [formData, setFormData] = useState();
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [showLoadder, setshowLoadder] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [selectedActionForm, setSelectedActionForm] = useState();
  const [selectedWorkflowDetails, setSelectedWorkflowDetails] = useState();
  const [stateContextMenu, setStateContextMenu] = useState(initialState);
  const [currentEditor, setCurrentEditor] = useState();
  const [selectedActivityDetails, setSelectedActivityDetails] = useState();

  useEffect(() => {
    setComponentLoadder(true);
    Promise.all([
      workflowApiCall.getAllMasterOptionsForActivity(uActivityId),
      workflowApiCall.GetWorkFlowById(workflowId),
      workflowApiCall.GetActivityById(activityId),
    ])
      .then(
        ([allMasterOptionsForActivity, workflowDetails, activityDetails]) => {
          setSelectedWorkflowDetails(workflowDetails);
          setSelectedActivityDetails(activityDetails);
          console.log(allMasterOptionsForActivity);
          let selectedActivityOptionFormData = allMasterOptionsForActivity.find(
            (act) => {
              return act.uniqueActivityId == actionId ? act : "";
            }
          );
          setSelectedActionForm(selectedActivityOptionFormData);
          console.log(selectedActivityOptionFormData);
          workflowApiCall
            .getOptionsByActivityId(activityId)
            .then((result) => {
              console.log(result);
              if (result.length > 0) {
                let selectedActivityOptionSaved = result.find((act) => {
                  return act.uniqueActivityId ==
                    selectedActivityOptionFormData.uniqueActivityId
                    ? act
                    : "";
                });
                console.log(selectedActivityOptionSaved);
                if (selectedActivityOptionSaved) {
                  let actionListFromAPI =
                    selectedActivityOptionSaved.configurationDataList;
                  let newFormCollection = [];
                  selectedActivityOptionFormData.worflowActivityInputs.map(
                    (ac) => {
                      let alreadyAddedAction = actionListFromAPI.find(
                        (item) => {
                          return item.name == ac.name ? item : null;
                        }
                      );

                      newFormCollection.push({
                        id: alreadyAddedAction ? alreadyAddedAction.id : "",
                        inputType: alreadyAddedAction
                          ? alreadyAddedAction.inputType
                          : ac.inputType,
                        name: alreadyAddedAction
                          ? alreadyAddedAction.name
                          : ac.name,
                        value: alreadyAddedAction
                          ? alreadyAddedAction.value
                          : "",
                        remarksForInput: ac.remarksForInput,
                        inputIntelliSenseOptions: ac.inputIntelliSenseOptions,
                      });
                    }
                  );
                  console.log(newFormCollection);
                  setFormData({
                    id: selectedActivityOptionSaved.id,
                    uniqueActivityId:
                      selectedActivityOptionSaved.uniqueActivityId,
                    name: selectedActivityOptionSaved.name,
                    aimWorkflowId: selectedActivityOptionSaved.aimWorkflowId,
                    parentActivityId:
                      selectedActivityOptionSaved.parentActivityId,
                    configurationDataList: newFormCollection,
                  });
                  setComponentLoadder(false);
                } else {
                  let dynamicForm =
                    selectedActivityOptionFormData.worflowActivityInputs;
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
                    uniqueActivityId:
                      selectedActivityOptionFormData.uniqueActivityId,
                    name: selectedActivityOptionFormData.name,
                    aimWorkflowId: workflowId,
                    parentActivityId: activityId,
                    configurationDataList: newFormCollection,
                  });
                  setComponentLoadder(false);
                }
              } else {
                let dynamicForm =
                  selectedActivityOptionFormData.worflowActivityInputs;
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
                  uniqueActivityId:
                    selectedActivityOptionFormData.uniqueActivityId,
                  name: selectedActivityOptionFormData.name,
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
        }
      )
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  //Method to bind the form feilds with form data[api]
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
  //Method on click of form submit to add the action details
  function formSubmit(e) {
    setshowLoadder(true);
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    if (formData.id == "") {
      workflowApiCall
        .addOptions(formData)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Action details added");
          settoasterServerity("success");
          setTimeout(() => {
            setshowLoadder(false);
            props.history.push(
              `/workflow/${workflowId}/${activityId}/${uActivityId}/actions`
            );
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
            props.history.push(
              `/workflow/${workflowId}/${activityId}/${uActivityId}/actions`
            );
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
    props.history.push(
      `/workflow/${workflowId}/${activityId}/${uActivityId}/actions`
    );
  }
  //method on change of onContextMenu ck editor
  const handleClickContextMenu = (event) => {
    event.preventDefault();
    setStateContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };
  //Method on close of menu close in ck editor
  const handleCloseContextMenu = () => {
    setStateContextMenu(initialState);
  };
  //on change ck editor option text tags-[name(value)]
  const handleClickContextMenuOption = (opt, index, name) => {
    currentEditor.model.change((writer) => {
      writer.insertText(
        opt,
        currentEditor.model.document.selection.getFirstPosition()
      );
    });
    const list = {
      ...formData,
      configurationDataList: [
        ...formData.configurationDataList.map((con, conIndex) =>
          conIndex == index ? { ...con, [name]: currentEditor.getData() } : con
        ),
      ],
    };
    setFormData(list);
    setStateContextMenu(initialState);
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
        <LinkTo color="textPrimary" href="#" to="#" className="inactive">
          Work Flow
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/workflow/view-workflow/${workflowId}`}
          className="inactive"
        >
          {selectedWorkflowDetails ? selectedWorkflowDetails.name : ""}
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/workflow/${workflowId}/${activityId}/${uActivityId}/actions`}
          className="inactive"
        >
          {selectedActivityDetails ? selectedActivityDetails.name : ""}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" to="#" className="inactive">
          {selectedActionForm ? selectedActionForm.name : ""}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" to="#" className="active">
          Configure
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder ? (
        <ComponentLoadderComponent></ComponentLoadderComponent>
      ) : (
        <ValidatorForm
          className={`global-form full-height`}
          onSubmit={formSubmit}
        >
          <Card className="question-type-card">
            <CardContent className="scrollable-card-actions">
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
                              <Grid
                                item
                                xs={9}
                                onContextMenu={handleClickContextMenu}
                              >
                                <CKEditor
                                  editor={Editor}
                                  config={editorConfiguration}
                                  data={act.value}
                                  id={act.name}
                                  name="value"
                                  onReady={(editor) => {
                                    editor.editing.view.change((writer) => {
                                      writer.setStyle(
                                        "height",
                                        "250px",
                                        editor.editing.view.document.getRoot()
                                      );
                                    });
                                  }}
                                  onChange={(event, editor) => {
                                    handleTemplate(
                                      event,
                                      editor.getData(),
                                      index,
                                      "value"
                                    );
                                  }}
                                  onFocus={(event, editor) => {
                                    setCurrentEditor(editor);
                                  }}
                                />
                                <Menu
                                  keepMounted
                                  open={stateContextMenu.mouseY !== null}
                                  onClose={handleCloseContextMenu}
                                  anchorReference="anchorPosition"
                                  anchorPosition={
                                    stateContextMenu.mouseY !== null &&
                                    stateContextMenu.mouseX !== null
                                      ? {
                                          top: stateContextMenu.mouseY,
                                          left: stateContextMenu.mouseX,
                                        }
                                      : undefined
                                  }
                                >
                                  {act.inputIntelliSenseOptions.length > 0 ? (
                                    act.inputIntelliSenseOptions.map((opt) => {
                                      return (
                                        <MenuItem
                                          onClick={() =>
                                            handleClickContextMenuOption(
                                              opt,
                                              index,
                                              "value"
                                            )
                                          }
                                        >
                                          {opt}
                                        </MenuItem>
                                      );
                                    })
                                  ) : (
                                    <MenuItem>No options</MenuItem>
                                  )}
                                </Menu>
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
              <Grid item container xs={12} className={`inner-table-buttons`}>
                <Grid item xs={3}>
                  <label>&nbsp;</label>
                </Grid>
                <Grid item xs={9}>
                  <div className={`form-buttons-container`}>
                    <Button
                      variant="contained"
                      type="submit"
                      className="global-submit-btn"
                      disabled={showLoadder}
                    >
                      {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
                    </Button>
                    <Button
                      variant="contained"
                      type="button"
                      className="global-cancel-btn"
                      onClick={gotoPreviousPage}
                    >
                      Cancel
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </ValidatorForm>
      )}
      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
    </div>
  );
}

export default withRouter(ActionForm);
