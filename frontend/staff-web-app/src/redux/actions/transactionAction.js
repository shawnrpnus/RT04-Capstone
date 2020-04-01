import axios from "axios";
import {dispatchErrorMapError} from "./index";
import {RETRIEVE_TRANSACTION_BY_ORDER_NUMBER_SUCCESS} from "./types";

axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;
const TRANSACTION_BASE_URL = "/api/transaction";
const jsog = require("jsog");

export const retrieveTransactionByOrderNumber = orderNumber => {
  return dispatch =>
    axios
      .get(TRANSACTION_BASE_URL + "/retrieveTransactionByOrderNumber/" + orderNumber)
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(retrieveTransactionByOrderNumberSuccess(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
};

export const retrieveTransactionByOrderNumberSuccess = data => ({
  type: RETRIEVE_TRANSACTION_BY_ORDER_NUMBER_SUCCESS,
  transaction: data
});
