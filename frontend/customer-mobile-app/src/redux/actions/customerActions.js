import {CUSTOMER_LOGIN, CUSTOMER_LOGOUT} from "src/redux/actions/types";
import { SPRING_BACKEND_URL } from "src/constants/routes";
import axios from "axios";
import {dispatchErrorMapError} from "src/redux/actions/index";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

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

export const customerLogin = (req) => {
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
}

export const registerForPushNotifications= async (customerId) => {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

  if (status !== 'granted') {
    alert('No notification permissions!');
    return null;
  }

  let token = await Notifications.getExpoPushTokenAsync();

  const req = {
    customerId,
    token: token
  }
  try {
    return await axios.post(CUSTOMER_BASE_URL + "/registerPushNotificationToken", req)
  } catch (err){
    console.log(err)
    return null;
  }
}
