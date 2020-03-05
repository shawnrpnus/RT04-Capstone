import * as types from "../actions/types";
import { UPDATE_REVIEW_BY_REVIEW_ID_SUCCESS } from "../actions/types";

const initialState = {
  allReviews: null,
  currReview: null,
  canWrite: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_ALL_REVIEWS_BY_PRODUCT_ID_SUCCESS:
      return {
        ...state,
        allReviews: action.allReviews
      };
    case types.UPDATE_REVIEW_BY_REVIEW_ID_SUCCESS:
      return {
        ...state,
        currReview: action.currReview
      };
    case types.DELETE_REVIEW_BY_REVIEW_ID_SUCCESS:
      return {
        ...state,
        currReview: action.currReview
      };
    case types.CREATE_REVIEW_BY_REVIEW_ID_SUCCESS:
      return {
        ...state,
        currReview: action.currReview
      };
    case types.CHECK_IF_CAN_WRITE_REVIEW_SUCCESS:
      return {
        ...state,
        canWrite: action.canWrite
      };
    default:
      return state;
  }
}
