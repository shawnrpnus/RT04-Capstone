import * as types from "../actions/types";

const initialState = {
  basket: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_MARKET_BASKET_ANALYSIS:
      return {
        ...state,
        basket: action.basket
      };
    default:
      return state;
  }
}
