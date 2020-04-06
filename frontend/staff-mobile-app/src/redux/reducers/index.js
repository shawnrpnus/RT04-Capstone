import { combineReducers } from "redux";
import staffReducer from "src/redux/reducers/staffReducer";
import productReducer from "src/redux/reducers/productReducer";
import reservationReducer from "src/redux/reducers/reservationReducer";
import errorReducer from "src/redux/reducers/errorReducer";
import deliveryReducer from "src/redux/reducers/deliveryReducer";

const rootReducer = combineReducers({
  staff: staffReducer,
  product: productReducer,
  reservation: reservationReducer,
  errors: errorReducer,
  delivery: deliveryReducer
});

export default rootReducer;
