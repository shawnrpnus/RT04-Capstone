import { combineReducers } from 'redux';
import errorReducer from "./errorReducer";
import customerReducer from "./customerReducer";

const rootReducer = combineReducers({
    errors: errorReducer,
    customer: customerReducer
})

export default rootReducer;
