import * as types from "../actions/types";
import customerService from "services/customerService";

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
      customerService.removeCustomerFromLocalStorage();
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
    case types.UPDATE_CUSTOMER:
      return {
        ...state,
        loggedInCustomer: action.customer
      };
    default:
      return state;
  }
}
