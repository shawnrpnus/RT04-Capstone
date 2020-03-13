import * as types from "../actions/types";

const initialState = {
  displayedProductVariant: null,
  allSKUs: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.ALL_SKU:
      return {
        ...state,
        allSKUs: action.SKUs
      }
    default:
      return state;
  }
}
