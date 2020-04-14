import * as types from "../actions/types";

const initialState = {
  allTransactions: null,
  transactions: [],
  transaction: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_TRANSACTION_BY_ORDER_NUMBER_SUCCESS:
      return {
        ...state,
        transaction: action.transaction
      };
    case types.RETRIEVE_TRANSACTIONS:
      return {
        ...state,
        transactions: action.transactions
      };
    case types.RETRIEVE_TRANSACTION_BY_TRANSACTION_ID_SUCCESS:
      return {
        ...state,
        transaction: action.transaction
      };
    case types.CONFIRM_RECEIVED_TRANSACTION:
      return {
        ...state,
        transaction: action.transaction
      };
    default:
      return state;
  }
}
