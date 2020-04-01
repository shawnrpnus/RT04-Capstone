import * as types from "../actions/types";


const initialState = {
  allRefundModeEnum: null,
  allRefundStatusEnum: null,
  allRefundProgressEnum: null,
  currRefund: null,
  allRefunds: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_IN_STORE_REFUND_RECORD:
      return {
        ...state,
        currRefund: action.currRefund
      };
    case types.UPDATE_REFUND_RECORD:
      return {
        ...state,
        currRefund: action.currRefund
      };
    case types.RETRIEVE_ALL_REFUND_MODE_ENUM_SUCCESS:
      return {
        ...state,
        allRefundModeEnum: action.allRefundModeEnum
      };
    case types.RETRIEVE_ALL_REFUND_STATUS_ENUM_SUCCESS:
      return {
        ...state,
        allRefundStatusEnum: action.allRefundStatusEnum
      };
    case types.RETRIEVE_REFUND_BY_ID:
      return {
        ...state,
        currRefund: action.currRefund
      };
    case types.RETRIEVE_ALL_REFUNDS:
      return {
        ...state,
        allRefunds: action.allRefunds
      };
    case types.RETRIEVE_ALL_REFUND_PROGRESS_ENUM_SUCCESS:
      return {
        ...state,
        allRefundProgressEnum: action.allRefundProgressEnum
      };
    default:
      return state;
  }
}
