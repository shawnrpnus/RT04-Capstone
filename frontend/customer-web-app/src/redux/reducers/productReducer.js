import * as types from "../actions/types";

const initialState = {
  displayedProductDetails: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.DISPLAY_PRODUCTS:
      return {
        ...state,
        displayedProductDetails: action.products
      };
    default:
      return state;
  }
}
