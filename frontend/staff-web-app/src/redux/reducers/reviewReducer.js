import * as types from "../actions/types";

const initialState = {
  // currentReview: [],
  allReviews: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_ALL_REVIEWS:
      return {
        ...state,
        allReviews: action.reviewEntities
      };
    // case types.DELETE_REVIEW:
    //   return {
    //     ...state,
    //     currentReview: action.deletedReview
    //   };
    default:
      return state;
  }
}
