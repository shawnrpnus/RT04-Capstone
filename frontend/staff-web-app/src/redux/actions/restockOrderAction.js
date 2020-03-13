import axios from "axios";
import { toast } from "react-toastify";
import * as types from "./types";
import { dispatchErrorMapError } from "./index";
import { openCircularProgress, closeCircularProgress } from "./utilActions";

const RESTOCK_ORDER_BASE_URL = "/api/inStoreRestockOrder";
const jsog = require("jsog");

const handleRetrieveAllRestockOrder = data => ({
  type: types.RETRIEVE_ALL_RESTOCK_ORDER,
  restockOrders: data
});

export const retrieveAllRestockOrder = storeId => {
  return dispatch => {
    axios
      .get(RESTOCK_ORDER_BASE_URL + `/retrieveAllInStoreRestockOrder`, {
        params: { storeId }
      })
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveAllRestockOrder(data));
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const createRestockOrder = (request, history) => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(RESTOCK_ORDER_BASE_URL + "/createInStoreRestockOrder", request)
      .then(({ data }) => {
        // dispatch(retrieveAllRestockOrder());
        toast.success("Succesfully created restock order!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
        history.push("/restockOrder/viewAll");
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      });
  };
};

export const updateRestockOrder = (request, storeId) => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(RESTOCK_ORDER_BASE_URL + "/updateInStoreRestockOrder", request)
      .then(({ data }) => {
        dispatch(retrieveAllRestockOrder(storeId));
        toast.success("Succesfully updated restock order!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      });
  };
};

export const deleteRestockOrder = (inStoreRestockOrderId, onClose, storeId) => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .delete(
        RESTOCK_ORDER_BASE_URL +
          `/deleteInStoreRestockOrder/${inStoreRestockOrderId}`
      )
      .then(({ data }) => {
        dispatch(retrieveAllRestockOrder(storeId));
        toast.success("Succesfully deleted restock order!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
        onClose();
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      });
  };
};

export const fulFillRestockOrder = (
  inStoreRestockOrderId,
  onClose,
  buildingName
) => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .get(
        RESTOCK_ORDER_BASE_URL +
          `/fulfillInStoreRestockOrder/${inStoreRestockOrderId}`
      )
      .then(({ data }) => {
        dispatch(retrieveAllRestockOrder());
        toast.success(
          `Product has been dispatched from warehouse to ${buildingName}!`,
          {
            position: toast.POSITION.TOP_CENTER
          }
        );
        dispatch(closeCircularProgress());
        onClose();
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      });
  };
};

export const receiveStock = (inStoreRestockOrderId, storeId) => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .get(RESTOCK_ORDER_BASE_URL + `/receiveStock/${inStoreRestockOrderId}`)
      .then(({ data }) => {
        dispatch(retrieveAllRestockOrder(storeId));
        toast.success(`Stocks has been received from warehouse!`, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      });
  };
};

export const getDeliveryStatusColour = deliveryStatus => {
  let style;
  switch (deliveryStatus) {
    case "IN_TRANSIT":
      style = { backgroundColor: "#1975d2" };
      break;
    case "PROCESSING":
      style = { backgroundColor: "#feaa4b" };
      break;
    case "DELAYED":
      style = { backgroundColor: "#e1282d" };
      break;
    case "PARTIALLY_FULFILLED":
      style = { backgroundColor: "#ff8c00" };
      break;
    case "PARTIALLY_IN_TRANSIT":
      style = { backgroundColor: "#ff8c00" };
      break;
    default:
      // resolved
      style = { backgroundColor: "#33ba0a" };
  }

  return style;
};
