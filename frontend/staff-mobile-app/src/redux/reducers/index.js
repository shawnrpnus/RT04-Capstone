import { combineReducers } from "redux";
import staffReducer from "src/redux/reducers/staffReducer";
import productReducer from "src/redux/reducers/productReducer";
import reservationReducer from "src/redux/reducers/reservationReducer";

const rootReducer = combineReducers({
  staff: staffReducer,
  product: productReducer,
  reservation: reservationReducer,
});

export default rootReducer;
