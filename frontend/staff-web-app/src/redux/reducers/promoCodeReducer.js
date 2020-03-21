import * as types from "../actions/types";

const initialState = {
    currentPromoCode: null,
    allPromoCodes: null,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.CREATE_PROMOCODE:
            return {
                ...state,
                currentPromoCode: action.promoCode
            };
        case types.RETRIEVE_ALL_PROMOCODES:
            return {
                ...state,
                allPromoCodes: action.allPromoCodes
            };
        case types.DELETE_PROMOCODE:
            return {
                ...state,
                currentPromoCode: action.deletedPromoCode
            };
        default:
            return state;
    }
}