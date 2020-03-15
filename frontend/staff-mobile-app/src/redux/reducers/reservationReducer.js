import * as types from "../actions/types";

const initialState = {
  upcomingReservations: null,
  displayedReservation: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.DISPLAY_UPCOMING_RESERVATIONS:
      return {
        ...state,
        upcomingReservations: action.reservations
      }
    case types.DISPLAY_RESERVATION:
      return {
        ...state,
        displayedReservation: action.reservation
      }
    default:
      return state;
  }
}
