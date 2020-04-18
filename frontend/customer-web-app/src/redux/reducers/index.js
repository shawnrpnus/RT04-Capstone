import { combineReducers } from "redux";
import customerReducer from "redux/reducers/customerReducer";
import errorReducer from "redux/reducers/errorReducer";
import contactUsReducer from "redux/reducers/contactUsReducer";
import categoryReducer from "redux/reducers/categoryReducer";
import productReducer from "redux/reducers/productReducer";
import tagReducer from "redux/reducers/tagReducer";
import filterBarReducer from "redux/reducers/filterBarReducer";
import reservationReducer from "redux/reducers/reservationReducer";
import reviewReducer from "./reviewReducer";
import transactionReducer from "redux/reducers/transactionReducer";
import advertisementReducer from "redux/reducers/advertisementReducer";
import instagramReducer from "redux/reducers/instagramReducer";
import storeReducer from "./storeReducer";
import styleReducer from "redux/reducers/styleReducer";
import refundReducer from "./refundReducer";

const rootReducer = combineReducers({
  customer: customerReducer,
  contactUs: contactUsReducer,
  errors: errorReducer,
  category: categoryReducer,
  product: productReducer,
  review: reviewReducer,
  tag: tagReducer,
  filterBar: filterBarReducer,
  refund: refundReducer,
  reservation: reservationReducer,
  advertisement: advertisementReducer,
  transaction: transactionReducer,
  instagram: instagramReducer,
  store: storeReducer,
  style: styleReducer
});

export default rootReducer;
