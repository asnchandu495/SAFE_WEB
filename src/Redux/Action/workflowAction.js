import {
  LIST_ALL_WORKFLOW,
  CREATE_WORKFLOW_SUCCESS,
  UPDATE_WORKFLOW_SUCCESS,
  DELETE_WORKFLOW_SUCCESS,
} from "../utilits";

import WorkflowService from "../../services/workflowService";

const WorkflowApi = new WorkflowService();

export function LoadWorkflowSuccess(loadWorkflow) {
  return { type: LIST_ALL_WORKFLOW, loadWorkflow };
}

export function CreateWorkflowSuccess(createworkflow) {
  return {
    type: CREATE_WORKFLOW_SUCCESS,
    createworkflow,
  };
}
export function updateWorkflowSuccess(workflow) {
  return {
    type: UPDATE_WORKFLOW_SUCCESS,
    workflow,
  };
}

export function deleteWorkflowSuccess(workflow) {
  return {
    type: DELETE_WORKFLOW_SUCCESS,
    workflow,
  };
}

export function loadWorkflow() {
  return function (dispatch) {
    return WorkflowApi.ListAllWorkflow()
      .then((data) => {
        dispatch(LoadWorkflowSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function createWorkflowData(data) {
  return function (dispatch) {
    return WorkflowApi.CreateWorkflow(data)
      .then((response) => {
        data.id = response.id;
        dispatch(CreateWorkflowSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function updateWorkflowData(data) {
  return function (dispatch) {
    return WorkflowApi.updateWorkflow(data)
      .then((data) => {
        dispatch(updateWorkflowSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function deleteWorkflowData(data) {
  return function (dispatch) {
    return WorkflowApi.deleteWorflow(data)
      .then((data) => {
        dispatch(deleteWorkflowSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
