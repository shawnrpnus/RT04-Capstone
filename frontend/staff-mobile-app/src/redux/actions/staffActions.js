import {STAFF_LOGIN, STAFF_LOGOUT} from "src/redux/actions/types";
import { SPRING_BACKEND_URL } from "src/constants/routes";
import axios from "axios";
import {dispatchErrorMapError} from "src/redux/actions/index";

const jsog = require("jsog");

const STAFF_BASE_URL = SPRING_BACKEND_URL + "/api/staff";

const dispatchUpdatedStaff = (staffResponseData, dispatch) => {
  const staff = jsog.decode(staffResponseData);
  dispatch(updateStaff(staff));
};

const updateStaff = staff => ({
  type: STAFF_LOGIN,
  staff: staff
});

export const staffLogin = (req, setSnackbarOpen) => {
  return dispatch => {
    axios
      .post(STAFF_BASE_URL + "/loginStaff", req)
      .then(response => {
        dispatchUpdatedStaff(response.data, dispatch);
        setSnackbarOpen(true);
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const staffLogout = {
  type: STAFF_LOGOUT
}
