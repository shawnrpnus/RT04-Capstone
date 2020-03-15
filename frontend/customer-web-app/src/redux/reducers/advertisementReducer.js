import { RETRIEVE_ALL_ACTIVE_ADVERTISEMENT } from "./../actions/types";

const initialState = {
  advertisements: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RETRIEVE_ALL_ACTIVE_ADVERTISEMENT:
      return {
        ...state,
        advertisements: action.advertisements
      };
    default:
      return state;
  }
}
