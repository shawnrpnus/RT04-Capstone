import * as types from "../actions/types";

const initialState = {
  restockOrderItems: [],
  deliveries: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_ALL_RESTOCK_ORDER_ITEM_TO_DELIVER:
      return {
        ...state,
        restockOrderItems: action.restockOrderItems
      };
    case types.RETRIEVE_ALL_DELIVERY:
      return {
        ...state,
        deliveries: action.deliveries
      };
    default:
      return state;
  }
}
