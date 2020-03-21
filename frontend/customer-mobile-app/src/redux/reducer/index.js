import { combineReducers } from "redux";
import errorReducer from "src/redux/reducer/errorReducer";
import customerReducer from "src/redux/reducer/customerReducer";

const rootReducer = combineReducers({
  customer: customerReducer,
  errors: errorReducer
});

export default rootReducer;
