import axios from "axios";
import * as types from "./types";
import { toast } from "react-toastify";

const PRODUCT_STOCK_BASE_URL = "/api/product";
const jsog = require("jsog");

// export const clearCurrentProductStock = () => ({
//     type: types.CLEAR_CURRENT_PRODUCT_STOCK
// });

export const retrieveProductStockByWarehouseId = (warehouseId, history) => {
  return dispatch => {
    axios
      .get(
        PRODUCT_STOCK_BASE_URL +
          "/retrieveProductStockByWarehouseId/" +
          warehouseId
      )
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveProductStockByWarehouseIdSuccess(data));
      })
      .catch(err => {
        toast.error("ProductStock Not Found!", {
          position: toast.POSITION.TOP_CENTER
        });
        history.push(`/productStock/viewAll`);
        dispatch(retrieveProductStockByWarehouseIdError(err.response.data));
      });
  };
};

const retrieveProductStockByWarehouseIdSuccess = data => ({
  type: types.RETRIEVE_PRODUCT_STOCK_BY_WAREHOUSE_ID,
  productStockEntities: data
});

const retrieveProductStockByWarehouseIdError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const retrieveProductStockByStoreId = (storeId, history) => {
  return dispatch => {
    axios
      .get(PRODUCT_STOCK_BASE_URL + "/retrieveProductStockByStoreId/" + storeId)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveProductStockByStoreIdSuccess(data));
      })
      .catch(err => {
        toast.error("ProductStock Not Found!", {
          position: toast.POSITION.TOP_CENTER
        });
        history.push(`/productStock/viewAll`);
        dispatch(retrieveProductStockByStoreIdError(err.response.data));
      });
  };
};

const retrieveProductStockByStoreIdSuccess = data => ({
  type: types.RETRIEVE_PRODUCT_STOCK_BY_WAREHOUSE_ID,
  productStockEntities: data
});

const retrieveProductStockByStoreIdError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const updateProductStock = (updateProductStockRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(
        PRODUCT_STOCK_BASE_URL + "/updateProductStock",
        updateProductStockRequest
      )
      .then(response => {
        const { data } = jsog.decode(response);
        const productStockId = data.productStockId;
        dispatch(updateProductStockSuccess(data));
        toast.success("Product stock updated!", {
          position: toast.POSITION.TOP_CENTER
        });
        history.push(`/productStock/update/${productStockId}`);
      })
      .catch(err => {
        dispatch(updateProductStockError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const updateProductStockSuccess = data => ({
  type: types.UPDATE_STORE,
  productStockEntity: data
});

const updateProductStockError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});
