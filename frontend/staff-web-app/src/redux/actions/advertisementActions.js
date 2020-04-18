import axios from "axios";
import { toast } from "react-toastify";
import * as types from "./types";
import { dispatchErrorMapError } from "./index";
import { openCircularProgress, closeCircularProgress } from "./utilActions";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const NODE_API_URL = process.env.REACT_APP_NODE_API_URL;

const ADVERTISEMENT_BASE_URL = "/api/advertisement";
const jsog = require("jsog");

const handleRetrieveAllAdvertisement = (data) => ({
  type: types.RETRIEVE_ALL_ADVERTISEMENT,
  advertisements: data,
});

export const retrieveAllAdvertisement = () => {
  return (dispatch) => {
    axios
      .get(ADVERTISEMENT_BASE_URL + "/retrieveAllAdvertisement")
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveAllAdvertisement(data));
      })
      .catch((err) => {
        toast.error(err.response, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };
};

export const createAdvertisement = (request, onClose) => {
  return (dispatch) => {
    dispatch(openCircularProgress());
    axios
      .post(
        NODE_API_URL + ADVERTISEMENT_BASE_URL + "/createAdvertisement",
        request,
        {
          crossDomain: true,
        }
      )
      .then(({ data }) => {
        dispatch(retrieveAllAdvertisement());
        toast.success("Advertisement created!", {
          position: toast.POSITION.TOP_CENTER,
        });
        onClose();
        dispatch(closeCircularProgress());
      })
      .catch((err) => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
      });
  };
};

export const activateAdvertisement = (advertisementId) => {
  return (dispatch) => {
    dispatch(openCircularProgress());
    axios
      .get(ADVERTISEMENT_BASE_URL + `/activateAdvertisement/${advertisementId}`)
      .then(({ data }) => {
        dispatch(retrieveAllAdvertisement());
        toast.success("Succesfully activated advertisement!", {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
      })
      .catch((err) => {
        toast.error(err.response, {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
      });
  };
};

export const disableAdvertisement = (advertisementId) => {
  return (dispatch) => {
    dispatch(openCircularProgress());
    axios
      .get(ADVERTISEMENT_BASE_URL + `/disableAdvertisement/${advertisementId}`)
      .then(({ data }) => {
        dispatch(retrieveAllAdvertisement());
        toast.success("Succesfully disabled advertisement!", {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
      })
      .catch((err) => {
        toast.error(err.response, {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
      });
  };
};

export const deleteAdvertisement = (advertisementId) => {
  return (dispatch) => {
    dispatch(openCircularProgress());
    axios
      .delete(
        ADVERTISEMENT_BASE_URL + `/deleteAdvertisement/${advertisementId}`
      )
      .then(({ data }) => {
        dispatch(retrieveAllAdvertisement());
        toast.success("Succesfully deleted advertisement!", {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
      })
      .catch((err) => {
        toast.error(err.response, {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(closeCircularProgress());
      });
  };
};
