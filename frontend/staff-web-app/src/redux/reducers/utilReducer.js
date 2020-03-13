import {
  OPEN_CIRCULAR_PROGRESS,
  CLOSE_CIRCULAR_PROGRESS
} from "../actions/types";

const initialState = {
  circularProgressOpen: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case OPEN_CIRCULAR_PROGRESS:
      return { circularProgressOpen: true };
    case CLOSE_CIRCULAR_PROGRESS:
      return { circularProgressOpen: false };
    default:
      return state;
  }
}
