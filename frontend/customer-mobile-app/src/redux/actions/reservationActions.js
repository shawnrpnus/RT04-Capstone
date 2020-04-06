import { SPRING_BACKEND_URL } from "src/constants/routes";
import {
  RETRIEVE_PAST_RESERVATIONS,
  RETRIEVE_RESERVATIONS,
  RETRIEVE_TXNS,
  RETRIEVE_UPCOMING_RESERVATIONS,
  UPDATE_VIEWED_RESERVATION,
  UPDATE_VIEWED_TXN
} from "src/redux/actions/types";
import axios from "axios";

const jsog = require("jsog");

const RESERVATION_BASE_URL = SPRING_BACKEND_URL + "/api/reservation";

export const setViewedReservation = (
  reservationId,
  redirectFunction,
  setLoading
) => {
  if (setLoading) setLoading(true);
  return dispatch => {
    axios
      .get(RESERVATION_BASE_URL + "/retrieveReservationById", {
        params: { reservationId }
      })
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(updateViewedReservation(data));
        if (redirectFunction) redirectFunction();
        if (setLoading) setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
};

const updateViewedReservation = data => ({
  type: UPDATE_VIEWED_RESERVATION,
  reservation: data
});

export const retrieveUpcomingReservations = (customerId, setLoading) => {
  if (setLoading) setLoading(true);
  return dispatch => {
    axios
      .get(RESERVATION_BASE_URL + `/getUpcomingReservations`, {
        params: { customerId }
      })
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(updateUpcomingReservations(data));
        if (setLoading) setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const retrievePastReservations = (customerId, setLoading) => {
  if (setLoading) setLoading(true);
  return dispatch => {
    axios
      .get(RESERVATION_BASE_URL + `/getPastReservations`, {
        params: { customerId }
      })
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(updatePastReservations(data));
        if (setLoading) setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
};

const updateUpcomingReservations = data => ({
  type: RETRIEVE_UPCOMING_RESERVATIONS,
  reservations: data
});

const updatePastReservations = data => ({
  type: RETRIEVE_PAST_RESERVATIONS,
  reservations: data
});

export const markReservationAttendance = (reservationId, setLoading, customerId) => {
  setLoading(true);
  return dispatch => {
    axios
      .post(RESERVATION_BASE_URL + "/updateReservationStatus", {
        reservationId,
        isAttended: true
      })
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(updateViewedReservation(data));
        dispatch(retrieveUpcomingReservations(customerId))
        dispatch(retrievePastReservations(customerId))
        if (setLoading) setLoading(false);
        alert("Thank you!\nYour attendance has been noted.");
      });
  };
};
