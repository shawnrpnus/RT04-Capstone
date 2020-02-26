import * as types from "../actions/types";

const initialState = {
  registeredCustomer: null,
  loggedInCustomer: null,
  isSendingEmail: false,
  verificationStatus: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_NEW_CUSTOMER:
      return {
        ...state,
        registeredCustomer: action.customer
      };
    case types.CUSTOMER_LOGIN:
      return {
        ...state,
        registeredCustomer: {},
        loggedInCustomer: action.customer
      };
    case types.VERIFY_SUCCESS:
      return {
        ...state,
        registeredCustomer: {},
        loggedInCustomer: action.customer,
        verificationStatus: "SUCCESS"
      };
    case types.VERIFY_FAILURE:
      return {
        ...state,
        verificationStatus: "FAILURE"
      };
    case types.CUSTOMER_LOGOUT:
      return initialState;
    case types.EMAIL_SENDING:
      return {
        ...state,
        isSendingEmail: true
      };
    case types.EMAIL_SENT:
      return {
        ...state,
        isSendingEmail: false
      };
    default:
      return state;
  }
}
