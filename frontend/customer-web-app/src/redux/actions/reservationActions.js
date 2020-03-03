import axios from "axios";
import * as types from "./types";
import { emailSent } from "./customerActions";
import { EMAIL_SENT } from "./types";
import { CONTACT_US_SUCCESS } from "./types";
import { GET_ERRORS } from "./types";
import { dispatchErrorMapError } from "redux/actions/index";

const RESERVATION_BASE_URL = "/api/reservation";

const _ = require("lodash");
const jsog = require("jsog");

export const retrieveStoresWithStockStatus = customerId => {
  return dispatch => {
    axios
      .get(RESERVATION_BASE_URL + "/getStoresStockStatusForCart", {
        params: { customerId: customerId }
      })
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(updateStoresWithStockStatus(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const updateStoresWithStockStatus = data => ({
  type: types.GET_STORES_WITH_STOCK_STATUS,
  storesWithStockStatus: data
});

export const getProductVariantStoreStockStatus = (customerId, storeId) => {
  return dispatch => {
    axios
      .get(RESERVATION_BASE_URL + "/getProdVariantStoreStockStatus", {
        params: { customerId, storeId }
      })
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(updateProductVariantStoreStockStatus(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const updateProductVariantStoreStockStatus = data => ({
  type: types.GET_PROD_VAR_STORE_STOCK_STATUS,
  prodVariantToStock: data
});

export const clearProductVariantStoreStockStatus = data => ({
  type: types.CLEAR_PROD_VAR_STORE_STOCK_STATUS
});
