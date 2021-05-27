import { PUBLISH_FAQ_SUCCESS, LOAD_FAQ_PUBLISH } from "../utilits";
var intialState = [];
export default function loadAssignFaqReducer(state = intialState, action) {
  console.log(action);
  switch (action.type) {
    case PUBLISH_FAQ_SUCCESS:
      return state.map((FaQ) =>
        FaQ.id === action.FaQ.id
          ? {
              ...FaQ,
              isSaveAsDraft: action.FaQ.isSaveAsDraft,
            }
          : FaQ
      );

    case LOAD_FAQ_PUBLISH:
      //   if (intialState.length == 0) {
      if (intialState) {
        console.log(action);
        return (intialState = action.loadFaq);
      } else {
        return state;
      }

    default:
      return state;
  }
}
