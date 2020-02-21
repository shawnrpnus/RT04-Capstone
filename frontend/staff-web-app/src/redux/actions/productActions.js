import axios from "axios";
import { RETRIEVE_PRODUCT_BY_ID, GET_ERRORS } from "./types";

const PRODUCT_BASE_URL = "/api/product/";
const jsog = require("jsog");

export const retrieveProductById = (productId, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(PRODUCT_BASE_URL + `retrieveProductById/${productId}`)
      .then(response => {
        const { data } = jsog.decode(response);
        // console.log(data);
        dispatch(retrieveProductByIdSuccess(data));
        //history.push("/storeEdit"); // TODO: update redirect path
      })
      .catch(err => {
        dispatch(retrieveProductByIdError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const retrieveProductByIdSuccess = data => ({
  type: RETRIEVE_PRODUCT_BY_ID,
  product: data
});

const retrieveProductByIdError = data => ({
  type: GET_ERRORS,
  errorMap: data
});
