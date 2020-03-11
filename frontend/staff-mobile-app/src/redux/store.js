import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import * as SecureStore from 'expo-secure-store';
import { AsyncStorage } from 'react-native';
// middlewares
import thunk from "redux-thunk";
// Import custom components
import rootReducer from "../redux/reducers";

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

async function loadFromSecureStore() {
  try {
    const serializedState = await AsyncStorage.getItem("state");
    if (!serializedState) return initialState;
    return jsog.parse(serializedState);
  } catch (e) {
    console.log(e);
    return initialState;
  }
}

let persistedState = loadFromSecureStore();

/**
 * Create a Redux storeEntity that holds the app state.
 */
let store = createStore(
  rootReducer,
  persistedState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// if (window.navigator.userAgent.includes("Chrome")) {
//   store = createStore(
//     rootReducer,
//     persistedState,
//     composeWithDevTools(applyMiddleware(...middleware))
//   );
// }

const unsubscribe = store.subscribe(() => {
  saveToSecureStore({
    staff: {
      loggedInStaff: _.get(store.getState(), "staff.loggedInStaff")
    }
  });
});

export default store;
