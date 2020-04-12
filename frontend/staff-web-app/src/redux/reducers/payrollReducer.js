import * as types from "../actions/types";
const initialState = {
    allSalary : null,
    allPayrolls : null,
    allPayrollsStaff: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.CALCULATE_MONTHLY_SALARY:
            return {
                ...state,
                allSalary: action.allSalary
            };

        case types.CREATE_PAYROLLS:
            return {
                ...state,
                allPayrolls: action.allPayrolls
            };

        case types.RETRIEVE_ALL_PAYROLLS:
            return {
                ...state,
                allPayrollsStaff: action.allPayrollsStaff
            };

        case types.RETRIEVE_PAYROLLS_FOR_A_MONTH:
            return {
                ...state,
                allPayrolls: action.allPayrolls
            };

        default:
            return state;
    }
}
