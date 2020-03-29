import * as types from "../actions/types";

const initialState = {
  allTransactions: null,
  transaction: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_TRANSACTION_BY_ORDER_NUMBER_SUCCESS:
      return {
        ...state,
        transaction: action.transaction
      };
    default:
      return state;
  }
}
