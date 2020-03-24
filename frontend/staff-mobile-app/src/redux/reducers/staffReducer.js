import * as types from "../actions/types";
import {AsyncStorage} from "react-native";
import {SplashScreen} from "expo";

const initialState = {
  loggedInStaff: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.STAFF_LOGIN:
      return {
        ...state,
        loggedInStaff: action.staff
      }
    case types.LOAD_LOGGED_IN_STAFF:
      return {
        ...state,
        loggedInStaff: action.staff
      }
    case types.STAFF_LOGOUT:
      return {
        ...state,
        loggedInStaff: null
      }
    default:
      return state;
  }
}
