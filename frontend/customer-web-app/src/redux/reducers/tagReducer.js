import * as types from "../actions/types";

const initialState = {
  allTags: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_ALL_TAGS:
      return {
        ...state,
        allTags: action.tags
      };
    default:
      return state;
  }
}
