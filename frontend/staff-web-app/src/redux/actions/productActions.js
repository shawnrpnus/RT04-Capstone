import axios from "axios";
import {
  RETRIEVE_PRODUCT_BY_ID,
  GET_ERRORS,
  RETRIEVE_ALL_PRODUCTS,
  RETRIEVE_ALL_PRODUCTS_FOR_CATEGORY
} from "./types";

const PRODUCT_BASE_URL = "/api/product/";
const CATEGORY_BASE_URL = "/api/category/";
const jsog = require("jsog");

export const retrieveProductById = productId => {
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

export const retrieveAllProducts = (storeOrWarehouseId, categoryId) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(PRODUCT_BASE_URL + `retrieveProductsDetails`, {
        params: { storeOrWarehouseId, categoryId }
      })
      .then(response => {
        const { data } = jsog.decode(response);
        if (categoryId) {
          dispatch(retrieveAllProductsForCategorySuccess(data));
        } else {
          dispatch(retrieveAllProductsSuccess(data));
        }
      })
      .catch(err => {
        dispatch(retrieveAllProductsError(err.response.data));
      });
  };
};

const retrieveAllProductsSuccess = data => ({
  type: RETRIEVE_ALL_PRODUCTS,
  products: data
});

const retrieveAllProductsForCategorySuccess = data => ({
  type: RETRIEVE_ALL_PRODUCTS_FOR_CATEGORY,
  categoryProducts: data
});

const retrieveAllProductsError = data => ({
  type: GET_ERRORS,
  errorMap: data
});

export const retrieveAllCategoryTagStyle = async () => {
  const { data } = await axios.get(
    CATEGORY_BASE_URL + "retrieveAllCategoryTagStyle"
  );
  return jsog.decode(data);
};
