import { DISPLAY_PRODUCTS, GET_ERRORS } from "redux/actions/types";
import axios from "axios";
import { dispatchErrorMapError } from "redux/actions/index";

const jsog = require("jsog");
const PRODUCT_BASE_URL = "/api/product";

export const retrieveProductsDetails = (storeOrWarehouseId, categoryId) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(PRODUCT_BASE_URL + `/retrieveProductsDetails`, {
        params: { storeOrWarehouseId, categoryId }
      })
      .then(response => {
        updateDisplayedProducts(response.data, dispatch);
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const displayProductDetails = data => ({
  type: DISPLAY_PRODUCTS,
  products: data
});

const updateDisplayedProducts = (responseData, dispatch) => {
  const data = jsog.decode(responseData);
  dispatch(displayProductDetails(data));
};

export const filterProducts = req => {
  return dispatch => {
    axios
      .post(PRODUCT_BASE_URL + "/retrieveProductsDetailsByCriteria", req)
      .then(response => {
        updateDisplayedProducts(response.data, dispatch);
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};
