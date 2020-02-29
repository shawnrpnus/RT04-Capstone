import * as types from "../actions/types";

const initialState = {
  rootCategories: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_ROOT_CATEGORIES:
      return {
        ...state,
        rootCategories: action.categories
      };
    default:
      return state;
  }
}
