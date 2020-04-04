import { combineReducers } from "redux";
import errorReducer from "src/redux/reducers/errorReducer";
import customerReducer from "src/redux/reducers/customerReducer";
import productReducer from "src/redux/reducers/productReducer";
import transactionReducer from "src/redux/reducers/transactionReducer";

const rootReducer = combineReducers({
  customer: customerReducer,
  errors: errorReducer,
  product: productReducer,
  transaction: transactionReducer
});

export default rootReducer;
