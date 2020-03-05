import axios from "axios";
import { dispatchErrorMapError } from "redux/actions/index";
import {
  RETRIEVE_ROOT_CATEGORIES,
  SET_CHECKED_COLOURS,
  SET_CHECKED_SIZES,
  SET_CHECKED_TAGS,
  SET_ORDER_COLLECTION_MODE,
  SET_ORDER_DELIVERY_STATUS,
  SET_ORDER_END_DATE,
  SET_ORDER_SELECTED_SORT,
  SET_ORDER_START_DATE,
  SET_PRICE_RANGE,
  SET_SELECTED_SORT
} from "redux/actions/types";

export const setPriceRange = data => ({
  type: SET_PRICE_RANGE,
  data: data
});

export const setCheckedColours = data => ({
  type: SET_CHECKED_COLOURS,
  data: data
});

export const setCheckedSizes = data => ({
  type: SET_CHECKED_SIZES,
  data: data
});

export const setCheckedTags = data => ({
  type: SET_CHECKED_TAGS,
  data: data
});

export const setSelectedSort = data => ({
  type: SET_SELECTED_SORT,
  data: data
});

export const setOrderStartDate = data => ({
  type: SET_ORDER_START_DATE,
  data: data
});
export const setOrderEndDate = data => ({
  type: SET_ORDER_END_DATE,
  data: data
});
export const setOrderCollectionMode = data => ({
  type: SET_ORDER_COLLECTION_MODE,
  data: data
});
export const setOrderDeliveryStatus = data => ({
  type: SET_ORDER_DELIVERY_STATUS,
  data: data
});
export const setOrderSelectedSort = data => ({
  type: SET_ORDER_SELECTED_SORT,
  data: data
});
