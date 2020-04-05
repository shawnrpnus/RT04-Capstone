import axios from "axios";
import {dispatchErrorMapError} from "./index";
import * as types from "./types";
import {CREATE_ONLINE_REFUND_RECORD} from "./types";


axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const REFUND_BASE_URL = "/api/refund";

const _ = require("lodash");
const jsog = require("jsog");


export const createOnlineRefundRequest = (
  refundRequest,
  history,
  enqueueSnackbar
) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(REFUND_BASE_URL + "/createRefundRecord", refundRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        console.log(data);
        dispatch(createOnlineRefundSuccess(data));
        history.push(`/account/profile/viewRefund/${data.refundId}`);
        enqueueSnackbar("Refund request created", {
          variant: "success",
          autoHideDuration: 1200
        });
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        console.log(err.response.data);
      });
  };
};

export const createOnlineRefundSuccess = data => ({
  type: CREATE_ONLINE_REFUND_RECORD,
  currRefund: data
});

export const retrieveRefundsByCustomerId = customerId => {
  return dispatch => {
    axios
      .get(REFUND_BASE_URL + `/retrieveRefundsByCustomerId/${customerId}`)
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(retrieveRefundsByCustomerIdSuccess(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const retrieveRefundsByCustomerIdSuccess = data => ({
  type: types.GET_REFUNDS_BY_CUSTOMER_ID,
  refunds: data
});


export const retrieveRefundById = (refundId) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(REFUND_BASE_URL + `/retrieveRefundById/${refundId}`)
      .then(response => {
        const data = jsog.decode(response.data);
        console.log(data);
        dispatch(retrieveRefundByIdSuccess(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const retrieveRefundByIdSuccess = data => ({
  type: types.RETRIEVE_REFUND_BY_ID,
  currRefund: data
});
