import * as types from "../actions/types";

const initialState = {
  displayedTransactions: null,
  viewedTransaction: null
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
    default:
      return state;
  }
}
