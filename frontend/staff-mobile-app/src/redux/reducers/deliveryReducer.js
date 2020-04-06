import * as types from "../actions/types";

const initialState = {
  deliveryList: null,
  viewedGroupedStoreOrder: null,
  viewedTransaction: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_DELIVERY_ROUTE:
      return {
        ...state,
        deliveryList: action.deliveryItems
      };
    case types.UPDATE_VIEWED_TXN:
      return {
        ...state,
        viewedTransaction: action.transaction
      };
    case types.UPDATE_VIEWED_GROUPED_STORE_ORDER:
      return {
        ...state,
        viewedGroupedStoreOrder: action.groupedStoreOrder
      };
    default:
      return state;
  }
}
