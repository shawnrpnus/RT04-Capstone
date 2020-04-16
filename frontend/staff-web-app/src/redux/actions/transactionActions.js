import axios from "axios";
import { toast } from "react-toastify";
import * as types from "./types";
import { dispatchErrorMapError } from "./index";
import { openCircularProgress, closeCircularProgress } from "./utilActions";
import { RETRIEVE_TRANSACTION_BY_ORDER_NUMBER_SUCCESS } from "./types";
import { RETRIEVE_TRANSACTION_BY_TRANSACTION_ID_SUCCESS } from "./types";
import { CONFIRM_RECEIVED_TRANSACTION } from "./types";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const TRANSACTION_BASE_URL = "/api/transaction";
const jsog = require("jsog");

const handleRetrieveTransactions = (data) => ({
  type: types.RETRIEVE_TRANSACTIONS,
  transactions: data,
});

export const retrieveAllTransaction = () => {
  return (dispatch) => {
    axios
      .get(TRANSACTION_BASE_URL + `/retrieveAllTransactions`)
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveTransactions(data));
      })
      .catch((err) => {
        if (err.response && err.response.data)
          toast.error(err.response.data.errorMessage, {
            position: toast.POSITION.TOP_CENTER,
          });
      });
  };
};

export const retrieveAllTransactionByStoreId = (storeId) => {
  return (dispatch) => {
    axios
      .get(TRANSACTION_BASE_URL + `/retrieveAllStoreTransactions`, {
        params: { storeId },
      })
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveTransactions(data));
      })
      .catch((err) => {
        if (err.response && err.response.data)
          toast.error(err.response.data.errorMessage, {
            position: toast.POSITION.TOP_CENTER,
          });
      });
  };
};

export const retrieveAllTransactionByStoreToCollectId = (storeId) => {
  return (dispatch) => {
    axios
      .get(TRANSACTION_BASE_URL + `/retrieveAllStoreToCollectTransactions`, {
        params: { storeId },
      })
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveTransactions(data));
      })
      .catch((err) => {
        if (err.response && err.response.data)
          toast.error(err.response.data.errorMessage, {
            position: toast.POSITION.TOP_CENTER,
          });
      });
  };
};

export const retrieveTransactionToSendForDelivery = () => {
  return (dispatch) => {
    axios
      .get(TRANSACTION_BASE_URL + `/retrieveTransactionToSendForDelivery`)
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveTransactions(data));
      })
      .catch((err) => {
        console.log(err);
        // toast.error(err.response.data, {
        //   position: toast.POSITION.TOP_CENTER
        // });
      });
  };
};

export const retrieveTransactionByQRCode = (transactionId, storeId) => {
  return (dispatch) => {
    axios
      .get(
        TRANSACTION_BASE_URL +
          `/retrieveTransactionByQRCode/${transactionId}/${storeId}`
      )
      .then((response) => {
        const { data } = jsog.decode(response);
        console.log(data);
        dispatch(retrieveTransactionByTransactionIdSuccess(data));
      })
      .catch((err) => {
        // console.log(err);
        dispatchErrorMapError(err, dispatch);
        toast.error(err.response.data.errorMessage.toString(), {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };
};

export const retrieveTransactionByTransactionIdSuccess = (data) => ({
  type: RETRIEVE_TRANSACTION_BY_TRANSACTION_ID_SUCCESS,
  transaction: data,
});

export const confirmReceivedTransaction = (transactionId) => {
  return (dispatch) => {
    axios
      .post(TRANSACTION_BASE_URL + "/confirmReceivedTransaction", transactionId)
      .then((response) => {
        const { data } = jsog.decode(response);
        console.log(data);
        dispatch(confirmReceivedTransactionSuccess(data));
        toast.success("Thank you for shopping with us!", {
          position: toast.POSITION.TOP_CENTER,
        });
      })
      .catch((err) => {
        // console.log(err);
        dispatchErrorMapError(err, dispatch);
        toast.error(err.response.data.errorMessage.toString(), {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };
};

export const confirmReceivedTransactionSuccess = (data) => ({
  type: CONFIRM_RECEIVED_TRANSACTION,
  transaction: data,
});
