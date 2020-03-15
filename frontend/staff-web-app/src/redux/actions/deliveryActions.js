import axios from "axios";
import { toast } from "react-toastify";
import * as types from "./types";
import { dispatchErrorMapError } from "./index";
import { openCircularProgress, closeCircularProgress } from "./utilActions";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const RESTOCK_ORDER_BASE_URL = "/api/inStoreRestockOrder";
const DELIVERY_BASE_URL = "/api/delivery";
const jsog = require("jsog");

// NOTE: Start delivery
const handleRetrieveAllDelivery = data => ({
  type: types.RETRIEVE_ALL_DELIVERY,
  deliveries: data
});

export const retrieveAllDelivery = () => {
  return dispatch => {
    axios
      .get(DELIVERY_BASE_URL + `/retrieveAllDelivery`)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveAllDelivery(data));
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const confirmDelivery = request => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(
        DELIVERY_BASE_URL + `/receiveRestockOrderItemThroughDelivery`,
        request
      )
      .then(response => {
        dispatch(retrieveAllDelivery());
        toast.success("Delivery confirmed!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatchErrorMapError(err, dispatch);
        dispatch(closeCircularProgress());
      });
  };
};
// NOTE: End delivery

// NOTE: Start restock order item
const handleRetrieveAllRestockOrderItemToDeliver = data => ({
  type: types.RETRIEVE_ALL_RESTOCK_ORDER_ITEM_TO_DELIVER,
  restockOrderItems: data
});

export const retrieveAllRestockOrderItemToDeliver = () => {
  return dispatch => {
    axios
      .get(DELIVERY_BASE_URL + `/retrieveAllRestockOrderItemToDeliver`)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveAllRestockOrderItemToDeliver(data));
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const createDeliveryForRestockOrderItem = (request, history) => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(DELIVERY_BASE_URL + "/createDeliveryForRestockOrder", request)
      .then(({ data }) => {
        toast.success("Succesfully created delivery!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
        history.push("/delivery/viewAllDelivery");
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      });
  };
};

// NOTE: End restock order item
