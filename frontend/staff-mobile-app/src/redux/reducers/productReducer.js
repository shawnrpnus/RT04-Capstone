import * as types from "../actions/types";

const initialState = {
  displayedProductVariant: null,
  allSKUs: null,
  stocks: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.ALL_SKU:
      return {
        ...state,
        allSKUs: action.SKUs
      }
    case types.DISPLAY_PRODUCT_VARIANT:
      return {
        ...state,
        displayedProductVariant: action.productVariant
      }
    case types.DISPLAY_STOCKS:
      return {
        ...state,
        stocks: action.stocks
      }
    default:
      return state;
  }
}
