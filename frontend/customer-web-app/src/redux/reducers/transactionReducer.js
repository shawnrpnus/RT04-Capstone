import * as types from "../actions/types";

const initialState = {
  displayedTransactions: null,
  viewedTransaction: null,
  currAddress: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_DISPLAYED_TRANSACTIONS:
      return {
        ...state,
        displayedTransactions: action.transactions
      };
    case types.UPDATE_VIEWED_TRANSACTION:
      return {
        ...state,
        viewedTransaction: action.transaction
      };
    case types.ADD_SHIPPING_ADDRESS_AT_CHECKOUT_SUCCESS:
      return {
        ...state,
        currAddress: action.currAddress
      };
    default:
      return state;
  }
}
