import axios from "axios";
import { dispatchErrorMapError } from "src/redux/actions/index";

import { SPRING_BACKEND_URL } from "src/constants/routes";
import {
  DISPLAY_RESERVATION,
  DISPLAY_UPCOMING_RESERVATIONS
} from "src/redux/actions/types";

const jsog = require("jsog");

const RESERVATION_BASE_URL = SPRING_BACKEND_URL + "/api/reservation";

export const retrieveUpcomingReservations = (storeId, setRefreshing) => {
  return dispatch => {
    axios
      .get(RESERVATION_BASE_URL + "/getReservationsForStore", {
        params: { storeId }
      })
      .then(response => {
        updateDisplayedReservations(response, dispatch);
        if (setRefreshing){
          setRefreshing(false);
        }
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const updateDisplayedReservations = (response, dispatch) => {
  const reservations = jsog.decode(response.data);
  dispatch({
    type: DISPLAY_UPCOMING_RESERVATIONS,
    reservations: reservations
  });
};

export const retrieveReservation = reservationId => {
  return dispatch => {
    axios
      .get(RESERVATION_BASE_URL + "/retrieveReservationById", {
        params: { reservationId }
      })
      .then(response => {
        updateDisplayedReservation(response, dispatch);
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const updateDisplayedReservation = (response, dispatch) => {
  const reservation = jsog.decode(reservation);
  dispatch({
    type: DISPLAY_RESERVATION,
    reservation: reservation
  });
};
