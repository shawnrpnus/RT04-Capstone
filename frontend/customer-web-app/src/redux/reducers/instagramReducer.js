import { RETRIEVE_ALL_ACTIVE_INSTAGRAM_POST } from "redux/actions/types";

const initialState = {
  instagramPosts: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RETRIEVE_ALL_ACTIVE_INSTAGRAM_POST:
      return {
        ...state,
        instagramPosts: action.instagramPosts
      };
    default:
      return state;
  }
}
