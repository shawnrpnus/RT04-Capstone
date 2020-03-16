import axios from "axios";
import { dispatchErrorMapError } from "./index";
import {
  addShippingAddressSuccess,
  updateShippingAddressSuccess
} from "./customerActions";
import {
  ADD_SHIPPING_ADDRESS_SUCCESS,
  CHECK_IF_CAN_WRITE_REVIEW_SUCCESS,
  CREATE_REVIEW_BY_REVIEW_ID_SUCCESS,
  DELETE_REVIEW_BY_REVIEW_ID_SUCCESS,
  GET_ALL_REVIEWS_BY_PRODUCT_ID_SUCCESS,
  GET_ERRORS,
  RETRIEVE_REVIEW_BY_CUSTOMER_ID_SUCCESS,
  UPDATE_REVIEW_BY_REVIEW_ID_SUCCESS
} from "./types";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const jsog = require("jsog");
const REVIEW_BASE_URL = "/api/review";

export const createReviewDetails = (
  addEditReviewRequest,
  productId,
  enqueueSnackbar
) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(REVIEW_BASE_URL + "/createNewReview", addEditReviewRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(createReviewDetailsSuccess(data));
        enqueueSnackbar("Review Submitted", {
          variant: "success",
          autoHideDuration: 1200
        });
        dispatch(retrieveAllReviewsByProductId(productId));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        // console.log(err.response.data);
      });
  };
};

export const createReviewDetailsSuccess = data => ({
  type: CREATE_REVIEW_BY_REVIEW_ID_SUCCESS,
  currReview: data
});

export const retrieveAllReviewsByProductId = productId => {
  return dispatch =>
    axios
      .get(REVIEW_BASE_URL + `/retrieveAllReviewByProductId/${productId}`)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveAllReviewsByProductIdSuccess(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
};

export const retrieveAllReviewsByProductIdSuccess = data => ({
  type: GET_ALL_REVIEWS_BY_PRODUCT_ID_SUCCESS,
  allReviews: data
});

export const updateReviewDetails = (
  addEditReviewRequest,
  productId,
  enqueueSnackbar
) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(REVIEW_BASE_URL + "/updateReview", addEditReviewRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(updateReviewDetailsSuccess(data));
        enqueueSnackbar("Review Updated", {
          variant: "success",
          autoHideDuration: 1200
        });
        dispatch(retrieveAllReviewsByProductId(productId));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        // console.log(err.response.data);
      });
  };
};

export const updateReviewDetailsSuccess = data => ({
  type: UPDATE_REVIEW_BY_REVIEW_ID_SUCCESS,
  currReview: data
});

export const deleteReviewDetails = (productId, reviewId, enqueueSnackbar) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .delete(REVIEW_BASE_URL + `/deleteReview/${reviewId}`)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(deleteReviewDetailsSuccess(data));
        enqueueSnackbar("Review Deleted", {
          variant: "success",
          autoHideDuration: 1200
        });
        dispatch(retrieveAllReviewsByProductId(productId));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        // console.log(err.response.data);
      });
  };
};

export const deleteReviewDetailsSuccess = data => ({
  type: DELETE_REVIEW_BY_REVIEW_ID_SUCCESS,
  currReview: data
});

export const checkIfCanWriteReview = (productId, customerId) => {
  return dispatch =>
    axios
      .get(
        REVIEW_BASE_URL + `/checkIfCanWriteReview/${productId}/${customerId}`
      )
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(checkIfCanWriteReviewSuccess(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
};

export const checkIfCanWriteReviewSuccess = data => ({
  type: CHECK_IF_CAN_WRITE_REVIEW_SUCCESS,
  canWrite: data
});

export const retrieveReviewsByCustomerId = customerId => {
  return dispatch =>
    axios
      .get(REVIEW_BASE_URL + `/retrieveReviewsByCustomerId/${customerId}`)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveReviewsByCustomerIdSuccess(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
};

export const retrieveReviewsByCustomerIdSuccess = data => ({
  type: RETRIEVE_REVIEW_BY_CUSTOMER_ID_SUCCESS,
  allReviews: data
});
