import axios from "axios";
import { UPDATE_SHOPPING_CART_SUCCESS } from "redux/actions/types";
import { dispatchErrorMapError } from "redux/actions/index";

const CUSTOMER_BASE_URL = "/api/customer";

const _ = require("lodash");
const jsog = require("jsog");

export const updateShoppingCart = (updateShoppingCartRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(
        CUSTOMER_BASE_URL + "/updateShoppingCart",
        updateShoppingCartRequest
      )
      .then(response => {
        updateShoppingCart(response.data, dispatch);
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const updateShoppingCartThroughCustomer = data => ({
  type: UPDATE_SHOPPING_CART_SUCCESS,
  customer: data
});

const updateShoppingCart = (responseData, dispatch) => {
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
