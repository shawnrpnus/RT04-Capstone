import * as types from "../actions/types";
const initialState = {
    currentLeave: null,
    allLeaves: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.APPLY_FOR_LEAVE:
            return {
                ...state,
                currentLeave: action.leave
            };
        case types.RETRIEVE_ALL_LEAVES:
            return {
                ...state,
                allLeaves: action.allLeaves
            };
        // case types.DELETE_LEAVE:
        //     return {
        //         ...state,
        //         currentLeave: action.deletedLeave
        //     };
        //
        // case types.UPDATE_PROMOCODE:
        //     return {
        //         ...state,
        //         currentPromoCode: action.updatedPromoCode
        //     };
        //
        // case types.RETRIEVE_PROMOCODE:
        //     return {
        //         ...state,
        //         currentPromoCode: action.retrievedPromoCode
        //     };
        default:
            return state;
    }
}