import * as types from "../actions/types";

const initialState = {
  priceRange: null,
  checkedColours: null,
  checkedSizes: null,
  checkedTags: null,
  selectedSort: null,
  orderStartDate: null,
  orderEndDate: null,
  orderCollectionMode: null,
  orderDeliveryStatus: null,
  orderSelectedSort: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_PRICE_RANGE:
      return {
        ...state,
        priceRange: action.data
      };
    case types.SET_CHECKED_COLOURS:
      return {
        ...state,
        checkedColours: action.data
      };
    case types.SET_CHECKED_SIZES:
      return {
        ...state,
        checkedSizes: action.data
      };
    case types.SET_CHECKED_TAGS:
      return {
        ...state,
        checkedTags: action.data
      };
    case types.SET_SELECTED_SORT:
      return {
        ...state,
        selectedSort: action.data
      };
    case types.SET_ORDER_START_DATE:
      return {
        ...state,
        orderStartDate: action.data
      };
    case types.SET_ORDER_END_DATE:
      return {
        ...state,
        orderEndDate: action.data
      };
    case types.SET_ORDER_DELIVERY_STATUS:
      return {
        ...state,
        orderDeliveryStatus: action.data
      };
    case types.SET_ORDER_COLLECTION_MODE:
      return {
        ...state,
        orderCollectionMode: action.data
      };
    case types.SET_ORDER_SELECTED_SORT:
      return {
        ...state,
        orderSelectedSort: action.data
      };
    default:
      return state;
  }
}
