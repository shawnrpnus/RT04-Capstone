import { RETRIEVE_ALL_STORE } from "redux/actions/types";

const initialState = {
  stores: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RETRIEVE_ALL_STORE:
      return {
        ...state,
        stores: action.stores
      };
    default:
      return state;
  }
}
