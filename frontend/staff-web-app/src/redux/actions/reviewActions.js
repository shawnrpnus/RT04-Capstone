import axios from "axios";
import * as types from "./types";
import { toast } from "react-toastify";
import { dispatchErrorMapError } from "./index";
import { openCircularProgress, closeCircularProgress } from "./utilActions";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const REVIEW_BASE_URL = "/api/review";
const jsog = require("jsog");

const retrieveAllReviewsSuccess = data => ({
  type: types.RETRIEVE_ALL_REVIEWS,
  reviewEntities: data
});

export const retrieveAllReviews = () => {
  return dispatch => {
    axios
      .get(REVIEW_BASE_URL + "/retrieveAllReviews")
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveAllReviewsSuccess(data));
      })
      .catch(err => {
        console.log(err);
        // const { errorMap } = err.response.data;
        // errorMap &&
        //   toast.error(errorMap.message, {
        //     position: toast.POSITION.TOP_CENTER
        //   });
        // dispatch(retrieveAllReviewsError(err.response.data));
      });
  };
};

export const deleteReview = reviewId => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .delete(REVIEW_BASE_URL + "/deleteReview/" + reviewId)
      .then(response => {
        toast.success("Review Deleted!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(retrieveAllReviews());
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        console.log(err.response);
        dispatchErrorMapError(err.response.data);
        dispatch(closeCircularProgress());
      });
  };
};

export const respondToReview = (request, onClose) => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(REVIEW_BASE_URL + "/respondToReview", request)
      .then(response => {
        toast.success("Responded to review!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(retrieveAllReviews());
        dispatch(closeCircularProgress());
        onClose();
      })
      .catch(err => {
        console.log(err.response);
        dispatchErrorMapError(err.response.data);
        dispatch(closeCircularProgress());
      });
  };
};

export const deleteReviewResponse = reviewId => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .delete(REVIEW_BASE_URL + `/deleteReviewResponse/${reviewId}`)
      .then(response => {
        toast.success("Response to review removed!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(retrieveAllReviews());
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        console.log(err.response);
        dispatchErrorMapError(err.response.data);
        dispatch(closeCircularProgress());
      });
  };
};
