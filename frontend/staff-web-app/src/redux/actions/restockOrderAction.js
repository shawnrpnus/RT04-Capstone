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

export const retrieveAllRestockOrder = () => {
  return dispatch => {
    axios
      .get(RESTOCK_ORDER_BASE_URL + "/retrieveAllInStoreRestockOrder")
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveAllRestockOrder(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const createRestockOrder = request => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(RESTOCK_ORDER_BASE_URL + "/createInStoreRestockOrder", request)
      .then(({ data }) => {
        dispatch(retrieveAllRestockOrder());
        toast.success("Succesfully created restock order!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        dispatch(closeCircularProgress());
      });
  };
};

export const updateRestockOrder = request => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(RESTOCK_ORDER_BASE_URL + "/updateInStoreRestockOrder", request)
      .then(({ data }) => {
        dispatch(retrieveAllRestockOrder());
        toast.success("Succesfully updated restock order!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        dispatch(closeCircularProgress());
      });
  };
};

export const deleteRestockOrder = inStoreRestockOrderId => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .delete(
        RESTOCK_ORDER_BASE_URL +
          `/deleteInStoreRestockOrder/${inStoreRestockOrderId}`
      )
      .then(({ data }) => {
        dispatch(retrieveAllRestockOrder());
        toast.success("Succesfully deleted restock order!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        dispatch(closeCircularProgress());
      });
  };
};
