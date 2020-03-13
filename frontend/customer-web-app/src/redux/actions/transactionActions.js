import axios from "axios";
import { dispatchErrorMapError } from "redux/actions/index";
import {
  RETRIEVE_ALL_TAGS,
  UPDATE_DISPLAYED_TRANSACTIONS,
  UPDATE_VIEWED_TRANSACTION
} from "redux/actions/types";
import {ADD_SHIPPING_ADDRESS_AT_CHECKOUT_SUCCESS} from "./types";

const jsog = require("jsog");
const TRANSACTION_BASE_URL = "/api/transaction";

export const retrieveCustomerTransactions = customerId => {
  return dispatch =>
    axios
      .get(TRANSACTION_BASE_URL + "/retrieveCustomerTransactions", {
        params: { customerId }
      })
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(updateDisplayedTransactions(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
};

const updateDisplayedTransactions = data => ({
  type: UPDATE_DISPLAYED_TRANSACTIONS,
  transactions: data
});

export const filterTransactions = (req, setFilterDrawerOpen, setIsLoading) => {
  return dispatch =>
    axios
      .post(TRANSACTION_BASE_URL + "/retrieveMatchedTransactions", req)
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(updateDisplayedTransactions(data));
        setFilterDrawerOpen(false);
        setIsLoading(false);
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
};

export const retrieveTransactionById = transactionId => {
  return dispatch =>
    axios
      .get(TRANSACTION_BASE_URL + "/retrieveTransactionById/" + transactionId)
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(updatedViewedTransaction(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
};

const updatedViewedTransaction = data => ({
  type: UPDATE_VIEWED_TRANSACTION,
  transaction: data
});

export const addShippingAddressDetailsAtCheckout = (
  addUpdateAddressRequest,
  enqueueSnackbar,
  history
) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post("/api/customer" + "/addShippingAddressAtCheckout", addUpdateAddressRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(addShippingAddressAtCheckoutSuccess(data));
        enqueueSnackbar("New Address Added", {
          variant: "success",
          autoHideDuration: 1200
        });
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        // console.log(err.response.data);
      });
  };
};

export const addShippingAddressAtCheckoutSuccess = data => ({
  type: ADD_SHIPPING_ADDRESS_AT_CHECKOUT_SUCCESS,
  currAddress: data
});
