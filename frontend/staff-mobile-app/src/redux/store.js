import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import * as SecureStore from 'expo-secure-store';
// middlewares
import thunk from "redux-thunk";
// Import custom components
import rootReducer from "../redux/reducers";

const middleware = [thunk];
const initialState = {};

const jsog = require("jsog");
const _ = require("lodash");

function saveToSecureStore(state) {
  try {
    const serializedState = jsog.stringify(state);
    SecureStore.setItemAsync("state", serializedState);
  } catch (e) {
    console.log(e);
  }
}

function loadFromSecureStore() {
  try {
    const serializedState = SecureStore.getItemAsync("state");
    if (serializedState === null) return initialState;
    return jsog.parse(serializedState);
  } catch (e) {
    console.log(e);
    return undefined;
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
