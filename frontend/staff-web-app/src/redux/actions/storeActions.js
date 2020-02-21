import axios from "axios";
import * as types from "./types";

const STORE_BASE_URL = "/api/store";
const jsog = require("jsog");
export const createNewStore = (createStoreRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(STORE_BASE_URL + "/createNewStore", createStoreRequest)
      .then(response => {
        const data = jsog.decode(response);
        console.log(data);
        dispatch(createStoreSuccess(response.data));
        //history.push("/storeEdit"); // TODO: update redirect path
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

export const retrieveStoreById = storeId => {
  return dispatch => {
    axios
      .get(STORE_BASE_URL + "/retrieveStoreById/" + storeId)
      .then(response => {
        const data = jsog.decode(response);
        dispatch(retrieveStoreSuccess(response.data));
      })
      .catch(err => {
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
