import { combineReducers } from 'redux';
import sidebarReducer from "./sidebarReducer";
import storeReducer from "./storeReducer";
import errorReducer from "./errorReducer";
import tagReducer from "./tagReducer";


const rootReducer = combineReducers({
    errors: errorReducer,
    sidebar: sidebarReducer,
    store: storeReducer,
    tag: tagReducer
})

export default rootReducer;
