import * as types from "../actions/types";

const initialState = {
    currentCustomer: {}
}


export default function(state = initialState, action){
    switch (action.type){
        case types.CREATE_NEW_CUSTOMER:
            return {
                ...state,
                currentCustomer: action.customer
            };
        default:
            return state;
    }
}
