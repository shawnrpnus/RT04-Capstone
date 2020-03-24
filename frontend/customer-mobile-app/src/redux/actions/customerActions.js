import { CUSTOMER_LOGIN, CUSTOMER_LOGOUT } from "src/redux/actions/types";
import { SPRING_BACKEND_URL } from "src/constants/routes";
import axios from "axios";
import { dispatchErrorMapError } from "src/redux/actions/index";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { Alert } from "react-native";

const jsog = require("jsog");

const CUSTOMER_BASE_URL = SPRING_BACKEND_URL + "/api/customer";

export const dispatchUpdatedCustomer = (customerResponseData, dispatch) => {
  const customer = jsog.decode(customerResponseData);
  dispatch(updateCustomer(customer));
};

const updateCustomer = customer => ({
  type: CUSTOMER_LOGIN,
  customer: customer
});

export const customerLogin = req => {
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/login", req)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const customerLogout = {
  type: CUSTOMER_LOGOUT
};

export const registerForPushNotifications = async customerId => {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

  if (status !== "granted") {
    alert("No notification permissions!");
    return null;
  }

  let token = await Notifications.getExpoPushTokenAsync();

  const req = {
    customerId,
    token: token
  };
  try {
    return await axios.post(
      CUSTOMER_BASE_URL + "/registerPushNotificationToken",
      req
    );
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateShoppingCart = (quantity, productVariantId, customerId) => {
  const req = { quantity, productVariantId, customerId, cartType: "instore" };
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/updateShoppingCart", req)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        Alert.alert("Success", "Item has been added to shopping cart!", null, {
          cancelable: true
        });
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const updateShoppingCartWithSku = (quantity, SKU, customerId) => {
  const req = { quantity, SKU, customerId, cartType: "instore" };
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/updateShoppingCartWithSku", req)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        Alert.alert("Success", "Item has been added to shopping cart!", null, {
          cancelable: true
        });
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const updateInStoreShoppingCart = (
  quantity,
  productVariantId,
  customerId,
  storeId,
  setAlertOpen
) => {
  const req = { quantity, productVariantId, customerId, storeId };
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/updateInStoreShoppingCart", req)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        Alert.alert(
          "Success",
          "Item has been added to shopping cart!",
          [{ text: "Ok", onPress: () => setAlertOpen(false) }],
          {
            cancelable: true
          }
        );
      })
      .catch(err => {
        Alert.alert(
          "Error",
          "An error has occurred. Please try again",
          [{ text: "Ok", onPress: () => setAlertOpen(false) }],
          {
            cancelable: true
          }
        );
        dispatchErrorMapError(err, dispatch);
      });
  };
};
