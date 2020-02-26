import axios from "axios";
import {
  CREATE_NEW_CUSTOMER,
  CUSTOMER_LOGIN,
  CUSTOMER_LOGOUT,
  EMAIL_SENDING,
  EMAIL_SENT,
  GET_ERRORS,
  VERIFY_FAILURE,
  VERIFY_SUCCESS
} from "./types";

const CUSTOMER_BASE_URL = "/api/customer";

const _ = require("lodash");
const jsog = require("jsog");

export const emailSending = () => ({
  type: EMAIL_SENDING
});

const emailSent = () => ({
  type: EMAIL_SENT
});

export const createNewCustomer = (createCustomerRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(CUSTOMER_BASE_URL + "/createNewCustomer", createCustomerRequest)
      .then(response => {
        dispatch(emailSent());
        const { data } = jsog.decode(response);
        dispatch(createCustomerSuccess(data));
        history.push("/account/verifyEmail");
      })
      .catch(err => {
        dispatch(emailSent());
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
        const { data } = jsog.decode(response);
        dispatch(customerLoginSuccess(data));
        history.push("/"); // TODO: update redirect path
        localStorage.setItem("customer", jsog.stringify(response.data));
      })
      .catch(err => {
        const errorMap = _.get(err, "response.data", null);
        if (errorMap) {
          dispatch(customerLoginError(errorMap));
        } else {
          console.log(err);
        }
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

// bad request(400) if expired, not found(404) if invalid, or already verified
export const verify = (verificationCode, history) => {
  return dispatch => {
    axios
      .get(CUSTOMER_BASE_URL + `/verify/${verificationCode}`)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(verificationSuccess(data));
      })
      .catch(err => {
        if (err.response.status === 404) {
          history.push("/404");
        } else {
          const errorMap = _.get(err, "response.data", null);
          if (errorMap) {
            dispatch(verificationError(errorMap));
          } else {
            console.log(err);
          }
        }
      });
  };
};

const verificationSuccess = data => ({
  type: VERIFY_SUCCESS,
  customer: data
});

const verificationError = () => ({
  type: VERIFY_FAILURE
});

export const resendVerifyEmail = (customerEmailReq, history) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + `/resendVerifyEmail`, customerEmailReq)
      .then(response => {
        dispatch(emailSent());
        history.push("/account/verifyEmail");
      })
      .catch(err => {
        const errorMap = _.get(err, "response.data", null);
        if (errorMap) {
          dispatch(resendEmailError(errorMap));
        } else {
          console.log(err);
        }
      });
  };
};

const resendEmailError = data => ({
  type: GET_ERRORS,
  errorMap: data
});
