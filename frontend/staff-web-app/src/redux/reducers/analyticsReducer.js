import * as types from "../actions/types";

const initialState = {
  salesByDay: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_SALES_BY_DAY:
      return {
        ...state,
        salesByDay: action.salesByDay
      };
    default:
      return state;
  }
}
