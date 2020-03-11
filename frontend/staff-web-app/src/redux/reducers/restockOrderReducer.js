import * as types from "../actions/types";

const initialState = {
  restockOrders: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_ALL_RESTOCK_ORDER:
      return {
        ...state,
        restockOrders: action.restockOrders
      };
    default:
      return state;
  }
}
