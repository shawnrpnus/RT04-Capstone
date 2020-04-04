import * as types from "../actions/types";

const initialState = {
  viewedTransaction: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_VIEWED_TXN:
      return {
        ...state,
        viewedTransaction: action.transaction
      }
    default:
      return state;
  }
}
