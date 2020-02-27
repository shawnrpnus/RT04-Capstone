import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
// middlewares
import thunk from "redux-thunk";
// Import custom components
import rootReducer from "../redux/reducers";

const middleware = [thunk];
const initialState = {};

const jsog = require("jsog");
const _ = require("lodash");

function saveToLocalStorage(state) {
  try {
    const serializedState = jsog.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (e) {
    console.log(e);
  }
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) return initialState;
    return jsog.parse(serializedState);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

let persistedState = loadFromLocalStorage();

/**
 * Create a Redux storeEntity that holds the app state.
 */
let store = createStore(
  rootReducer,
  persistedState,
  compose(applyMiddleware(...middleware))
);

if (window.navigator.userAgent.includes("Chrome")) {
  store = createStore(
    rootReducer,
    persistedState,
    composeWithDevTools(applyMiddleware(...middleware))
  );
}

const unsubscribe = store.subscribe(() => {
  saveToLocalStorage({
    customer: {
      loggedInCustomer: _.get(store.getState(), "customer.loggedInCustomer")
    }
  });
});

export default store;
