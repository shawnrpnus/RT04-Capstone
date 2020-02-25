import * as types from "../actions/types";

const initialState = {
  registeredCustomer: null,
  loggedInCustomer: null
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
        loggedInCustomer: action.customer
      };
    case types.CUSTOMER_LOGOUT:
      return initialState;
    default:
      return state;
  }
}
