import axios from "axios";
import {
  DISPLAY_PRODUCTS,
  GET_ERRORS,
  VIEW_SINGLE_PRODUCT,
  VIEW_ELIGIBLE_STORE_RECOMMENDATION,
} from "redux/actions/types";
import { dispatchErrorMapError } from "redux/actions/index";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const jsog = require("jsog");
const PRODUCT_BASE_URL = "/api/product";

export const retrieveProductsDetails = (
  storeOrWarehouseId,
  categoryId,
  setIsLoading
) => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .get(PRODUCT_BASE_URL + `/retrieveProductsDetails`, {
        params: { storeOrWarehouseId, categoryId },
      })
      .then((response) => {
        updateDisplayedProducts(response.data, dispatch);
        setIsLoading(false);
      })
      .catch((err) => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const displayProductDetails = (data) => ({
  type: DISPLAY_PRODUCTS,
  products: data,
});

const updateDisplayedProducts = (responseData, dispatch) => {
  const data = jsog.decode(responseData);
  dispatch(displayProductDetails(data));
};

export const filterProducts = (req, setFilterDrawerOpen, setIsLoading) => {
  return (dispatch) => {
    axios
      .post(PRODUCT_BASE_URL + "/retrieveProductsDetailsByCriteria", req)
      .then((response) => {
        updateDisplayedProducts(response.data, dispatch);
        if (setFilterDrawerOpen) setFilterDrawerOpen(false);
        if (setIsLoading) setIsLoading(false);
      })
      .catch((err) => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const retrieveProductById = (productId, setIsLoading) => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .get(PRODUCT_BASE_URL + `/retrieveProductById/${productId}`)
      .then((response) => {
        const data = jsog.decode(response.data);
        dispatch(viewSingleProduct(data));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const viewSingleProduct = (data) => ({
  type: VIEW_SINGLE_PRODUCT,
  product: data,
});

export const getEligibleStoreForRecommendation = (request, setIsLoading) => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .post(PRODUCT_BASE_URL + `/getEligibleStoreForRecommendation`, request)
      .then((response) => {
        const data = jsog.decode(response.data);
        dispatch(viewEligibleStoreForRecommendation(data));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const viewEligibleStoreForRecommendation = (data) => ({
  type: VIEW_ELIGIBLE_STORE_RECOMMENDATION,
  storeForRecommendation: data,
});
