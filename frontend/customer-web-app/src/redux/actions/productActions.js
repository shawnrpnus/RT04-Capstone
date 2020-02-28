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
        const { data } = jsog.decode(response);
        dispatch(displayProductDetails(data));
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
