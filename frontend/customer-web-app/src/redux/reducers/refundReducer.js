import * as types from "../actions/types";

const initialState = {
  refunds: null,
  currRefund: null,
  refundsToCheck : null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_REFUNDS_BY_CUSTOMER_ID:
      return {
        ...state,
        refunds: action.refunds
      };
    case types.RETRIEVE_REFUND_BY_ID:
      return {
        ...state,
        currRefund: action.currRefund
      };
    case types.CREATE_ONLINE_REFUND_RECORD:
      return {
        ...state,
        currRefund: action.currRefund
      };
    case types.GET_REFUND_BY_TRANSACTION_ID:
      return {
        ...state,
        refundsToCheck: action.refundsToCheck
      };
    default:
      return state;
  }
}
