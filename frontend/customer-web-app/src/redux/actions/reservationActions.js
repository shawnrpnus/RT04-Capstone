import axios from "axios";
import * as types from "./types";
import { emailSent, refreshCustomer } from "./customerActions";
import { EMAIL_SENT } from "./types";
import { CONTACT_US_SUCCESS } from "./types";
import { GET_ERRORS } from "./types";
import { dispatchErrorMapError } from "redux/actions/index";
import { UPDATE_UPCOMING_RESERVATIONS } from "./types";
import { UPDATE_PAST_RESERVATIONS } from "./types";
import { SET_UPDATING_RESERVATION } from "./types";
import { SET_UPDATED_PRODUCT_VARIANTS } from "./types";

const RESERVATION_BASE_URL = "/api/reservation";

const _ = require("lodash");
const jsog = require("jsog");

export const retrieveStoresWithStockStatusForCart = customerId => {
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

export const retrieveStoresWithStockStatusForReservation = reservationId => {
  return dispatch => {
    axios
      .get(RESERVATION_BASE_URL + "/getStoresStockStatusForReservation", {
        params: { reservationId }
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
  enqueueSnackbar,
  history
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
        dispatch(refreshCustomer(customerEmail)); //for emptying reservation cart
        enqueueSnackbar("Reservation made!", {
          variant: "success",
          autoHideDuration: 1200
        });
        history.push("/account/reservation/upcoming");
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

export const getPastReservations = customerId => {
  return dispatch => {
    axios
      .get(RESERVATION_BASE_URL + "/getPastReservations", {
        params: { customerId }
      })
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(updatePastReservations(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const updatePastReservations = data => ({
  type: UPDATE_PAST_RESERVATIONS,
  reservations: data
});

export const cancelReservation = (
  reservationId,
  customerId,
  enqueueSnackbar
) => {
  return dispatch => {
    axios
      .post(RESERVATION_BASE_URL + "/cancelReservation", null, {
        params: { reservationId }
      })
      .then(response => {
        dispatch(getUpcomingReservations(customerId));
        enqueueSnackbar("Reservation cancelled!", {
          variant: "success",
          autoHideDuration: 1200
        });
      })
      .catch(err => {
        const errorMap = _.get(err, "response.data", null);
        if (_.get(errorMap, "reservationDateTime")) {
          enqueueSnackbar(_.get(errorMap, "reservationDateTime"), {
            variant: "error",
            autoHideDuration: 1200
          });
        }
      });
  };
};

export const updateReservation = (
  reservationId,
  newStoreId,
  newReservationDateTime,
  customerId,
  enqueueSnackbar,
  history
) => {
  newReservationDateTime = moment(newReservationDateTime).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  return dispatch => {
    axios
      .post(RESERVATION_BASE_URL + "/updateReservation", {
        reservationId,
        newStoreId,
        newReservationDateTime
      })
      .then(response => {
        dispatch(getUpcomingReservations(customerId));
        enqueueSnackbar("Reservation updated!", {
          variant: "success",
          autoHideDuration: 1200
        });
        history.push("/account/reservation/upcoming");
      })
      .catch(err => {
        const errorMap = _.get(err, "response.data", null);
        if (_.get(errorMap, "reservationDateTime")) {
          enqueueSnackbar(_.get(errorMap, "reservationDateTime"), {
            variant: "error",
            autoHideDuration: 1200
          });
        }
      });
  };
};

export const retrieveReservationById = reservationId => {
  return dispatch => {
    axios
      .get(RESERVATION_BASE_URL + "/retrieveReservationById", {
        params: { reservationId }
      })
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(setUpdatingReservation(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const setUpdatingReservation = data => ({
  type: SET_UPDATING_RESERVATION,
  reservation: data
});
