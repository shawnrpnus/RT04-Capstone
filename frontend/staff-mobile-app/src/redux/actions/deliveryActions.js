import axios from "axios";
import { dispatchErrorMapError } from "src/redux/actions/index";

import { SPRING_BACKEND_URL } from "src/constants/routes";
import {
  DISPLAY_RESERVATION,
  DISPLAY_UPCOMING_RESERVATIONS,
  SET_DELIVERY_ROUTE,
  UPDATE_VIEWED_GROUPED_STORE_ORDER,
  UPDATE_VIEWED_TXN
} from "src/redux/actions/types";
import { set } from "react-native-reanimated";

const jsog = require("jsog");

const DELIVERY_BASE_URL = SPRING_BACKEND_URL + "/api/delivery";

const TRANSACTION_BASE_URL = SPRING_BACKEND_URL + "/api/transaction";

export const retrieveDeliveryRoute = (
  staffId,
  setRefreshing,
  setViewedItem
) => {
  if (setRefreshing) setRefreshing(true);
  return dispatch => {
    axios
      .get(DELIVERY_BASE_URL + "/generateDeliveryRouteForToday", {
        params: { staffId }
      })
      .then(response => {
        const deliveryItems = jsog.decode(response.data);
        dispatch(setDeliveryRoute(deliveryItems));
        if (setViewedItem) {
          setViewedItem(deliveryItems);
        }
        if (setRefreshing) {
          setRefreshing(false);
        }
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const setDeliveryRoute = deliveryItems => ({
  type: SET_DELIVERY_ROUTE,
  deliveryItems: deliveryItems
});

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
});

export const confirmGroupedStoreOrderDelivery = (
  transactionIds,
  inStoreRestockOrderItemIds,
  staffId,
  storeId,
  setLoading
) => {
  setLoading(true);
  return dispatch => {
    const restockPromise = axios.post(
      DELIVERY_BASE_URL + "/receiveRestockOrderItemThroughDelivery",
      {
        inStoreRestockOrderItemIds
      }
    );
    const transactionPromise = axios.post(
      DELIVERY_BASE_URL + "/receiveTransactionThroughDelivery",
      {
        transactionIds
      }
    );
    Promise.all([restockPromise, transactionPromise])
      .then(_ => {
        const setViewedGroupStoreOrder = deliveryItems => {
          const groupedStoreOrder = deliveryItems.find(
            item => item.store && item.store.storeId === storeId
          );
          dispatch(updateViewedGroupStoreOrder(groupedStoreOrder));
          alert("Delivery confirmed");
        };
        dispatch(
          retrieveDeliveryRoute(staffId, setLoading, setViewedGroupStoreOrder)
        );
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  };
};

export const confirmCustomerDirectDelivery = (
  transactionIds,
  staffId,
  setLoading
) => {
  return dispatch => {
    axios
      .post(DELIVERY_BASE_URL + "/receiveTransactionThroughDelivery", {
        transactionIds
      })
      .then(_ => {
        const setViewedTransaction = deliveryItems => {
          const transaction = deliveryItems.find(
            item =>
              item.transactionId && item.transactionId === transactionIds[0]
          );
          dispatch(updateViewedTransaction(transaction));
          alert("Delivery confirmed");
        };
        dispatch(
          retrieveDeliveryRoute(staffId, setLoading, setViewedTransaction)
        );
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };
};
