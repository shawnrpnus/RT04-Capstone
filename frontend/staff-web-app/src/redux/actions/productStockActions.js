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

export const simulateReorderingFromSupplier = (productStockIds, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(
        PRODUCT_STOCK_BASE_URL + "/simulateReorderingFromSupplier",
        productStockIds
      )
      .then(response => {
        const { data } = jsog.decode(response);
        // const productStockId = data.productStockId;
        dispatch(simulateReorderingFromSupplierSuccess(data));
        dispatch(retrieveProductStocksByParameter());
        toast.success("Successfully Simulate Reordering from Supplier!", {
          position: toast.POSITION.TOP_CENTER
        });
        history.push(`/productStock/viewAll`);
      })
      .catch(err => {
        dispatch(updateProductStockError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const simulateReorderingFromSupplierSuccess = data => ({
  type: types.SIMULATE_REORDERING_FROM_SUPPLIER,
  simulateOrderProductStocks: data
});

export const updateProductStockQty = (updateProductStockRequest, storeId) => {
  return dispatch => {
    //redux thunk passes dispatch
    console.log(storeId);

    axios
      .put(
        PRODUCT_STOCK_BASE_URL + "/updateProductStockQty",
        updateProductStockRequest
      )
      .then(response => {
        retrieveProductsDetails(storeId)(dispatch);
      })
      .catch(err => {
        dispatch(updateProductStockQtyError(err.response.data));
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

export const retrieveProductStocksByParameter = (
  storeId,
  warehouseId,
  productVariantId
) => {
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
});
