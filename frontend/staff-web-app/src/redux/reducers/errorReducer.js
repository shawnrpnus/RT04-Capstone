import * as types from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_ERRORS:
      return action.errorMap;
    case types.CLEAR_ERRORS:
      return {};
    case types.UPDATE_ERRORS:
      return {
        ...action.errorMap,
        ...state
      };
    default:
      return state;
  }
}
