import axios from "axios";
import { toast } from "react-toastify";
import * as types from "./types";
import { dispatchErrorMapError } from "./index";
import { openCircularProgress, closeCircularProgress } from "./utilActions";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

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
        console.log(err);

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
        console.log(err);
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
        toast.success(`Product is ready to be delivered to ${buildingName}!`, {
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

export const getDeliveryStatusColour = deliveryStatus => {
  let style;
  switch (deliveryStatus) {
    case "PROCESSING":
      style = { backgroundColor: "#f65a5a" };
      break;
    case "DELAYED":
      style = { backgroundColor: "#e1282d" };
      break;
    case "PARTIALLY FULFILLED":
      style = { backgroundColor: "#ff8c00" };
      break;
    case "IN TRANSIT":
      style = { backgroundColor: "#1975d2" };
      break;
    case "PARTIALLY IN TRANSIT":
      style = { backgroundColor: "#19d2d2" };
      break;
    case "TO BE DELIVERED":
      style = { backgroundColor: "#008b8b" };
      break;
    case "PARTIALLY TO BE DELIVERED":
      style = { backgroundColor: "#66a8a6" };
      break;
    case "TO DELIVER":
      style = { backgroundColor: "orange" };
      break;
    default:
      // resolved
      style = { backgroundColor: "#33ba0a" };
  }
  return style;
};
