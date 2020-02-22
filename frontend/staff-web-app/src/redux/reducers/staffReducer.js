import * as types from "../actions/types";

const initialState = {
    currentStaff: null,
    allStaff: null,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.CREATE_STAFF:
            return {
                ...state,
                currentStaff: action.staffEntity
            };
        case types.RETRIEVE_STAFF:
            return {
                ...state,
                currentStaff: action.staffEntity
            };

        case types.CREATE_STAFF_ACCOUNT:
            return {
                ...state,
                currentStaff: action.staffEntity
            };
        case types.RETRIEVE_ALL_STAFF:
            return {
                ...state,
                allStaff: action.staffEntity
            };
        case types.CHANGE_STAFF_PASSWORD:
            return {
                ...state,
                currentStaff: action.staffEntity
            };
        case types.RESET_STAFF_PASSWORD:
            return {
                ...state,
                currentStaff:action.staffEntity
            };
        default:
            return state;
    }
}
