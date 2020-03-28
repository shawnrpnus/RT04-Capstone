import * as types from "../actions/types";

const initialState = {
  transactions: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_TRANSACTIONS:
      return {
        ...state,
        transactions: action.transactions
      };
    default:
      return state;
  }
}
