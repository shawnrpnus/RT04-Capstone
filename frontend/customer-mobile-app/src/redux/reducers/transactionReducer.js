import * as types from "../actions/types";

const initialState = {
  transactions: null,
  viewedTransaction: null,
  collections: null,
  pendingPurchases: null,
  completedPurchases: null,
  pendingCollections:  null,
  completedCollections: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_VIEWED_TXN:
      return {
        ...state,
        viewedTransaction: action.transaction
      };
    case types.RETRIEVE_TXNS:
      return {
        ...state,
        transactions: action.transactions
      };
    case types.RETRIEVE_COLLECTIONS:
      return {
        ...state,
        collections: action.collections
      };
    case types.RETRIEVE_PENDING_PURCHASES:
      return {
        ...state,
        pendingPurchases: action.transactions
      }
    case types.RETRIEVE_COMPLETED_PURCHASES:
      return {
        ...state,
        completedPurchases: action.transactions
      }
    case types.RETRIEVE_PENDING_COLLECTIONS:
      return {
        ...state,
        pendingCollections: action.transactions
      }
    case types.RETRIEVE_COMPLETED_COLLECTIONS:
      return {
        ...state,
        completedCollections: action.transactions
      }
    default:
      return state;
  }
}
