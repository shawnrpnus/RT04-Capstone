import axios from "axios";
import { UPDATE_SHOPPING_CART_SUCCESS } from "redux/actions/types";
import { dispatchErrorMapError } from "redux/actions/index";

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

// export const customerLogin = (customerLoginRequest, history) => {
//   return dispatch => {
//     axios
//       .post(CUSTOMER_BASE_URL + "/login", customerLoginRequest)
//       .then(response => {
//         dispatchUpdatedCustomer(response.data, dispatch);
//         history.push("/");
//       })
//       .catch(err => {
//         dispatchErrorMapError(err, dispatch);
//       });
//   };
// };
