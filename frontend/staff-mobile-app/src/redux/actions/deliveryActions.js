import axios from "axios";
import { dispatchErrorMapError } from "src/redux/actions/index";

import { SPRING_BACKEND_URL } from "src/constants/routes";
import {
  DISPLAY_RESERVATION,
  DISPLAY_UPCOMING_RESERVATIONS,
  SET_DELIVERY_ROUTE, UPDATE_VIEWED_GROUPED_STORE_ORDER, UPDATE_VIEWED_TXN
} from "src/redux/actions/types";

const jsog = require("jsog");

const DELIVERY_BASE_URL = SPRING_BACKEND_URL + "/api/delivery";

const TRANSACTION_BASE_URL = SPRING_BACKEND_URL + "/api/transaction";

export const retrieveDeliveryRoute = (staffId, setRefreshing) => {
  if (setRefreshing) setRefreshing(true);
  return dispatch => {
    axios
      .get(DELIVERY_BASE_URL + "/generateDeliveryRouteForToday", {
        params: { staffId }
      })
      .then(response => {
        setDeliveryRoute(response, dispatch);
        if (setRefreshing) {
          setRefreshing(false);
        }
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const setDeliveryRoute = (response, dispatch) => {
  const deliveryItems = jsog.decode(response.data);
  dispatch({
    type: SET_DELIVERY_ROUTE,
    deliveryItems: deliveryItems
  });
};

export const setViewedTransaction = (
  transactionId,
  redirectFunction,
  setLoading
) => {
  if (setLoading) setLoading(true);
  return dispatch => {
    axios
      .get(TRANSACTION_BASE_URL + `/retrieveTransactionById/${transactionId}`)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(updateViewedTransaction(data));
        if (redirectFunction) redirectFunction();
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

export const updateViewedGroupStoreOrder = data => ({
  type: UPDATE_VIEWED_GROUPED_STORE_ORDER,
  groupedStoreOrder: data
})
