import * as types from "../actions/types";

const initialState = {
  advertisements: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_ALL_ADVERTISEMENT:
      return {
        ...state,
        advertisements: action.advertisements
      };
    default:
      return state;
  }
}
