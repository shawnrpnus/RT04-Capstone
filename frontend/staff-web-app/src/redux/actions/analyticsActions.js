import axios from "axios";
import { dispatchErrorMapError } from "./index";
import { RETRIEVE_SALES_BY_DAY, RETRIEVE_TRANSACTION_BY_ORDER_NUMBER_SUCCESS } from "./types";

axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;
const TRANSACTION_BASE_URL = "/api/transaction";
const jsog = require("jsog");

export const retrieveSalesByDay = (fromDateString, toDateString, fromStoreIds, onlineSelected) => {
  return dispatch =>
    axios
      .post(
        TRANSACTION_BASE_URL +
          "/retrieveSalesByDay", {fromDateString, toDateString, fromStoreIds, onlineSelected}
      )
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(retrieveSalesByDaySuccess(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
};

export const retrieveSalesByDaySuccess = data => ({
  type: RETRIEVE_SALES_BY_DAY,
  salesByDay: data
});
