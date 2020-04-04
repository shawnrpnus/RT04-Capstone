import { SPRING_BACKEND_URL } from "src/constants/routes";
import { UPDATE_VIEWED_TXN } from "src/redux/actions/types";
import axios from "axios";


const jsog = require("jsog");

const TRANSACTION_BASE_URL = SPRING_BACKEND_URL + "/api/transaction";

export const setViewedTransaction = (transactionId, redirectFunction) => {
  return dispatch => {
    axios
      .get(TRANSACTION_BASE_URL + `/retrieveTransactionById/${transactionId}`)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(updateViewedTransaction(data));
        if (redirectFunction) redirectFunction();
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
