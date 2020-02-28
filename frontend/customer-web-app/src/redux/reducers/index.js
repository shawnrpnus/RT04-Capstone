import { combineReducers } from "redux";
import customerReducer from "redux/reducers/customerReducer";
import errorReducer from "redux/reducers/errorReducer";
import categoryReducer from "redux/reducers/categoryReducer";

const rootReducer = combineReducers({
  customer: customerReducer,
  errors: errorReducer,
  category: categoryReducer
});

export default rootReducer;
