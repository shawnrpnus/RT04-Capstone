import axios from "axios";
import { toast } from "react-toastify";
import * as types from "./types";
import { dispatchErrorMapError } from "./index";
import { openCircularProgress, closeCircularProgress } from "./utilActions";
import { retrieveProductsDetails } from "./productActions";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const DISCOUNT_BASE_URL = "/api/discount";
const jsog = require("jsog");

const handleRetrieveAllDiscount = data => ({
  type: types.RETRIEVE_ALL_DISCOUNT,
  discounts: data
});

export const retrieveAllDiscount = () => {
  return dispatch => {
    axios
      .get(DISCOUNT_BASE_URL + "/retrieveAllDiscount")
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveAllDiscount(data));
      })
      .catch(err => {
        toast.error(err.response, {
          position: toast.POSITION.TOP_CENTER
        });
      });
  };
};

export const retrieveDiscountById = discountId => {
  return dispatch => {
    axios
      .get(DISCOUNT_BASE_URL + `/retrieveDiscountById/${discountId}`)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch({
          type: types.RETRIEVE_DISCOUNT_BY_ID,
          discount: data
        });
      })
      .catch(err => {
        toast.error(err.response, {
          position: toast.POSITION.TOP_CENTER
        });
      });
  };
};

export const createDiscount = (request, history) => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(DISCOUNT_BASE_URL + "/createDiscount", request)
      .then(({ data }) => {
        toast.success("Discount created!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
        history.push("/discount/viewAllDiscounts");
      })
      .catch(err => {
        toast.error("Error!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatchErrorMapError(err, dispatch);
        dispatch(closeCircularProgress());
      });
  };
};

export const updateDiscount = (request, history, mode) => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .put(DISCOUNT_BASE_URL + "/updateDiscount", request)
      .then(({ data }) => {
        toast.success("Discount updated!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
        history.push("/discount/viewAllDiscounts");
      })
      .catch(err => {
        toast.error("Error!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatchErrorMapError(err, dispatch);
        dispatch(closeCircularProgress());
      });
  };
};

export const addDiscountToProducts = request => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(DISCOUNT_BASE_URL + "/addDiscountToProducts", request)
      .then(({ data }) => {
        dispatch(retrieveProductsDetails());
        toast.success("Added discount to product(s)!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        toast.error("Error!", {
          position: toast.POSITION.TOP_CENTER
        });
        console.log(err.response);
        dispatch(closeCircularProgress());
      });
  };
};

export const removeDiscountFromProducts = request => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(DISCOUNT_BASE_URL + "/removeDiscountFromProducts", request)
      .then(({ data }) => {
        dispatch(retrieveProductsDetails());
        toast.success("Removed discount from product(s)!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        toast.error("Error!", {
          position: toast.POSITION.TOP_CENTER
        });
        console.log(err.response);
        dispatch(closeCircularProgress());
      });
  };
};

export const deleteDiscount = discountId => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .delete(DISCOUNT_BASE_URL + `/deleteDiscount/${discountId}`)
      .then(({ data }) => {
        dispatch(retrieveAllDiscount());
        toast.success("Succesfully deleted discount!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        toast.error(err.response, {
          position: toast.POSITION.TOP_CENTER
        });
        console.log(err.response);
        dispatch(closeCircularProgress());
      });
  };
};
