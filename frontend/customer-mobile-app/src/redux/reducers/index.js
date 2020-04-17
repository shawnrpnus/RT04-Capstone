import { combineReducers } from "redux";
import errorReducer from "src/redux/reducers/errorReducer";
import customerReducer from "src/redux/reducers/customerReducer";
import productReducer from "src/redux/reducers/productReducer";
import transactionReducer from "src/redux/reducers/transactionReducer";
import reservationReducer from "src/redux/reducers/reservationReducer";

const rootReducer = combineReducers({
  customer: customerReducer,
  errors: errorReducer,
  product: productReducer,
  transaction: transactionReducer,
  reservation: reservationReducer
});

export default rootReducer;
