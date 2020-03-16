import axios from "axios";
import { toast } from "react-toastify";
import * as types from "./types";
import { dispatchErrorMapError } from "./index";
import { openCircularProgress, closeCircularProgress } from "./utilActions";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const FEEDBACK_BASE_URL = "/api/contactUs";

const handleRetrieveAllFeedBack = data => ({
  type: types.RETRIEVE_ALL_FEEDBACK,
  feedbacks: data
});

export const retrieveAllFeedback = () => {
  return dispatch => {
    axios
      .get(FEEDBACK_BASE_URL + "/retrieveAllContactUs")
      .then(({ data }) => {
        dispatch(handleRetrieveAllFeedBack(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const markAsResolved = request => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(FEEDBACK_BASE_URL + "/replyToEmail", request)
      .then(({ data }) => {
        dispatch(retrieveAllFeedback());
        toast.success("Marked as resolved!", {
          position: toast.POSITION.TOP_CENTER
        });
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
    dispatch(closeCircularProgress());
  };
};

export const replyToEmail = (request, onClose) => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(FEEDBACK_BASE_URL + "/replyToEmail", request)
      .then(({ data }) => {
        dispatch(retrieveAllFeedback());
        toast.success("Succesfully replied to email!", {
          position: toast.POSITION.TOP_CENTER
        });
        onClose();
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
    dispatch(closeCircularProgress());
  };
};

export const deleteFeedback = contactUsId => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .delete(FEEDBACK_BASE_URL + `/deleteContactUs/${contactUsId}`)
      .then(({ data }) => {
        dispatch(retrieveAllFeedback());
        toast.success("Succesfully deleted feedback!", {
          position: toast.POSITION.TOP_CENTER
        });
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
    dispatch(closeCircularProgress());
  };
};
