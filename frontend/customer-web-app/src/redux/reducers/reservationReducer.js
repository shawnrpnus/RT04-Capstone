import * as types from "../actions/types";

const initialState = {
  storesWithStockStatus: null,
  prodVariantToStoreStock: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_STORES_WITH_STOCK_STATUS:
      return {
        ...state,
        storesWithStockStatus: action.storesWithStockStatus
      };
    case types.GET_PROD_VAR_STORE_STOCK_STATUS:
      return {
        ...state,
        prodVariantToStoreStock: action.prodVariantToStock
      };
    case types.CLEAR_PROD_VAR_STORE_STOCK_STATUS:
      return {
        ...state,
        prodVariantToStoreStock: {}
      };
    default:
      return state;
  }
}
