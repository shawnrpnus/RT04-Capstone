import { combineReducers } from "redux";
import customerReducer from "redux/reducers/customerReducer";
import errorReducer from "redux/reducers/errorReducer";

const rootReducer = combineReducers({
  customer: customerReducer,
  errors: errorReducer
});

export default rootReducer;
