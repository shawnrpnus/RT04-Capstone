import * as types from "../actions/types";

const initialState = {
  currentProduct: null,
  products: null
};

export default function(state = initialState, action) {
  switch (action.type) {
  case types.CREATE_PRODUCT:
        return {
          ...state,
          currentProduct: action.product
        };
    case types.RETRIEVE_PRODUCT_BY_ID:
      return {
        ...state,
        currentProduct: action.product
      };
    case types.RETRIEVE_ALL_PRODUCTS:
      return {
        ...state,
        products: action.products
      };
    case types.RETRIEVE_PRODUCTS_DETAILS:
      return {
        ...state,
        products: action.products
      };
    default:
      return state;
  }
}
