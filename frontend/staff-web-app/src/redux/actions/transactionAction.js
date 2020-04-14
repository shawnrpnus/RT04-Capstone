import axios from "axios";
import { dispatchErrorMapError } from "./index";
import { RETRIEVE_TRANSACTION_BY_ORDER_NUMBER_SUCCESS } from "./types";
import {toast} from "react-toastify";

axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;
const TRANSACTION_BASE_URL = "/api/transaction";
const jsog = require("jsog");

export const retrieveTransactionByOrderNumber = orderNumber => {
  return dispatch =>
    axios
      .get(
        TRANSACTION_BASE_URL +
          "/retrieveTransactionByOrderNumber/" +
          orderNumber
      )
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(retrieveTransactionByOrderNumberSuccess(data));
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage.toString(), {
          position: toast.POSITION.TOP_CENTER
        });
        dispatchErrorMapError(err, dispatch);
      });
};

export const retrieveTransactionByOrderNumberSuccess = data => ({
  type: RETRIEVE_TRANSACTION_BY_ORDER_NUMBER_SUCCESS,
  transaction: data
});
