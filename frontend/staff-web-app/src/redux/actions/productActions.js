import axios from "axios";
import { toast } from "react-toastify";

import {
  CREATE_PRODUCT,
  RETRIEVE_PRODUCT_BY_ID,
  GET_ERRORS,
  RETRIEVE_ALL_PRODUCTS,
  RETRIEVE_ALL_PRODUCTS_FOR_CATEGORY,
  RETRIEVE_PRODUCTS_DETAILS
} from "./types";

const PRODUCT_BASE_URL = "/api/product";
const CATEGORY_BASE_URL = "/api/category";
const jsog = require("jsog");

export const createNewProduct = (createProductRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(PRODUCT_BASE_URL + "/createNewProduct", createProductRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        const productId = data.productId;
        dispatch(createProductSuccess(data));
        toast.success("Product Created!", {
          position: toast.POSITION.TOP_CENTER
        });
        // TODO: update redirect path
      })
      .catch(err => {
        dispatch(createProductError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const createProductSuccess = data => ({
  type: CREATE_PRODUCT,
  product: data
});

const createProductError = data => ({
  type: GET_ERRORS,
  errorMap: data
});

export const retrieveProductById = productId => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(PRODUCT_BASE_URL + `/retrieveProductById/${productId}`)
      .then(response => {
        const { data } = jsog.decode(response);
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

export const retrieveProductsDetails = (storeOrWarehouseId, categoryId) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(PRODUCT_BASE_URL + `/retrieveProductsDetails`, {
        params: { storeOrWarehouseId, categoryId }
      })
      .then(response => {
        const { data } = jsog.decode(response);
        if (categoryId) {
          dispatch(retrieveProductsDetailsForCategorySuccess(data));
        } else {
          dispatch(retrieveProductsDetailsSuccess(data));
        }
      })
      .catch(err => {
        dispatch(retrieveProductsDetailsError(err.response.data));
      });
  };
};

const retrieveProductsDetailsSuccess = data => ({
  type: RETRIEVE_PRODUCTS_DETAILS,
  products: data
});

const retrieveProductsDetailsForCategorySuccess = data => ({
  type: RETRIEVE_ALL_PRODUCTS_FOR_CATEGORY,
  categoryProducts: data
});

const retrieveProductsDetailsError = data => ({
  type: GET_ERRORS,
  errorMap: data
});

export const retrieveAllCategoryTagStyle = async () => {
  const { data } = await axios.get(
    CATEGORY_BASE_URL + "/retrieveAllCategoryTagStyle"
  );
  return jsog.decode(data);
};

export const updateProduct = (product, history) => {
  return dispatch => {
    axios
      .put(PRODUCT_BASE_URL + "/updateProduct", product)
      .then(() => {
        retrieveProductById(product.productId)(dispatch);
        console.log("Success");
      })
      .catch(() => {
        console.log("Failed");
      });
  };
};

export const createProductVariants = (request, history) => {
  return dispatch => {
    axios
      .post(PRODUCT_BASE_URL + "Variant/createMultipleProductVariants", request)
      .then(() => {
        console.log("Successfully created product variants!");
        retrieveProductById(request.productId)(dispatch);
      })
      .catch(() => {
        console.log("Failed");
      });
  };
};
