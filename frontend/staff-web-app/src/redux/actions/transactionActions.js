import axios from "axios";
import { toast } from "react-toastify";
import * as types from "./types";
import { dispatchErrorMapError } from "./index";
import { openCircularProgress, closeCircularProgress } from "./utilActions";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const TRANSACTION_BASE_URL = "/api/transaction";
const jsog = require("jsog");

const handleRetrieveTransactions = data => ({
  type: types.RETRIEVE_TRANSACTIONS,
  transactions: data
});

export const retrieveAllTransaction = () => {
  return dispatch => {
    axios
      .get(TRANSACTION_BASE_URL + `/retrieveAllTransaction`)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveTransactions(data));
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
      });
  };
};

export const retrieveInstoreCollectionTransaction = () => {
  return dispatch => {
    axios
      .get(TRANSACTION_BASE_URL + `/retrieveInstoreCollectionTransaction`)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveTransactions(data));
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
      });
  };
};
