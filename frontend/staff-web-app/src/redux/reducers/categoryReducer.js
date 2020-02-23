import * as types from "../actions/types";

const initialState = {
  allRootCategories: null,
  categoryProducts: null,
  allCategories: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_ALL_ROOT_CATEGORIES:
      return {
        ...state,
        allRootCategories: action.categories
      };
    case types.RETRIEVE_ALL_CATEGORIES:
      return {
        ...state,
        allCategories: action.categories
      };
    case types.RETRIEVE_ALL_PRODUCTS_FOR_CATEGORY:
      return {
        ...state,
        categoryProducts: action.categoryProducts
      };
    default:
      return state;
  }
}
