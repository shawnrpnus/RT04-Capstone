import axios from "axios";
import { toast } from "react-toastify";
import * as types from "./types";
import { dispatchErrorMapError } from "./index";
import { openCircularProgress, closeCircularProgress } from "./utilActions";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const DELIVERY_BASE_URL = "/api/delivery";
const jsog = require("jsog");

// NOTE: Start delivery
const handleRetrieveAllDelivery = (data) => ({
  type: types.RETRIEVE_ALL_DELIVERY,
  deliveries: data,
});

export const retrieveAllDelivery = () => {
  return (dispatch) => {
    axios
      .get(DELIVERY_BASE_URL + `/retrieveAllDelivery`)
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveAllDelivery(data));
      })
      .catch((err) => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };
};

export const createDeliveryForTransaction = (request, history) => {
  return (dispatch) => {
    dispatch(openCircularProgress());
    axios
      .post(DELIVERY_BASE_URL + "/createDeliveryForTransaction", request)
      .then(({ data }) => {
        toast.success("Succesfully created delivery!", {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
        history.push("/delivery/viewAllDelivery");
      })
      .catch((err) => {
        if (err.response)
          toast.error(err.response.data.errorMessage, {
            position: toast.POSITION.TOP_CENTER,
          });
        dispatch(closeCircularProgress());
      });
  };
};

export const confirmTransactionDelivery = (request) => {
  return (dispatch) => {
    dispatch(openCircularProgress());
    axios
      .post(DELIVERY_BASE_URL + `/receiveTransactionThroughDelivery`, request)
      .then((response) => {
        dispatch(retrieveAllDelivery());
        toast.success("Delivery for customer transaction confirmed!", {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
      })
      .catch((err) => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
        // dispatchErrorMapError(err, dispatch);
        dispatch(closeCircularProgress());
      });
  };
};

export const automateDeliveryAllocation = (staffId, onClose, maxCapacity) => {
  return (dispatch) => {
    dispatch(openCircularProgress());
    axios
      .get(DELIVERY_BASE_URL + `/automateDeliveryAllocation`, {
        params: {
          staffId,
          maxCapacity,
        },
      })
      .then((response) => {
        console.log(response);
        dispatch(retrieveAllDelivery());
        toast.success(response.data.body, {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
        onClose();
      })
      .catch((err) => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
        // dispatchErrorMapError(err, dispatch);
        dispatch(closeCircularProgress());
      });
  };
};

export const generateDeliveryRoute = (deliveryId) => {
  return (dispatch) => {
    dispatch(openCircularProgress());
    axios
      .get(DELIVERY_BASE_URL + `/generateDeliveryRoute/${deliveryId}`)
      .then((response) => {
        console.log(jsog.decode(response));
        // dispatch(retrieveAllDelivery());
        toast.success("Route generated", {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
      })
      .catch((err) => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
      });
  };
};

export const estimateNumberOfDeliveryManRequired = () => {
  // return dispatch => {
  //   dispatch(openCircularProgress());
  return axios
    .get(DELIVERY_BASE_URL + "/estimateNumberOfDeliveryManRequired")
    .then((response) => {
      // dispatch(closeCircularProgress());
      return response.data.body;
    })
    .catch((err) => {
      if (err.response)
        toast.error(err.response, {
          position: toast.POSITION.TOP_CENTER,
        });
      console.log(err);
      // dispatch(closeCircularProgress());
    });
  // };
};

// NOTE: End delivery

// NOTE: Start restock order item
const handleRetrieveAllRestockOrderItemToDeliver = (data) => ({
  type: types.RETRIEVE_ALL_RESTOCK_ORDER_ITEM_TO_DELIVER,
  restockOrderItems: data,
});

export const retrieveAllRestockOrderItemToDeliver = () => {
  return (dispatch) => {
    axios
      .get(DELIVERY_BASE_URL + `/retrieveAllRestockOrderItemToDeliver`)
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveAllRestockOrderItemToDeliver(data));
      })
      .catch((err) => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };
};

export const createDeliveryForRestockOrderItem = (request, history) => {
  return (dispatch) => {
    dispatch(openCircularProgress());
    axios
      .post(DELIVERY_BASE_URL + "/createDeliveryForRestockOrder", request)
      .then(({ data }) => {
        toast.success("Succesfully created delivery!", {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
        history.push("/delivery/viewAllDelivery");
      })
      .catch((err) => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
      });
  };
};

export const confirmRestockOrderDelivery = (request) => {
  return (dispatch) => {
    dispatch(openCircularProgress());
    axios
      .post(
        DELIVERY_BASE_URL + `/receiveRestockOrderItemThroughDelivery`,
        request
      )
      .then((response) => {
        dispatch(retrieveAllDelivery());
        toast.success("Delivery for restock order confirmed!", {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
      })
      .catch((err) => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
        // dispatchErrorMapError(err, dispatch);
        dispatch(closeCircularProgress());
      });
  };
};

// NOTE: End restock order item
