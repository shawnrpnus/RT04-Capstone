import axios from "axios";
import * as types from "./types";
import { emailSent, refreshCustomer } from "./customerActions";
import { EMAIL_SENT } from "./types";
import { CONTACT_US_SUCCESS } from "./types";
import { GET_ERRORS } from "./types";
import { dispatchErrorMapError } from "redux/actions/index";
import { UPDATE_UPCOMING_RESERVATIONS } from "./types";

const RESERVATION_BASE_URL = "/api/reservation";

const _ = require("lodash");
const jsog = require("jsog");

export const retrieveStoresWithStockStatus = customerId => {
  return dispatch => {
    axios
      .get(RESERVATION_BASE_URL + "/getStoresStockStatusForCart", {
        params: { customerId: customerId }
      })
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(updateStoresWithStockStatus(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const updateStoresWithStockStatus = data => ({
  type: types.GET_STORES_WITH_STOCK_STATUS,
  storesWithStockStatus: data
});

export const getProductVariantStoreStockStatus = (customerId, storeId) => {
  return dispatch => {
    axios
      .get(RESERVATION_BASE_URL + "/getProdVariantStoreStockStatus", {
        params: { customerId, storeId }
      })
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(updateProductVariantStoreStockStatus(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const updateProductVariantStoreStockStatus = data => ({
  type: types.GET_PROD_VAR_STORE_STOCK_STATUS,
  prodVariantToStock: data
});

export const clearProductVariantStoreStockStatus = () => ({
  type: types.CLEAR_PROD_VAR_STORE_STOCK_STATUS
});

export const getAvailSlotsForStore = storeId => {
  return dispatch => {
    axios
      .get(RESERVATION_BASE_URL + "/getAvailSlotsForStore", {
        params: { storeId }
      })
      .then(response => {
        const data = jsog.decode(response.data);
        console.log(data);
        dispatch(updateAvailSlotsForStore(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

export const updateAvailSlotsForStore = data => ({
  type: types.GET_AVAIL_SLOTS_FOR_STORE,
  availSlotsForStore: data
});

const moment = require("moment");

export const createReservation = (
  customerId,
  storeId,
  reservationDateTime,
  customerEmail,
  enqueueSnackbar
) => {
  reservationDateTime = moment(reservationDateTime).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  return dispatch => {
    axios
      .post(RESERVATION_BASE_URL + "/createReservation", {
        customerId,
        storeId,
        reservationDateTime
      })
      .then(response => {
        dispatch(refreshCustomer(customerEmail));
        enqueueSnackbar("Reservation made!", {
          variant: "success",
          autoHideDuration: 1200
        });
      })
      .catch(err => dispatchErrorMapError(err, dispatch));
  };
};

export const getUpcomingReservations = customerId => {
  return dispatch => {
    axios
      .get(RESERVATION_BASE_URL + "/getUpcomingReservations", {
        params: { customerId }
      })
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(updateUpcomingReservations(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const updateUpcomingReservations = data => ({
  type: UPDATE_UPCOMING_RESERVATIONS,
  reservations: data
});
