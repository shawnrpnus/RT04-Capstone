import * as types from "../actions/types";

const initialState = {
  displayedTransactions: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_DISPLAYED_TRANSACTIONS:
      return {
        ...state,
        displayedTransactions: action.transactions
      };
    default:
      return state;
  }
}
