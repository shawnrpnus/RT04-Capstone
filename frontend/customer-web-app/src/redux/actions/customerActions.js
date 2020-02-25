import axios from "axios";
import {
  CREATE_NEW_CUSTOMER,
  CUSTOMER_LOGIN,
  CUSTOMER_LOGOUT,
  GET_ERRORS,
  VERIFY_ERROR,
  VERIFY_SUCCESS
} from "./types";

const CUSTOMER_BASE_URL = "/api/customer";

const _ = require("lodash");

export const createNewCustomer = (createCustomerRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(CUSTOMER_BASE_URL + "/createNewCustomer", createCustomerRequest)
      .then(response => {
        dispatch(createCustomerSuccess(response.data));
        history.push("/account/verifyEmail");
      })
      .catch(err => {
        dispatch(createCustomerError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const createCustomerSuccess = data => ({
  type: CREATE_NEW_CUSTOMER,
  customer: data
});

const createCustomerError = data => ({
  type: GET_ERRORS,
  errorMap: data
});

export const customerLogin = (customerLoginRequest, history) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/login", customerLoginRequest)
      .then(response => {
        dispatch(customerLoginSuccess(response.data));
        history.push("/"); // TODO: update redirect path
      })
      .catch(err => {
        dispatch(customerLoginError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const customerLoginSuccess = data => ({
  type: CUSTOMER_LOGIN,
  customer: data
});

const customerLoginError = data => ({
  type: GET_ERRORS,
  errorMap: data
});

export const customerLogout = () => ({
  type: CUSTOMER_LOGOUT
});

export const verify = verificationCode => {
  return dispatch => {
    axios
      .get(CUSTOMER_BASE_URL + `/verify/${verificationCode}`)
      .then(response => {
        dispatch(verificationSuccess(response.data));
      })
      .catch(err => {
        const errorMap = _.get(err, "response.data", null);
        if (errorMap) {
          dispatch(verificationError(errorMap));
        } else {
          console.log(err);
        }
      });
  };
};

const verificationSuccess = data => ({
  type: VERIFY_SUCCESS,
  customer: data
});

const verificationError = data => ({
  type: GET_ERRORS,
  errorMap: data
});

export const resendVerifyEmail = (customerEmailReq, history, emailSent) => {
  return dispatch => {
    axios
      .get(CUSTOMER_BASE_URL + `/resendVerifyEmail`)
      .then(response => {
        dispatch(verificationSuccess(response.data));
        emailSent();
        history.push("/account/verifyEmail");
      })
      .catch(err => {
        const errorMap = _.get(err, "response.data", null);
        if (errorMap) {
          dispatch(verificationError(errorMap));
        } else {
          console.log(err);
        }
      });
  };
};
