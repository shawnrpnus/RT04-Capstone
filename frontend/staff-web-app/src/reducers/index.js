import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    data: null,
    cartList: null,
    filters: null,
    wishlist: null,
    compare: null
});

export default rootReducer;
