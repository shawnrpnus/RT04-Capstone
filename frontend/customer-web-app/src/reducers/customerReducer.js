import * as types from "../actions/types";

const initialState = {
    registeredCustomer: {},
    loggedInCustomer: {}
}


export default function(state = initialState, action){
    switch (action.type){
        case types.CREATE_NEW_CUSTOMER:
            return {
                ...state,
                registeredCustomer: action.customer
            };
        case types.CUSTOMER_LOGIN:
            return {
                ...state,
                loggedInCustomer: action.customer
            }
        default:
            return state;
    }
}
