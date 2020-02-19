import { combineReducers } from 'redux';
import sidebarReducer from "./sidebarReducer";


const rootReducer = combineReducers({
    products: [],
    sidebar: sidebarReducer,
})

export default rootReducer;
