import { combineReducers } from 'redux';
import sidebarReducer from "./sidebarReducer";
import storeReducer from "./storeReducer";
import errorReducer from "./errorReducer";


const rootReducer = combineReducers({
    errors: errorReducer,
    sidebar: sidebarReducer,
    store: storeReducer
})

export default rootReducer;
