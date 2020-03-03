import axios from "axios";
import {
  ADD_SHIPPING_ADDRESS_SUCCESS,
  CUSTOMER_LOGOUT,
  EMAIL_SENDING,
  EMAIL_SENT,
  RESET_VERIFICATION_STATUS,
  UPDATE_SHIPPING_ADDRESS_SUCCESS,
  VERIFY_FAILURE,
  VERIFY_SUCCESS,
  SAVE_CARD_SUCCESS
} from "./types";
import { UPDATE_CUSTOMER } from "redux/actions/types";
import { dispatchErrorMapError } from "redux/actions/index";

const CUSTOMER_BASE_URL = "/api/customer";

const _ = require("lodash");
const jsog = require("jsog");

export const emailSending = () => ({
  type: EMAIL_SENDING
});

export const emailSent = () => ({
  type: EMAIL_SENT
});

const dispatchUpdatedCustomer = (customerDataRaw, dispatch) => {
  const customer = jsog.decode(customerDataRaw);
  dispatch(updateCustomer(customer));
};

export const refreshCustomer = customerEmail => {
  const req = { email: customerEmail };
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/getCustomerByEmail", req)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const createNewCustomer = (createCustomerRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(CUSTOMER_BASE_URL + "/createNewCustomer", createCustomerRequest)
      .then(response => {
        dispatch(emailSent());
        history.push("/account/verifyEmail");
      })
      .catch(err => {
        dispatch(emailSent());
        dispatchErrorMapError(err, dispatch);
        //console.log(err.response.data);
      });
  };
};

// const createCustomerSuccess = data => ({
//   type: CREATE_NEW_CUSTOMER,
//   customer: data
// });

export const customerLogin = (customerLoginRequest, history) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/login", customerLoginRequest)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        history.push("/");
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

// const customerLoginSuccess = data => ({
//   type: CUSTOMER_LOGIN,
//   customer: data
// });

export const customerLogout = () => ({
  type: CUSTOMER_LOGOUT
});

// bad request(400) if expired, not found(404) if invalid, or already verified
export const verify = (verificationCode, history) => {
  return dispatch => {
    axios
      .get(CUSTOMER_BASE_URL + `/verify/${verificationCode}`)
      .then(response => {
        console.log("VERIFY SUCCESS");
        const { data } = jsog.decode(response);
        dispatch(verificationSuccess());
        dispatchUpdatedCustomer(response.data, dispatch);
      })
      .catch(err => {
        if (err.response.status === 404) {
          console.log(err.response);
          history.push("/404");
        } else {
          const errorMap = _.get(err, "response.data", null);
          if (errorMap) {
            dispatch(verificationError(errorMap));
          } else {
            console.log(err);
          }
        }
      });
  };
};

const verificationSuccess = () => ({
  type: VERIFY_SUCCESS
});

const verificationError = () => ({
  type: VERIFY_FAILURE
});

export const resetVerificationStatus = () => ({
  type: RESET_VERIFICATION_STATUS
});

export const resendVerifyEmail = (customerEmailReq, history) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + `/resendVerifyEmail`, customerEmailReq)
      .then(response => {
        dispatch(emailSent());
        history.push("/account/verifyEmail");
      })
      .catch(err => {
        dispatch(emailSent());
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const updateCustomerName = (updateCustomerReq, enqueueSnackbar) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/updateCustomer", updateCustomerReq)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        enqueueSnackbar("Changes saved", {
          variant: "success",
          autoHideDuration: 1200
        });
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const updateCustomer = data => ({
  type: UPDATE_CUSTOMER,
  customer: data
});

export const sendUpdateEmailLink = (
  req,
  setDialogOpen,
  resetInputState,
  setChangingEmail,
  enqueueSnackbar
) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/sendUpdateEmailLink", req)
      .then(response => {
        setTimeout(() => dispatch(emailSent()), 500);
        resetInputState();
        setChangingEmail(false);
        setDialogOpen(true);
      })
      .catch(err => {
        setTimeout(() => dispatch(emailSent()), 500);
        resetInputState();
        setChangingEmail(false);
        if (_.get(err, "response.data.email")) {
          dispatchErrorMapError(err, dispatch);
        } else {
          enqueueSnackbar("Error sending email", {
            variant: "error",
            autoHideDuration: 1200
          });
        }
      });
  };
};

// verify against database
export const updateEmail = (verificationCode, history) => {
  return dispatch => {
    axios
      .get(CUSTOMER_BASE_URL + `/updateEmail/${verificationCode}`)
      .then(response => {
        dispatch(customerLogout());
        dispatch(verificationSuccess());
      })
      .catch(err => {
        if (err.response.status === 404) {
          history.push("/404");
        } else {
          const errorMap = _.get(err, "response.data", null);
          if (errorMap) {
            dispatch(verificationError(errorMap));
          } else {
            console.log(err);
          }
        }
      });
  };
};

export const changePassword = (req, enqueueSnackbar, setChangingPassword) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + `/changePassword`, req)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        enqueueSnackbar("Password updated", {
          variant: "success",
          autoHideDuration: 1200
        });
        setChangingPassword(false);
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const sendResetPasswordLink = (req, setDialogOpen) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/sendResetPasswordLink", req)
      .then(response => {
        dispatch(emailSent());
        setDialogOpen(true);
      })
      .catch(err => {
        dispatch(emailSent());
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const resetPassword = (req, setDialogOpen, setDialogText) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/resetPassword", req)
      .then(response => {
        setDialogText({
          dialogTitle: "Success",
          dialogContent:
            "Your password has been updated. Please login with your new password."
        });
        setDialogOpen(true);
        dispatch(verificationSuccess());
      })
      .catch(err => {
        const errorMap = _.get(err, "response.data", null);
        if (
          errorMap.hasOwnProperty("newPassword") ||
          errorMap.hasOwnProperty("confirmNewPassword")
        ) {
          //input field errors
          dispatchErrorMapError(err, dispatch);
        } else {
          //not input field errors
          setDialogText({
            dialogTitle: "Error",
            dialogContent: "Your link has expired. Please request a new link."
          });
          setDialogOpen(true);
        }
        dispatch(verificationError());
      });
  };
};

export const updateShippingAddress = (
  updateShippingAddressRequest,
  history
) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(
        CUSTOMER_BASE_URL + "/updateShippingAddress",
        updateShippingAddressRequest
      )
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(updateShippingAddressSuccess(data));
        history.push("/account/address");
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        // console.log(err.response.data);
      });
  };
};

export const addMeasurements = (req, enqueueSnackbar, setAddMeasurements) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(CUSTOMER_BASE_URL + "/updateMeasurements", req)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        enqueueSnackbar("Measurements added", {
          variant: "success",
          autoHideDuration: 1200
        });
        setAddMeasurements(true);
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        console.log(err.response.data);
      });
  };
};

export const updateShippingAddressSuccess = data => ({
  type: UPDATE_SHIPPING_ADDRESS_SUCCESS,
  loggedInCustomer: data
});

export const addShippingAddressDetails = (
  addUpdateAddressRequest,
  enqueueSnackbar,
  history
) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(CUSTOMER_BASE_URL + "/addShippingAddress", addUpdateAddressRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(addShippingAddressSuccess(data));
        enqueueSnackbar("New Address Added", {
          variant: "success",
          autoHideDuration: 1200
        });
        history.push("/account/profile");
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        // console.log(err.response.data);
      });
  };
};

export const addShippingAddressSuccess = data => ({
  type: ADD_SHIPPING_ADDRESS_SUCCESS,
  loggedInCustomer: data
});

export const updateMeasurements = (
  req,
  enqueueSnackbar,
  setAddMeasurements
) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(CUSTOMER_BASE_URL + "/updateMeasurements", req)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        enqueueSnackbar("Measurements updated", {
          variant: "success",
          autoHideDuration: 1200
        });
        setAddMeasurements(true);
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        console.log(err.response.data);
      });
  };
};

export const deleteMeasurements = (customerId, enqueueSnackbar) => {
  return dispatch => {
    //redux thunk passes dispatch
    console.log(customerId);
    axios
      .post(CUSTOMER_BASE_URL + `/deleteMeasurements/${customerId}`)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        enqueueSnackbar("Measurements deleted", {
          variant: "success",
          autoHideDuration: 1200
        });
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        console.log(err);
      });
  };
};

export const addToWishlistAPI = (
  customerId,
  productVariantId,
  enqueueSnackbar
) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/addToWishlist", null, {
        params: { customerId, productVariantId }
      })
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        enqueueSnackbar("Added to wishlist!", {
          variant: "success",
          autoHideDuration: 1200
        });
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        console.log(err);
      });
  };
};

export const removeFromWishlistAPI = (
  customerId,
  productVariantId,
  enqueueSnackbar
) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/removeFromWishlist", null, {
        params: { customerId, productVariantId }
      })
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        if (enqueueSnackbar) {
          enqueueSnackbar("Removed from wishlist!", {
            variant: "success",
            autoHideDuration: 1200
          });
        }
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        console.log(err);
      });
  };
};

export const clearWishlistAPI = (customerId, enqueueSnackbar) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/clearWishlist", null, {
        params: { customerId }
      })
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        if (enqueueSnackbar) {
          enqueueSnackbar("Wishlist cleared!", {
            variant: "success",
            autoHideDuration: 1200
          });
        }
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        console.log(err);
      });
  };
};

export const moveWishlistToShoppingCartAPI = (customerId, enqueueSnackbar) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/addWishlistToShoppingCart", null, {
        params: { customerId }
      })
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        dispatch(clearWishlistAPI(customerId));
        if (enqueueSnackbar) {
          enqueueSnackbar("Wishlist moved to shopping cart!", {
            variant: "success",
            autoHideDuration: 1200
          });
        }
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        console.log(err);
      });
  };
};

export const addToReservationCartAPI = (
  customerId,
  productVariantId,
  enqueueSnackbar
) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/addToReservationCart", null, {
        params: { customerId, productVariantId }
      })
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        enqueueSnackbar("Added to reservation cart!", {
          variant: "success",
          autoHideDuration: 1200
        });
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        console.log(err);
      });
  };
};

export const removeFromReservationCartAPI = (
  customerId,
  productVariantId,
  enqueueSnackbar
) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/removeFromReservationCart", null, {
        params: { customerId, productVariantId }
      })
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        if (enqueueSnackbar) {
          enqueueSnackbar("Removed from reservation cart!", {
            variant: "success",
            autoHideDuration: 1200
          });
        }
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        console.log(err);
      });
  };
};

export const clearReservationCartAPI = (customerId, enqueueSnackbar) => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/clearReservationCart", null, {
        params: { customerId }
      })
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        if (enqueueSnackbar) {
          enqueueSnackbar("Reservation cart cleared!", {
            variant: "success",
            autoHideDuration: 1200
          });
        }
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        console.log(err);
      });
  };
};

export const saveCard = saveCardRequest => {
  return dispatch => {
    axios
      .post("/saveCard", saveCardRequest)
      .then(resp => {
        // Return customer
        console.log(resp);
        dispatch(saveCardSuccess(resp.data));
      })
      .catch(err => {
        console.log(err);
      });
  };
};

// Customer reducer
const saveCardSuccess = data => ({
  type: SAVE_CARD_SUCCESS,
  customer: data
});
