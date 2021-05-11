import {
  LIST_ALL_WORKFLOW,
  CREATE_WORKFLOW_SUCCESS,
  UPDATE_WORKFLOW_SUCCESS,
  DELETE_WORKFLOW_SUCCESS,
  PUBLISH_WORKFLOW_SUCCESS,
} from "../utilits";

import WorkflowService from "../../services/workflowService";

const WorkflowApi = new WorkflowService();

export function LoadWorkflowSuccess(loadWorkflow) {
  return { type: LIST_ALL_WORKFLOW, loadWorkflow };
}

export function CreateWorkflowSuccess(workflow) {
  return {
    type: CREATE_WORKFLOW_SUCCESS,
    workflow,
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

export function PublishWorkFlowSuccess(workflow) {
  return { type: PUBLISH_WORKFLOW_SUCCESS, workflow };
}

export function loadWorkflow(data) {
  return function (dispatch) {
    return WorkflowApi.ListAllWorkflow(data)
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
      .then((response) => {
        dispatch(updateWorkflowSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function deleteWorkflowData(data) {
  return function (dispatch) {
    return WorkflowApi.deleteWorkflow(data)
      .then((response) => {
        dispatch(deleteWorkflowSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function PublishWorkflow(data) {
  return function (dispatch) {
    return WorkflowApi.PublishWorkflow(data)
      .then((response) => {
        dispatch(PublishWorkFlowSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
