import axios from "axios";
import {CREATE_STORE, GET_ERRORS} from "./types";

const STORE_BASE_URL = "/api/store/";
const jsog = require("jsog");
export const createNewStore = (createStoreRequest, history) => {
    return (dispatch) => {
        //redux thunk passes dispatch
        axios
            .post(STORE_BASE_URL + "createNewStore", createStoreRequest)
            .then(response => {
                const data = jsog.decode(response)
                console.log(data);
                dispatch(createStoreSuccess(response.data));
                //history.push("/storeEdit"); // TODO: update redirect path
            })
            .catch(err => {
                dispatch(createStoreError(err.response.data));
                //console.log(err.response.data);
            });
    };
};


const createStoreSuccess = data => ({
    type: CREATE_STORE,
    store: data
})

const createStoreError = data => ({
    type: GET_ERRORS,
    errorMap: data
})



