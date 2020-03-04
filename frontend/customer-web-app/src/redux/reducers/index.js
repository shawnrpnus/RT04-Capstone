import { combineReducers } from "redux";
import customerReducer from "redux/reducers/customerReducer";
import errorReducer from "redux/reducers/errorReducer";
import contactUsReducer from "./contactUsReducer";
import categoryReducer from "redux/reducers/categoryReducer";
import productReducer from "redux/reducers/productReducer";
import tagReducer from "redux/reducers/tagReducer";
import filterBarReducer from "redux/reducers/filterBarReducer";
import reservationReducer from "redux/reducers/reservationReducer";
import transactionReducer from "redux/reducers/transactionReducer";

const rootReducer = combineReducers({
  customer: customerReducer,
  contactUs: contactUsReducer,
  errors: errorReducer,
  category: categoryReducer,
  product: productReducer,
  tag: tagReducer,
  filterBar: filterBarReducer,
  reservation: reservationReducer,
  transaction: transactionReducer
});

export default rootReducer;
