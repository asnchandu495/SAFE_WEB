import {
  LIST_ALL_WORKFLOW,
  CREATE_WORKFLOW_SUCCESS,
  UPDATE_WORKFLOW_SUCCESS,
  DELETE_WORKFLOW_SUCCESS,
  PUBLISH_WORKFLOW_SUCCESS,
} from "../utilits";
//Reducers
//A function that takes 2 arguments and returns application current state and action from mapStateToProps updates redux store and merge them into props components
var intialState = [];

export default function LoadWorkflowSuccess(state = intialState, action) {
  switch (action.type) {
    case LIST_ALL_WORKFLOW:
      //   if (intialState.length == 0) {
      if (intialState) {
        console.log(action);
        return (intialState = action.loadWorkflow);
      } else {
        return state;
      }
    case DELETE_WORKFLOW_SUCCESS:
      return state.filter((user) => user.id !== action.workflow);
    case CREATE_WORKFLOW_SUCCESS:
      return [{ ...action.workflow }, ...state];

    case UPDATE_WORKFLOW_SUCCESS:
      return state.map((workflow) =>
        workflow.id === action.workflow.id ? action.workflow : workflow
      );
    case PUBLISH_WORKFLOW_SUCCESS:
      return state.map((PublishWorkFlow) =>
        PublishWorkFlow.id == action.workflow.id
          ? {
              ...PublishWorkFlow,
              isActive: action.workflow.isActive,
            }
          : PublishWorkFlow
      );
    default:
      return state;
  }
}
