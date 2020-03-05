import * as types from "../actions/types";

const initialState = {
  allContactUsCategoryEnum: [],
  currentContactUs: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RETRIEVE_ALL_CONTACT_US_CATEGORY_ENUM_SUCCESS:
      return {
        ...state,
        allContactUsCategoryEnum: action.allContactUsCategoryEnum
      };
    case types.CONTACT_US_SUCCESS:
      return {
        ...state,
        currentContactUs: action.currentContactUs
      };
    case action.type === "clearEnum":
      return {
        ...state,
        allContactUsCategoryEnum: []
      };
    default:
      return state;
  }
}
