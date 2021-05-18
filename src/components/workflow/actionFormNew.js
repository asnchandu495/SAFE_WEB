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

function ActionFormNew(props) {
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
  const [stateContextMenuText, setStateContextMenuText] =
    useState(initialState);
  const [currentEditor, setCurrentEditor] = useState();
  const [selectedActivityDetails, setSelectedActivityDetails] = useState();
  const [currentInputText, setCurrentInputText] = useState();

  useEffect(() => {
    setComponentLoadder(true);
    workflowApiCall
      .getOptionsByActivityId(activityId)
      .then((result) => {
        if (result.length > 0) {
          let thisFormData = result.find(
            (act) =>
              act.uniqueActivityId == props.selectedAction.uniqueActivityId
          );
          if (thisFormData) {
            let actionListFromAPI = thisFormData.configurationDataList;
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
            setFormData({
              id: thisFormData.id,
              uniqueActivityId: thisFormData.uniqueActivityId,
              name: thisFormData.name,
              aimWorkflowId: thisFormData.aimWorkflowId,
              parentActivityId: thisFormData.parentActivityId,
              configurationDataList: newFormCollection,
            });
            setComponentLoadder(false);
            props.setReloadPage("NO");
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
            props.setReloadPage("NO");
          }
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
          props.setReloadPage("NO");
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
          }, 10000);
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
          }, 10000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    }
  }

  const handleClickContextMenu = (event) => {
    event.preventDefault();
    setStateContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleClickContextMenuText = (event) => {
    event.preventDefault();
    setStateContextMenuText({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleCloseContextMenu = () => {
    setStateContextMenu(initialState);
  };

  const handleCloseContextMenuText = () => {
    setStateContextMenuText(initialState);
  };

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

  const handleClickContextMenuOptionText = (opt, index, name) => {
    let textToInsert = opt;
    let cursorPosition = currentInputText.target.selectionStart;
    let textBeforeCursorPosition = currentInputText.target.value.substring(
      0,
      cursorPosition
    );
    let textAfterCursorPosition = currentInputText.target.value.substring(
      cursorPosition,
      currentInputText.target.value.length
    );
    currentInputText.target.value =
      textBeforeCursorPosition + textToInsert + textAfterCursorPosition;

    const list = {
      ...formData,
      configurationDataList: [
        ...formData.configurationDataList.map((con, conIndex) =>
          conIndex == index
            ? { ...con, [name]: currentInputText.target.value }
            : con
        ),
      ],
    };
    setFormData(list);
    setStateContextMenu(initialState);
  };

  function gotoPreviousPage() {
    props.history.push(`/workflow/${workflowId}/activities`);
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
                              <Grid
                                item
                                xs={9}
                                onContextMenu={handleClickContextMenuText}
                              >
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
                                  onFocus={(e) => {
                                    setCurrentInputText(e);
                                  }}
                                />
                                <Menu
                                  keepMounted
                                  open={stateContextMenuText.mouseY !== null}
                                  onClose={handleCloseContextMenuText}
                                  anchorReference="anchorPosition"
                                  anchorPosition={
                                    stateContextMenuText.mouseY !== null &&
                                    stateContextMenuText.mouseX !== null
                                      ? {
                                          top: stateContextMenuText.mouseY,
                                          left: stateContextMenuText.mouseX,
                                        }
                                      : undefined
                                  }
                                >
                                  {act.inputIntelliSenseOptions.length > 0 ? (
                                    act.inputIntelliSenseOptions.map((opt) => {
                                      return (
                                        <MenuItem
                                          onClick={() =>
                                            handleClickContextMenuOptionText(
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
    </>
  );
}

export default withRouter(ActionFormNew);