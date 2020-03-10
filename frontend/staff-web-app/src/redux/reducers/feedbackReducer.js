import * as types from "../actions/types";

const initialState = {
  feedbacks: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_ALL_FEEDBACK:
      return {
        ...state,
        feedbacks: action.feedbacks
      };
    default:
      return state;
  }
}
