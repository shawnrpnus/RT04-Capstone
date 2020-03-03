import axios from "axios";
import * as types from "./types";
import { toast } from "react-toastify";
import { retrieveProductsDetails } from "./productActions";

const PRODUCT_STOCK_BASE_URL = "/api/productStock";
const jsog = require("jsog");

// export const clearCurrentProductStock = () => ({
//     type: types.CLEAR_CURRENT_PRODUCT_STOCK
// });

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
  type: types.UPDATE_PRODUCT_STOCK,
  productStockEntity: data
});

const updateProductStockError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const updateProductStockQty = (updateProductStockRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .put(
        PRODUCT_STOCK_BASE_URL + "/updateProductStockQty",
        updateProductStockRequest
      )
      .then(response => {
        const { data } = jsog.decode(response);
        // const productStockId = data.productStockId;
        // dispatch(updateProductStockQtySuccess(data));
        retrieveProductsDetails()(dispatch);
        // history.push(`/productStock/update/${productStockId}`);
      })
      .catch(err => {
        dispatch(updateProductStockQtyError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const updateProductStockQtySuccess = data => ({
  type: types.UPDATE_PRODUCT_STOCK_QTY,
  productStockEntity: data
});

const updateProductStockQtyError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const retrieveProductStocksByParameter = (storeId, warehouseId, productVariantId) => {
  return dispatch => {
    axios
        .get(PRODUCT_STOCK_BASE_URL + `/retrieveProductStocksByParameter`, {
          params: { storeId, warehouseId, productVariantId }
        })
        .then(response => {
          const { data } = jsog.decode(response);
          dispatch(retrieveProductStocksByParameterSuccess(data));
        })
        .catch(err => {
          dispatch(retrieveProductStocksByParameterError(err.response.data));
        });
  };
};

const retrieveProductStocksByParameterSuccess = data => ({
  type: types.RETRIEVE_PRODUCT_STOCKS_BY_PARAMETER,
  productStockEntities: data
});

const retrieveProductStocksByParameterError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
})