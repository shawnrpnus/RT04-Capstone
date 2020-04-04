import * as types from "../actions/types";

const initialState = {
  transactions: null,
  viewedTransaction: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_VIEWED_TXN:
      return {
        ...state,
        viewedTransaction: action.transaction
      }
    case types.RETRIEVE_TXNS:
      return {
        ...state,
        transactions: action.transactions
      }
    default:
      return state;
  }
}
