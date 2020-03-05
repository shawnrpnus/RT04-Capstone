import axios from "axios";
import { UPDATE_SHOPPING_CART_SUCCESS } from "redux/actions/types";
import { dispatchErrorMapError } from "redux/actions/index";
import { PAYMENT_SUCCESS, SAVE_CARD_SUCCESS } from "./types";

const CUSTOMER_BASE_URL = "/api/customer";

const _ = require("lodash");
const jsog = require("jsog");

export const updateShoppingCart = (
  updateShoppingCartRequest,
  enqueueSnackbar,
  removeFromWishlistAPI
) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(
        CUSTOMER_BASE_URL + "/updateShoppingCart",
        updateShoppingCartRequest
      )
      .then(response => {
        handleUpdateShoppingCart(response.data, dispatch);
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
            autoHideDuration: 1200
          });
        } else {
          enqueueSnackbar("Item Added!", {
            variant: "success",
            autoHideDuration: 1200
          });
        }
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

// Customer reducer
const updateShoppingCartThroughCustomer = data => ({
  type: UPDATE_SHOPPING_CART_SUCCESS,
  customer: data
});

const handleUpdateShoppingCart = (responseData, dispatch) => {
  const data = jsog.decode(responseData);
  dispatch(updateShoppingCartThroughCustomer(data));
};

export const getClientSecret = (totalAmount, setClientSecret) => {
  axios
    .post(`/directPayment`, null, {
      params: { totalAmount: totalAmount * 100 }
    })
    .then(resp => {
      // Return a client_secret string
      console.log(resp);
      setClientSecret(resp.data);
    })
    .catch(err => {
      console.log(err);
    });
};

export const completeDirectPayment = (paymentRequest, history) => {
  return dispatch => {
    axios
      .post(`/completeDirectPayment`, paymentRequest)
      .then(resp => {
        // Return a customer object
        // Update customer
        console.log(resp);
        handleUpdateShoppingCart(resp.data, dispatch);
        history.push("/");
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const makePaymentWithSavedCard = (paymentRequest, history) => {
  return dispatch => {
    axios
      .post(`/makePaymentWithSavedCard`, paymentRequest)
      .then(resp => {
        // Return a customer object
        // Update customer
        console.log(resp);
        handleUpdateShoppingCart(resp.data, dispatch);
        history.push("/");
      })
      .catch(err => {
        console.log(err);
      });
  };
};

// // Customer reducer
// const paymentSuccess = data => ({
//   type: PAYMENT_SUCCESS,
//   clientSecret: data
// });
