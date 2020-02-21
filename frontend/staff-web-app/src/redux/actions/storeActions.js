import axios from "axios";
import * as types from "./types";
import { toast } from "react-toastify";

const STORE_BASE_URL = "/api/store";
const jsog = require("jsog");
export const createNewStore = (createStoreRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(STORE_BASE_URL + "/createNewStore", createStoreRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        const storeId = data.storeId;
        dispatch(createStoreSuccess(data));
        toast.success("Store Created!", {
          position: toast.POSITION.TOP_CENTER
        });
        history.push(`/store/view/${storeId}`); // TODO: update redirect path
      })
      .catch(err => {
        dispatch(createStoreError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const createStoreSuccess = data => ({
  type: types.CREATE_STORE,
  storeEntity: data
});

const createStoreError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const retrieveStoreById = (storeId, history) => {
  return dispatch => {
    axios
      .get(STORE_BASE_URL + "/retrieveStoreById/" + storeId)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveStoreSuccess(data));
      })
      .catch(err => {
        toast.error("Store Not Found!", {
          position: toast.POSITION.TOP_CENTER
        });
        history.push(`/store/viewAll`);
        dispatch(retrieveStoreError(err.response.data));
      });
  };
};

const retrieveStoreSuccess = data => ({
  type: types.RETRIEVE_STORE,
  storeEntity: data
});

const retrieveStoreError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const updateStore = (updateStoreRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(STORE_BASE_URL + "/updateStore", updateStoreRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        const storeId = data.storeId;
        dispatch(updateStoreSuccess(data));
        toast.success("Store Updated!", {
          position: toast.POSITION.TOP_CENTER
        });
        history.push(`/store/view/${storeId}`);
      })
      .catch(err => {
        dispatch(updateStoreError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const updateStoreSuccess = data => ({
  type: types.UPDATE_STORE,
  storeEntity: data
});

const updateStoreError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const retrieveAllStores = () => {
  return dispatch => {
    axios
      .get(STORE_BASE_URL + "/retrieveAllStores")
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveAllStoresSuccess(data));
      })
      .catch(err => {
        dispatch(retrieveAllStoresError(err.response.data));
      });
  };
};

const retrieveAllStoresSuccess = data => ({
  type: types.RETRIEVE_ALL_STORES,
  storeEntities: data
});

const retrieveAllStoresError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});
