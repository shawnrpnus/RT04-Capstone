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

    default:
      return state;
  }
}
