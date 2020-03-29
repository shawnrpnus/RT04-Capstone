import * as types from "../actions/types";

const initialState = {
  instagramPosts: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_ALL_INSTAGRAM_POST:
      return {
        ...state,
        instagramPosts: action.instagramPosts
      };
    default:
      return state;
  }
}
