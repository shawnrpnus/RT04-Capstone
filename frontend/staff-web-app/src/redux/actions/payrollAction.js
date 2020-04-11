import axios from "axios";
import * as types from "./types";
import { toast } from "react-toastify";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const PAYROLL_BASE_URL = "/api/payroll";
const jsog = require("jsog");

export const calculateMonthlySalary = (calculateMonthlyPayrollRequest, history) => {
    return dispatch => {
        axios
            .post(PAYROLL_BASE_URL + "/calculateMonthlySalary" , calculateMonthlyPayrollRequest)
            .then(response => {
                const { data } = jsog.decode(response);
                dispatch(calculateSuccess(data));
                toast.success("Success!", {
                    position: toast.POSITION.TOP_CENTER
                });
            })
            .catch(err => {
                dispatch(calculateError(err.response.data));
            });
    };
};

const calculateSuccess = data => ({
    type: types.CALCULATE_MONTHLY_SALARY,
    allSalary: data
});

const calculateError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

