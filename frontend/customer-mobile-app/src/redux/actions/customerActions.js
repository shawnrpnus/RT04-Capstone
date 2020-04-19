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
import {
  retrieveCustomerPendingPurchases,
  setViewedTransaction
} from "src/redux/actions/transactionActions";
import { StackActions } from "@react-navigation/native";

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
        if (setRefreshing) setRefreshing(false);
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

export const getShoppingCartItemsStock = (
  customerId,
  inStoreDeliverHome,
  setLoading
) => {
  const reqParams = inStoreDeliverHome
    ? { customerId, cartType: "instore", inStoreDeliverHome }
    : { customerId, cartType: "instore" };
  if (setLoading) setLoading(true);
  return dispatch => {
    axios
      .get(CUSTOMER_BASE_URL + "/getShoppingCartItemsStock", {
        params: reqParams
      })
      .then(response => {
        dispatch(updateShoppingCartItemsStock(response.data));
        if (setLoading) setLoading(false);
      })
      .catch(err => {
        console.log(err);
        if (setLoading) setLoading(false);
      });
  };
};

const updateShoppingCartItemsStock = data => ({
  type: UPDATE_SHOPPING_CART_ITEMS_STOCK,
  data: data
});

export const clearShoppingCart = customerId => {
  const reqParams = { customerId, cartType: "instore" };
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/clearShoppingCart", null, {
        params: reqParams
      })
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const updateShippingAddress = (
  customerId,
  shippingAddress,
  navigation,
  setLoading
) => {
  if (setLoading) setLoading(true);
  const req = { customerId, shippingAddress };
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/updateShippingAddress", req)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        if (setLoading) setLoading(false);
        if (navigation) navigation.navigate("View Addresses");
      })
      .catch(err => {
        console.log(err);
        if (setLoading) setLoading(false);
      });
  };
};

export const createShippingAddress = (
  customerId,
  shippingAddress,
  navigation,
  setLoading
) => {
  const req = { customerId, shippingAddress };
  if(setLoading) setLoading(true);
  return dispatch => {
    axios
      .post(CUSTOMER_BASE_URL + "/addShippingAddress", req)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        if(setLoading) setLoading(false);
        navigation.navigate("View Addresses");
      })
      .catch(err => {
        if(setLoading) setLoading(false);
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const removeShippingAddress = (
  customerId,
  shippingAddressId,
  setLoading
) => {
  if (setLoading) setLoading(true);
  return dispatch => {
    axios
      .delete(
        CUSTOMER_BASE_URL +
          `/removeShippingAddress/${customerId}/${shippingAddressId}`
      )
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        if(setLoading) setLoading(false);
      })
      .catch(err => {
        console.log(err);
        if(setLoading) setLoading(false);
      });
  };
};

export const addCreditCard = (customerId, tokenId, setLoading) => {
  const req = { customerId, tokenId };
  if (setLoading) setLoading(true);
  return dispatch => {
    axios
      .post(SPRING_BACKEND_URL + "/addCreditCardMobile", req)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        if (setLoading) setLoading(false);
      })
      .catch(err => {
        console.log(err);
        if (setLoading) setLoading(false);
      });
  };
};

export const removeCreditCard = (customerId, creditCardId, setLoading) => {
  const req = { customerId, creditCardId };
  if(setLoading) setLoading(true);
  return dispatch => {
    axios
      .post(SPRING_BACKEND_URL + "/deleteCardOnStripeAndSql", req)
      .then(response => {
        dispatchUpdatedCustomer(response.data, dispatch);
        if(setLoading) setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const addAddressAtCheckout = (
  customerId,
  shippingAddress,
  dispatch,
  setAddressModalMode,
  setCheckoutAddress
) => {
  return axios
    .post(CUSTOMER_BASE_URL + "/addShippingAddressAtCheckout", {
      customerId,
      shippingAddress
    })
    .then(response => {
      const { data } = jsog.decode(response);
      console.log(data);
      setAddressModalMode(null);
      setCheckoutAddress(data);
      dispatch(refreshCustomer(customerId));
      return data;
    })
    .catch(err => {
      dispatchErrorMapError(err, dispatch);
    });
};

export const makePaymentMobile = (req, customerId, setLoading, navigation) => {
  if(setLoading) setLoading(true);
  return dispatch => {
    axios
      .post(SPRING_BACKEND_URL + "/makePaymentWithSavedCard", req)
      .then(response => {
        const { data } = jsog.decode(response);
        axios
          .get(CUSTOMER_BASE_URL + "/retrieveCustomerById", {
            params: { customerId }
          })
          .then(response => {
            dispatch(retrieveCustomerPendingPurchases(customerId));
            const redirectFunction = () => {
              navigation.popToTop();
              navigation.navigate("PurchasesStack", {
                screen: "Purchase Details"
              });
            };
            dispatch(
              setViewedTransaction(
                data.transactionId,
                redirectFunction,
                setLoading,
                () => dispatchUpdatedCustomer(response.data, dispatch)
              )
            );
          })
          .catch(err => {
            console.log(err)
            if (setLoading) setLoading(false);
          });
      })
      .catch(err => {
        console.log(err);
        if (setLoading) setLoading(false);
      });
  };
};
