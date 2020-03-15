import axios from "axios";
import * as types from "./types";
import { toast } from "react-toastify";

const REVIEW_BASE_URL = "/api/review";
const jsog = require("jsog");

export const retrieveAllReviews = () => {
  return dispatch => {
    axios
      .get(REVIEW_BASE_URL + "/retrieveAllReviews")
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveAllReviewsSuccess(data));
      })
      .catch(err => {
        const { errorMap } = err.response.data;
        errorMap &&
          toast.error(errorMap.message, {
            position: toast.POSITION.TOP_CENTER
          });
        dispatch(retrieveAllReviewsError(err.response.data));
      });
  };
};

const retrieveAllReviewsSuccess = data => ({
  type: types.RETRIEVE_ALL_REVIEWS,
  reviewEntities: data
});

const retrieveAllReviewsError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const deleteReview = (reviewId, history) => {
  return dispatch => {
    axios
      .delete(REVIEW_BASE_URL + "/deleteReview/" + reviewId)
      .then(response => {
        const { data } = jsog.decode(response);
        toast.success("Review Deleted!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(deleteReviewSuccess(data));
        retrieveAllReviews()(dispatch);
        history.push(`/review/viewAll`);
      })
      .catch(err => {
        dispatch(deleteReviewError(err.response.data));
      });
  };
};

const deleteReviewSuccess = data => ({
  type: types.DELETE_REVIEW,
  deletedReview: data
});

const deleteReviewError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});
