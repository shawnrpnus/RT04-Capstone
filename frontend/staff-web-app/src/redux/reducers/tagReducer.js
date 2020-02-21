import * as types from "../actions/types";

const initialState = {
  createdUpdatedTag: null,
  allTags: null,
  crudAction: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_TAG:
      return {
        ...state,
        createdUpdatedTag: action.tag
      };
    case types.RETRIEVE_ALL_TAGS:
      return {
        ...state,
        allTags: action.allTags
      };
    default:
      return state;
  }
}
