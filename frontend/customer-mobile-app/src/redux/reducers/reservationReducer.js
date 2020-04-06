import * as types from "../actions/types";

const initialState = {
  upcomingReservations: null,
  pastReservations: null,
  viewedReservation: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_VIEWED_RESERVATION:
      return {
        ...state,
        viewedReservation: action.reservation
      };
    case types.RETRIEVE_UPCOMING_RESERVATIONS:
      return {
        ...state,
        upcomingReservations: action.reservations
      };
    case types.RETRIEVE_PAST_RESERVATIONS:
      return {
        ...state,
        pastReservations: action.reservations
      };
    default:
      return state;
  }
}
