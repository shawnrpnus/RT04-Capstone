import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import * as SecureStore from 'expo-secure-store';
import { AsyncStorage } from 'react-native';
// middlewares
import thunk from "redux-thunk";
// Import custom components
import rootReducer from "../redux/reducers";
import {LOAD_LOGGED_IN_CUSTOMER} from "src/redux/actions/types";
import {SplashScreen} from "expo";

const middleware = [thunk];
const initialState = {};

const jsog = require("jsog");
const _ = require("lodash");

async function saveToSecureStore(state) {
  try {
    const serializedState = jsog.stringify(state);
    await AsyncStorage.setItem("state", serializedState);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Create a Redux storeEntity that holds the app state.
 */
let store = createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(...middleware))
);

const loadLoggedInCustomer = () => {
  return dispatch => {
    AsyncStorage.getItem("state", (err, result) => {
      if (err){
        console.log(err);
        SplashScreen.hide();
        return initialState;
      }
      console.log(result)
      if (_.get(jsog.parse(result), "customer.loggedInCustomer")){
        console.log("HERE")
        dispatch({
          type: LOAD_LOGGED_IN_CUSTOMER,
          customer: jsog.parse(result).customer.loggedInCustomer
        })
      } else {
        SplashScreen.hide();
      }
    });
  }
}

const unsubscribe = store.subscribe(() => {
  saveToSecureStore({
    customer: {
      loggedInCustomer: _.get(store.getState(), "customer.loggedInCustomer")
    }
  });
});

//populate store with logged in customer
store.dispatch(loadLoggedInCustomer());

export default store;



// async function loadFromSecureStore() {
//   try {
//     const serializedState = await AsyncStorage.getItem("state");
//     if (!serializedState) return initialState;
//     return jsog.parse(serializedState);
//   } catch (e) {
//     console.log(e);
//     return initialState;
//   }
// }


// if (window.navigator.userAgent.includes("Chrome")) {
//   store = createStore(
//     rootReducer,
//     persistedState,
//     composeWithDevTools(applyMiddleware(...middleware))
//   );
// }
