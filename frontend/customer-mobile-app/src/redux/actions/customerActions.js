import {
  CUSTOMER_LOGIN,
  CUSTOMER_LOGOUT,
  UPDATE_SHOPPING_CART_ITEMS_STOCK
} from "src/redux/actions/types";
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

export const refreshCustomer = (customerId, setRefreshing) => {
  return dispatch => {
    axios
      .get(CUSTOMER_BASE_URL + "/retrieveCustomerById", {
        params: { customerId }
      })
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        setRefreshing(false);
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

export const updateInStoreShoppingCart = (
  quantity,
  productVariantId,
  customerId,
  storeId,
  setAlertOpen,
  successAlertFunction,
  setQtyMenuOpen
) => {
  const req = { quantity, productVariantId, customerId, storeId };
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/updateInStoreShoppingCart", req)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        if (successAlertFunction) successAlertFunction();
        if (setQtyMenuOpen) setQtyMenuOpen(false);
      })
      .catch(err => {
        console.log(err);
        Alert.alert(
          "Error",
          "An error has occurred.",
          [
            {
              text: "Ok",
              onPress: () => {
                setAlertOpen ? setAlertOpen(false) : {};
              }
            }
          ],
          {
            cancelable: true
          }
        );
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const getShoppingCartItemsStock = (customerId, inStoreDeliverHome) => {
  const reqParams = inStoreDeliverHome
    ? { customerId, cartType: "instore", inStoreDeliverHome }
    : { customerId, cartType: "instore" };
  return dispatch => {
    axios
      .get(CUSTOMER_BASE_URL + "/getShoppingCartItemsStock", {
        params: reqParams
      })
      .then(response => {
        dispatch(updateShoppingCartItemsStock(response.data));
      })
      .catch(err => {
        console.log(err);
      });
  };
};

const updateShoppingCartItemsStock = data => ({
  type: UPDATE_SHOPPING_CART_ITEMS_STOCK,
  data: data
});
