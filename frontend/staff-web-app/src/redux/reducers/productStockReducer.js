import * as types from "../actions/types";

const initialState = {
    currentProductStock: null,
    allProductStock: null,
    crudAction: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.RETRIEVE_PRODUCT_STOCK_BY_WAREHOUSE_ID:
            return {
                ...state,
                allProductStock: action.productStockEntities
            };
        case types.RETRIEVE_PRODUCT_STOCK_BY_STORE_ID:
            return {
                ...state,
                allProductStock: action.productStockEntities
            };
        case types.UPDATE_PRODUCT_STOCK:
            return {
                ...state,
                currentProductStock: action.productStockEntity
            };
        case types.RETRIEVE_ALL_PRODUCT_STOCKS:
            return {
                ...state,
                allProductStock: action.productStockEntities
            };
        default:
            return state;
    }
}