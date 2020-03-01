import * as types from "../actions/types";

const initialState = {
  priceRange: null,
  checkedColours: null,
  checkedSizes: null,
  checkedTags: null,
  selectedSort: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_PRICE_RANGE:
      return {
        ...state,
        priceRange: action.data
      };
    case types.SET_CHECKED_COLOURS:
      return {
        ...state,
        checkedColours: action.data
      };
    case types.SET_CHECKED_SIZES:
      return {
        ...state,
        checkedSizes: action.data
      };
    case types.SET_CHECKED_TAGS:
      return {
        ...state,
        checkedTags: action.data
      };
    case types.SET_SELECTED_SORT:
      return {
        ...state,
        selectedSort: action.data
      };
    default:
      return state;
  }
}
