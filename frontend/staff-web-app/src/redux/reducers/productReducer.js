import * as types from "../actions/types";

const initialState = {
  currentProduct: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_PRODUCT_BY_ID:
      return {
        ...state,
        currentProduct: action.product
      };
    default:
      return state;
  }
}
