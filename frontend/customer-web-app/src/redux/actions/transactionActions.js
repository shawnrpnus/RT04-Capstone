import axios from "axios";
import { dispatchErrorMapError } from "redux/actions/index";
import {
  RETRIEVE_ALL_TAGS,
  UPDATE_DISPLAYED_TRANSACTIONS,
  UPDATE_VIEWED_TRANSACTION
} from "redux/actions/types";

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
