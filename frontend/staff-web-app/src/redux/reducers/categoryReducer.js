import * as types from "../actions/types";

const initialState = {
  allCategories: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_ALL_CATEGORIES:
      return {
        ...state,
        allCategories: action.categories
      };
    default:
      return state;
  }
}
