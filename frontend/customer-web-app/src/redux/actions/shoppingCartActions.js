import axios from "axios";
import {
  CART_TOOLTIP_CLOSE,
  CART_TOOLTIP_OPEN,
  UPDATE_SHOPPING_CART_SUCCESS,
} from "redux/actions/types";
import { dispatchErrorMapError } from "redux/actions/index";
import { refreshCustomerEmail } from "./customerActions";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const CUSTOMER_BASE_URL = "/api/customer";

const _ = require("lodash");
const jsog = require("jsog");

export const updateShoppingCart = (
  updateShoppingCartRequest,
  enqueueSnackbar,
  removeFromWishlistAPI,
  updateShoppingCartQty
) => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .post(
        CUSTOMER_BASE_URL + "/updateShoppingCart",
        updateShoppingCartRequest
      )
      .then((response) => {
        handleUpdateShoppingCart(response.data, dispatch);
        if (!updateShoppingCartQty) {
          if (removeFromWishlistAPI) {
            //for transferring from wishlist to cart
            dispatch(
              removeFromWishlistAPI(
                updateShoppingCartRequest.customerId,
                updateShoppingCartRequest.productVariantId
              )
            );
            enqueueSnackbar("Moved to shopping cart!", {
              variant: "success",
              autoHideDuration: 1200,
            });
          } else {
            enqueueSnackbar &&
              enqueueSnackbar("Item Added!", {
                variant: "success",
                autoHideDuration: 1200,
              });
          }
        }
      })
      .catch((err) => {
        if (err.response && err.response.data)
          enqueueSnackbar &&
            enqueueSnackbar("Insufficient stock!", {
              variant: "error",
              autoHideDuration: 1200,
            });
        dispatchErrorMapError(err, dispatch);
      });
  };
};

// Customer reducer
const updateShoppingCartThroughCustomer = (data) => ({
  type: UPDATE_SHOPPING_CART_SUCCESS,
  customer: data,
});

const handleUpdateShoppingCart = (responseData, dispatch) => {
  const data = jsog.decode(responseData);
  dispatch(updateShoppingCartThroughCustomer(data));
};

export const getClientSecret = (totalAmount, setClientSecret) => {
  axios
    .post(`/directPayment`, null, {
      params: { totalAmount: (totalAmount * 100).toFixed(0) },
    })
    .then((resp) => {
      // Return a client_secret string
      console.log(resp);
      setClientSecret(resp.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const completeDirectPayment = (
  paymentRequest,
  history,
  email,
  setIsLoading
) => {
  return (dispatch) => {
    setIsLoading(true);
    axios
      .post(`/completeDirectPayment`, paymentRequest)
      .then((resp) => {
        // Return a customer object
        // Update customer
        dispatch(refreshCustomerEmail(email));
        setIsLoading(false);
        history.push("/account/profile/orderHistory");
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };
};

export const makePaymentWithSavedCard = (
  paymentRequest,
  history,
  email,
  setIsLoading
) => {
  return (dispatch) => {
    setIsLoading(true);
    axios
      .post(`/makePaymentWithSavedCard`, paymentRequest)
      .then((resp) => {
        // Return a customer object
        // Update customer
        dispatch(refreshCustomerEmail(email));
        setIsLoading(false);
        history.push("/account/profile/orderHistory");
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };
};

export const clearShoppingCart = (customerId) => {
  console.log(customerId);
  return (dispatch) => {
    axios
      .post(CUSTOMER_BASE_URL + "/clearShoppingCart", null, {
        params: { customerId, cartType: "online" },
      })
      .then((resp) => {
        // Return a customer object
        // Update customer
        console.log(resp);
        handleUpdateShoppingCart(resp.data, dispatch);
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const openCartTooltip = {
  type: CART_TOOLTIP_OPEN,
};

export const closeCartTooltip = {
  type: CART_TOOLTIP_CLOSE,
};
