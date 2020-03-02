import axios from "axios";
import { UPDATE_SHOPPING_CART_SUCCESS } from "redux/actions/types";
import { dispatchErrorMapError } from "redux/actions/index";
import { PAYMENT_SUCCESS, SAVE_CARD_SUCCESS } from "./types";

const CUSTOMER_BASE_URL = "/api/customer";

const _ = require("lodash");
const jsog = require("jsog");

export const updateShoppingCart = (
  updateShoppingCartRequest,
  enqueueSnackbar
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
        enqueueSnackbar("Item Added!", {
          variant: "success",
          autoHideDuration: 1200
        });
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

export const checkOut = (paymentRequest, setShowCreditCardDialog) => {
  return dispatch => {
    axios
      .post("/simulatePayment", paymentRequest)
      .then(resp => {
        console.log(resp);
        dispatch(paymentSuccess(resp.data));
        setShowCreditCardDialog(true);
      })
      .catch(err => {
        console.log(err);
      });
  };
};

// Customer reducer
const paymentSuccess = data => ({
  type: PAYMENT_SUCCESS,
  clientSecret: data
});

// export const saveCard = (customerId, setShowCreditCardDialog) => {
//   return dispatch => {
//     axios
//       .get(`/saveCard/${customerId}`)
//       .then(resp => {
//         console.log(resp);
//         dispatch(saveCardSuccess(resp.data));
//         setShowCreditCardDialog(true);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   };
// };

// // Customer reducer
// const saveCardSuccess = data => ({
//   type: SAVE_CARD_SUCCESS,
//   clientSecret: data
// });
