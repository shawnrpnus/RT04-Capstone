import {STAFF_LOGIN, STAFF_LOGOUT} from "src/redux/actions/types";
import { SPRING_BACKEND_URL } from "src/constants/routes";
import axios from "axios";
import {dispatchErrorMapError} from "src/redux/actions/index";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

const jsog = require("jsog");

const STAFF_BASE_URL = SPRING_BACKEND_URL + "/api/staff";

export const dispatchUpdatedStaff = (staffResponseData, dispatch) => {
  const staff = jsog.decode(staffResponseData);
  dispatch(updateStaff(staff));
};

const updateStaff = staff => ({
  type: STAFF_LOGIN,
  staff: staff
});

export const staffLogin = (req) => {
  return dispatch => {
    axios
      .post(STAFF_BASE_URL + "/loginStaff", req)
      .then(response => {
        dispatchUpdatedStaff(response.data, dispatch);
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};


export const staffLogout = {
  type: STAFF_LOGOUT
}

export const registerForPushNotifications= async (staffId) => {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

  if (status !== 'granted') {
    alert('No notification permissions!');
    return null;
  }

  let token = await Notifications.getExpoPushTokenAsync();

  const req = {
    staffId,
    token: token
  }
  try {
    return await axios.post(STAFF_BASE_URL + "/registerPushNotificationToken", req)
  } catch (err){
    console.log(err)
    return null;
  }
}
