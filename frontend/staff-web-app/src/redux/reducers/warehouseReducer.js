import * as types from "../actions/types";

const initialState = {
  currentProductStock: null,
  allProductStock: null,
  crudAction: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_PRODUCT_STOCK:
      return {
        ...state,
        currentProductStock: action.productStockEntity
      };
    case types.UPDATE_PRODUCT_STOCK_QTY:
      return {
        ...state,
        allProductStock: action.productStockEntity
      };
    default:
      return state;
  }
}