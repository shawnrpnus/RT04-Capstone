import { combineReducers } from "redux";
import errorReducer from "src/redux/reducers/errorReducer";
import customerReducer from "src/redux/reducers/customerReducer";
import productReducer from "src/redux/reducers/productReducer";

const rootReducer = combineReducers({
  customer: customerReducer,
  errors: errorReducer,
  product: productReducer
});

export default rootReducer;
