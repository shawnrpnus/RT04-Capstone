import * as types from "../actions/types";

const initialState = {
  allStyles: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_ALL_STYLES:
      return {
        ...state,
        allStyles: action.styles
      };
    default:
      return state;
  }
}
