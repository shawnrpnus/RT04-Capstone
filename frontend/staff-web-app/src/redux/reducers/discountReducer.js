import * as types from "../actions/types";

const initialState = {
  discounts: [],
  discount: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_ALL_DISCOUNT:
      return {
        ...state,
        discounts: action.discounts
      };
    case types.RETRIEVE_DISCOUNT_BY_ID:
      return {
        ...state,
        discount: action.discount
      };
    default:
      return state;
  }
}
