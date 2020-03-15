import axios from "axios";
import { toast } from "react-toastify";
import * as types from "./types";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const PRODUCT_BASE_URL = "/api/product";
const CATEGORY_BASE_URL = "/api/category";
const jsog = require("jsog");

// Send to node to upload photo
export const createNewProduct = (
  createProductRequest,
  history,
  closeCircularProgress
) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(
        // "/node" + PRODUCT_BASE_URL + "/createNewProduct",
        "http://localhost:5000/node" + PRODUCT_BASE_URL + "/createNewProduct",
        createProductRequest
      )
      .then(response => {
        const { data } = jsog.decode(response);
        const productId = data.productId;
        dispatch(createProductSuccess(data));
        toast.success("Product Created!", {
          position: toast.POSITION.TOP_CENTER
        });
        closeCircularProgress();
        history.push(`/product/viewAllProduct`);
      })
      .catch(err => {
        toast.error("Error creating product!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(createProductError(err.response.data));
        closeCircularProgress();
        console.log(err.response.data);
      });
  };
};

const createProductSuccess = data => ({
  type: types.CREATE_PRODUCT,
  product: data
});

const createProductError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const retrieveProductById = (
  productId,
  handleCloseProductUpdateDialog
) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(PRODUCT_BASE_URL + `/retrieveProductById/${productId}`)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveProductByIdSuccess(data));
      })
      .then(() => {
        if (handleCloseProductUpdateDialog) {
          handleCloseProductUpdateDialog();
        }
      })
      .catch(err => {
        dispatch(retrieveProductByIdError(err.response.data));
      });
  };
};

const retrieveProductByIdSuccess = data => ({
  type: types.RETRIEVE_PRODUCT_BY_ID,
  product: data
});

const retrieveProductByIdError = data => ({
  type: types.GET_ERRORS,
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
        console.log(data);
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
  type: types.RETRIEVE_PRODUCTS_DETAILS,
  products: data
});

const retrieveProductsDetailsForCategorySuccess = data => ({
  type: types.RETRIEVE_ALL_PRODUCTS_FOR_CATEGORY,
  categoryProducts: data
});

const retrieveProductsDetailsError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const retrieveAllCategoryTagStyle = async () => {
  const { data } = await axios.get(
    CATEGORY_BASE_URL + "/retrieveAllCategoryTagStyle"
  );
  return jsog.decode(data);
};

export const updateProduct = (product, handleCloseProductUpdateDialog) => {
  return dispatch => {
    axios
      .put(PRODUCT_BASE_URL + "/updateProduct", product)
      .then(() => {
        retrieveProductById(
          product.productId,
          handleCloseProductUpdateDialog()
        )(dispatch);
      })
      .catch(err => {
        console.log(err);
        console.log("Failed");
      });
  };
};

export const createProductVariants = (request, handleCloseDialog) => {
  return dispatch => {
    axios
      .post(PRODUCT_BASE_URL + "Variant/createMultipleProductVariants", request)
      .then(() => {
        console.log("Successfully created product variants!");
        retrieveProductById(request.productId)(dispatch);
        toast.success("Product variants created!", {
          position: toast.POSITION.TOP_CENTER
        });
        handleCloseDialog();
      })
      .catch(() => {
        console.log("Failed");
      });
  };
};

export const updateProductVariantImages = (request, productId) => {
  return dispatch => {
    axios
      .put(
        "http://localhost:5000/node" +
          PRODUCT_BASE_URL +
          "/updateProductVariantImages",
        request
      )
      .then(response => {
        console.log(response);
        retrieveProductById(productId)(dispatch);
      })
      .catch(() => {
        console.log("Failed");
      });
  };
};

export const deleteProductVariant = (productVariantId, productId) => {
  return dispatch => {
    axios
      .delete(
        PRODUCT_BASE_URL + `Variant/deleteProductVariant/${productVariantId}`
      )
      .then(response => {
        console.log(response);
        retrieveProductById(productId)(dispatch);
      })
      .catch(err => {
        console.log(err.response.data);
        if (!!err.response && !!err.response.data) {
          const { errorMessage } = err.response.data;
          if (errorMessage) {
            //not inputDataValidationException
            toast.error(errorMessage, {
              position: toast.POSITION.TOP_CENTER
            });
          }
        } else {
          console.log(err);
        }
      });
  };
};

export const deleteProduct = (productId, storeId) => {
  return dispatch => {
    axios
      .delete(PRODUCT_BASE_URL + `/deleteProduct/${productId}`)
      .then(response => {
        console.log(response);
        console.log(storeId);
        if (storeId) {
          retrieveProductsDetails(storeId)(dispatch);
        } else {
          retrieveProductsDetails()(dispatch);
        }
        toast.success("Succesfully deleted product", {
          position: toast.POSITION.TOP_CENTER
        });
      })
      .catch(err => {
        console.log(err.response.data);
        if (!!err.response && !!err.response.data) {
          const { errorMessage } = err.response.data;
          if (errorMessage) {
            //not inputDataValidationException
            toast.error(errorMessage, {
              position: toast.POSITION.TOP_CENTER
            });
          }
        } else {
          console.log(err);
        }
      });
  };
};
