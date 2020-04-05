import * as types from "../actions/types";

const initialState = {
  currentStyle: null,
  allStyles: null,
  crudAction: null,
  allProducts: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_STYLE:
      return {
        ...state,
        currentStyle: action.style
      };
    case types.RETRIEVE_ALL_STYLES:
      return {
        ...state,
        allStyles: action.allStyles
      };
    case types.UPDATE_STYLE:
      return {
        ...state,
        currentStyle: action.style
      };
    case types.DELETE_STYLE:
      return {
        ...state,
        currentStyle: action.deletedStyle
      };
    case types.ADD_STYLE_TO_PRODUCTS:
      return {
        ...state,
        currentStyle: action.style
      };
    case types.DELETE_STYLE_FROM_PRODUCTS:
      return {
        ...state,
        currentStyle: action.style
      };
    default:
      return state;
  }
}
