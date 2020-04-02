import * as types from "../actions/types";
import {AsyncStorage} from "react-native";
import {SplashScreen} from "expo";

const initialState = {
  loggedInCustomer: null,
  shoppingCartItemsStock: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.CUSTOMER_LOGIN:
      return {
        ...state,
        loggedInCustomer: action.customer
      }
    case types.LOAD_LOGGED_IN_CUSTOMER:
      return {
        ...state,
        loggedInCustomer: action.customer
      }
    case types.CUSTOMER_LOGOUT:
      return {
        ...state,
        loggedInCustomer: null
      }
    case types.UPDATE_SHOPPING_CART_ITEMS_STOCK:
      return {
        ...state,
        shoppingCartItemsStock: action.data
      }
    default:
      return state;
  }
}
