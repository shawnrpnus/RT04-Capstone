import axios from "axios";
import * as types from "./types";
import { toast } from "react-toastify";
import { retrieveProductsDetails } from "./productActions";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const STYLE_BASE_URL = "/api/style";
const jsog = require("jsog");

export const createNewStyle = (createStyleRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(STYLE_BASE_URL + "/createNewStyle", createStyleRequest)
      .then(response => {
        const data = jsog.decode(response);
        const styleId = data.styleId;
        console.log(data);
        dispatch(createStyleSuccess(response.data));
        toast.success("Style Created!", {
          position: toast.POSITION.TOP_CENTER
        });
        retrieveAllStyles()(dispatch);
        history.push(`/style/manage`);
      })
      .catch(err => {
        dispatch(createStyleError(err.response.data));
        console.log(err.response.data);
      });
  };
};

const createStyleSuccess = data => ({
  type: types.CREATE_STYLE,
  style: data
});

const createStyleError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const retrieveAllStyles = () => {
  return dispatch => {
    axios
      .get(STYLE_BASE_URL + "/retrieveAllStyles")
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveAllStylesSuccess(data));
      })
      .catch(err => {
        dispatch(retrieveAllStylesError(err.response.data));
      });
  };
};

const retrieveAllStylesSuccess = data => ({
  type: types.RETRIEVE_ALL_STYLES,
  allStyles: data
});

const retrieveAllStylesError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const updateStyle = (updateStyleRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(STYLE_BASE_URL + "/updateStyle", updateStyleRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        const styleId = data.styleId;
        dispatch(updateStyleSuccess(data));
        toast.success("Style Updated!", {
          position: toast.POSITION.TOP_CENTER
        });
        retrieveAllStyles()(dispatch);
        history.push(`/style/manage`);
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage.toString(), {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(updateStyleError(err.response.data));
        console.log(err.response.data);
      });
  };
};

const updateStyleSuccess = data => ({
  type: types.UPDATE_STYLE,
  storeEntity: data
});

const updateStyleError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const deleteStyle = (styleId, history) => {
  return dispatch => {
    axios
      .delete(STYLE_BASE_URL + "/deleteStyle/" + styleId)
      .then(response => {
        const { data } = jsog.decode(response);
        toast.success("Style Deleted!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(deleteStyleSuccess(data));
        retrieveAllStyles()(dispatch);
        history.push(`/style/manage`);
      })
      .catch(err => {
        console.log(err);
        dispatch(deleteStyleError(err.response.data));
      });
  };
};

const deleteStyleSuccess = data => ({
  type: types.DELETE_STYLE,
  deletedStyle: data
});

const deleteStyleError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const addStyleToProducts = (addStyleToProductRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(STYLE_BASE_URL + "/addStyleToProducts", addStyleToProductRequest)
      .then(response => {
        const data = jsog.decode(response);
        const styleId = data.styleId;
        console.log(data);
        dispatch(addStyleToProductsSuccess(response.data));
        toast.success("Successfully Add Style To Products!", {
          position: toast.POSITION.TOP_CENTER
        });
        retrieveProductsDetails()(dispatch);
        history.push(`/style/addStyleToProducts`);
      })
      .catch(err => {
        console.log(err);
        dispatch(addStyleToProductsError(err.response.data));
      });
  };
};

const addStyleToProductsSuccess = data => ({
  type: types.ADD_STYLE_TO_PRODUCTS,
  style: data
});

const addStyleToProductsError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const deleteStyleFromProducts = (
  deleteStyleFromProductsRequest,
  history
) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(
        STYLE_BASE_URL + "/deleteStyleFromProducts",
        deleteStyleFromProductsRequest
      )
      .then(response => {
        const data = jsog.decode(response);
        const styleId = data.styleId;
        console.log(data);
        dispatch(deleteStyleFromProductsSuccess(response.data));
        toast.success("Successfully Deleted Style From Products!", {
          position: toast.POSITION.TOP_CENTER
        });
        retrieveProductsDetails()(dispatch);
        history.push(`/style/addStyleToProducts`);
      })
      .catch(err => {
        console.log(err);
        dispatch(deleteStyleFromProductsError(err.response.data));
      });
  };
};

const deleteStyleFromProductsSuccess = data => ({
  type: types.DELETE_STYLE_FROM_PRODUCTS,
  style: data
});

const deleteStyleFromProductsError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});
