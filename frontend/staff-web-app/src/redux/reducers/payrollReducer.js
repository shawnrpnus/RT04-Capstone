import * as types from "../actions/types";
const initialState = {
    allSalary : null,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.CALCULATE_MONTHLY_SALARY:
            return {
                ...state,
                allSalary: action.allSalary
            };
        default:
            return state;
    }
}
