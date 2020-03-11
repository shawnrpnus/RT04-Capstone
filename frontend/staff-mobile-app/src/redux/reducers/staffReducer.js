import * as types from "../actions/types";

const initialState = {
  loggedInStaff: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.STAFF_LOGIN:
      return {
        ...state,
        loggedInStaff: action.staff
      }
    case types.LOAD_LOGGED_IN_STAFF:
      return {
        ...state,
        loggedInStaff: action.staff
      }
    default:
      return state;
  }
}
