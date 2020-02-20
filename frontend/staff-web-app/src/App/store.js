import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
// middlewares
import thunk from "redux-thunk";
// Import custom components
import rootReducer from "../redux/reducers";

const middleware = [thunk];
const initialState = {};

function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (e) {
    console.log(e);
  }
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) return initialState;
    return JSON.parse(serializedState);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

let persistedState = loadFromLocalStorage();
persistedState = {};
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
// const unsubscribe = store.subscribe(() => {
//     const state = store.getState();
//     saveToLocalStorage(state);
// });

export default store;
