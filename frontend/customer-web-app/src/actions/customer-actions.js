import axios from "axios";
import {CREATE_NEW_CUSTOMER, GET_ERRORS} from "./types";

const CUSTOMER_BASE_URL = "/api/customer/";

export const createNewCustomer = (createCustomerRequest, history) => {
    return (dispatch) => {
        //redux thunk passes dispatch
        axios
            .post(CUSTOMER_BASE_URL + "createNewCustomer", createCustomerRequest)
            .then(response => {
                dispatch(createCustomerSuccess(response));
                history.push("/login"); // TODO: update redirect path
            })
            .catch(err => {
                dispatch(createCustomerError(err.response.data));
                console.log(err.response.data);
            });
    };
};

const createCustomerSuccess = response => ({
    type: CREATE_NEW_CUSTOMER,
    customer: response
})

const createCustomerError = response => ({
    type: GET_ERRORS,
    errorMap: response
})


