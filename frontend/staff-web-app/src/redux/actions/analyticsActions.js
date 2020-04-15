import axios from "axios";
import { dispatchErrorMapError } from "./index";
import {
  RETRIEVE_RESERVATIONS_BY_TIMESLOT,
  RETRIEVE_SALES_BY_DAY,
  RETRIEVE_TRANSACTION_BY_ORDER_NUMBER_SUCCESS
} from "./types";
import { toast } from "react-toastify";
import { retrieveAllStores } from "./storeActions";

axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;
const TRANSACTION_BASE_URL = "/api/transaction";
const RESERVATION_BASE_URL = "/api/reservation";
const STORE_BASE_URL = "/api/store";
const jsog = require("jsog");

export const retrieveSalesByDay = (
  fromDateString,
  toDateString,
  fromStoreIds,
  onlineSelected
) => {
  return dispatch =>
    axios
      .post(TRANSACTION_BASE_URL + "/retrieveSalesByDay", {
        fromDateString,
        toDateString,
        fromStoreIds,
        onlineSelected
      })
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(retrieveSalesByDaySuccess(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
};

export const retrieveSalesByDaySuccess = data => ({
  type: RETRIEVE_SALES_BY_DAY,
  salesByDay: data
});

export const retrieveReservationsByTimeslot = (
  fromDateString,
  toDateString,
  storeIds
) => {
  return dispatch =>
    axios
      .post(RESERVATION_BASE_URL + "/retrieveReservationsByTimeslot", {
        fromDateString,
        toDateString,
        storeIds
      })
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(retrieveReservationsByTimeslotSuccess(data));
      })
      .catch(err => {
        console.log(err);
      });
};

const retrieveReservationsByTimeslotSuccess = data => ({
  type: RETRIEVE_RESERVATIONS_BY_TIMESLOT,
  reservationsByTimeslot: data
});

export const analytics_updateStore = (store) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(STORE_BASE_URL + "/updateStore", store)
      .then(response => {
        dispatch(retrieveAllStores());
        toast.success("Store Updated!", {
          position: toast.POSITION.TOP_CENTER
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};
