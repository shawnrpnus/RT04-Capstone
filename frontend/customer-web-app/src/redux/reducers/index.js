import { combineReducers } from "redux";
import customerReducer from "redux/reducers/customerReducer";
import errorReducer from "redux/reducers/errorReducer";
import contactUsReducer from "./contactUsReducer";

const rootReducer = combineReducers({
  customer: customerReducer,
  contactUs: contactUsReducer,
  errors: errorReducer
});

export default rootReducer;
