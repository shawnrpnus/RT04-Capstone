import { SPRING_BACKEND_URL } from "src/constants/routes";
import {
  RETRIEVE_COLLECTIONS, RETRIEVE_COMPLETED_COLLECTIONS, RETRIEVE_COMPLETED_PURCHASES, RETRIEVE_PENDING_COLLECTIONS,
  RETRIEVE_PENDING_PURCHASES,
  RETRIEVE_TXNS,
  UPDATE_VIEWED_TXN
} from "src/redux/actions/types";
import axios from "axios";

const jsog = require("jsog");

const TRANSACTION_BASE_URL = SPRING_BACKEND_URL + "/api/transaction";

export const setViewedTransaction = (
  transactionId,
  redirectFunction,
  setLoading,
  onFinish
) => {
  if (setLoading) setLoading(true);
  return dispatch => {
    axios
      .get(TRANSACTION_BASE_URL + `/retrieveTransactionById/${transactionId}`)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(updateViewedTransaction(data));
        if (redirectFunction) redirectFunction();
        if (onFinish) onFinish();
        if (setLoading) setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
};

const updateViewedTransaction = data => ({
  type: UPDATE_VIEWED_TXN,
  transaction: data
});

export const retrieveCustomerPendingPurchases = (customerId, setLoading) => {
  if (setLoading) setLoading(true);

  return dispatch => {
    axios
      .get(TRANSACTION_BASE_URL + `/retrieveCustomerPendingInStoreTransactions`, {
        params: { customerId }
      })
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(updatePendingPurchases(data));
        if (setLoading) setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
};

const updatePendingPurchases = data => ({
  type: RETRIEVE_PENDING_PURCHASES,
  transactions: data
});

export const retrieveCustomerCompletedPurchases = (customerId, setLoading) => {
  if (setLoading) setLoading(true);

  return dispatch => {
    axios
        .get(TRANSACTION_BASE_URL + `/retrieveCustomerCompletedInStoreTransactions`, {
          params: { customerId }
        })
        .then(response => {
          const { data } = jsog.decode(response);
          dispatch(updatedCompletedPurchases(data));
          if (setLoading) setLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
  };
};

const updatedCompletedPurchases = data => ({
  type: RETRIEVE_COMPLETED_PURCHASES,
  transactions: data
});



export const retrieveCustomerInStoreCollectionTransactions = (
  customerId,
  setLoading
) => {
  if (setLoading) setLoading(true);

  return dispatch => {
    axios
      .get(
        TRANSACTION_BASE_URL + `/retrieveCustomerInStoreCollectionTransactions`,
        {
          params: { customerId }
        }
      )
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(updateCollections(data));
        if (setLoading) setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
};

const updateCollections = data => ({
  type: RETRIEVE_COLLECTIONS,
  collections: data
});

export const retrieveCustomerPendingCollections = (customerId, setLoading) => {
  if (setLoading) setLoading(true);

  return dispatch => {
    axios
        .get(TRANSACTION_BASE_URL + `/retrieveCustomerPendingInStoreCollections`, {
          params: { customerId }
        })
        .then(response => {
          const { data } = jsog.decode(response);
          dispatch(updatePendingCollections(data));
          if (setLoading) setLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
  };
};

const updatePendingCollections = data => ({
  type: RETRIEVE_PENDING_COLLECTIONS,
  transactions: data
});

export const retrieveCustomerCompletedCollections = (customerId, setLoading) => {
  if (setLoading) setLoading(true);

  return dispatch => {
    axios
        .get(TRANSACTION_BASE_URL + `/retrieveCustomerCompletedInStoreCollections`, {
          params: { customerId }
        })
        .then(response => {
          const { data } = jsog.decode(response);
          dispatch(updateCompletedCollections(data));
          if (setLoading) setLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
  };
};

const updateCompletedCollections = data => ({
  type: RETRIEVE_COMPLETED_COLLECTIONS,
  transactions: data
});
