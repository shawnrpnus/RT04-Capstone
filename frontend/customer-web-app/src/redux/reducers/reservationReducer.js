import * as types from "../actions/types";

const initialState = {
  storesWithStockStatus: null,
  prodVariantToStoreStock: {},
  availSlotsForStore: null,
  upcomingReservations: null,
  pastReservations: null,
  reservationToUpdate: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_STORES_WITH_STOCK_STATUS:
      return {
        ...state,
        storesWithStockStatus: action.storesWithStockStatus
      };
    case types.GET_PROD_VAR_STORE_STOCK_STATUS:
      return {
        ...state,
        prodVariantToStoreStock: action.prodVariantToStock
      };
    case types.CLEAR_PROD_VAR_STORE_STOCK_STATUS:
      return {
        ...state,
        prodVariantToStoreStock: {}
      };
    case types.GET_AVAIL_SLOTS_FOR_STORE:
      return {
        ...state,
        availSlotsForStore: action.availSlotsForStore
      };
    case types.UPDATE_UPCOMING_RESERVATIONS:
      return {
        ...state,
        upcomingReservations: action.reservations.sort((a, b) =>
          a.reservationDateTime.localeCompare(b.reservationDateTime)
        )
      };
    case types.UPDATE_PAST_RESERVATIONS:
      return {
        ...state,
        pastReservations: action.reservations.sort((a, b) =>
          b.reservationDateTime.localeCompare(a.reservationDateTime)
        )
      };
    case types.SET_UPDATING_RESERVATION:
      return {
        ...state,
        reservationToUpdate: action.reservation
      };
    default:
      return state;
  }
}
