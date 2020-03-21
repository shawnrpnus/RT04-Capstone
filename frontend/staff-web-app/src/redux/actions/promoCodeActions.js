import axios from "axios";
import * as types from "./types";
import { toast } from "react-toastify";
import {retrieveAllTags} from "./tagAction";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const PROMOCODE_BASE_URL = "/api/promoCode";
const jsog = require("jsog");

export const createPromoCode = (promoCodeCreateRequest, history) => {
    return dispatch => {
        //redux thunk passes dispatch
        axios
            .post(PROMOCODE_BASE_URL + "/createNewPromoCode", promoCodeCreateRequest)
            .then(response => {
                const data = jsog.decode(response);
                console.log(data);
                dispatch(createPromoCodeSuccess(response.data));
                toast.success("Promo Code Created!", {
                    position: toast.POSITION.TOP_CENTER
                });
                retrieveAllPromoCodes()(dispatch);
                history.push(`/promoCode/viewAll`);
            })
            .catch(err => {
                dispatch(createPromoCodeError(err.response.data));
                //console.log(err.response.data);
            });
    };
};

const createPromoCodeSuccess = data => ({
    type: types.CREATE_PROMOCODE,
    promoCode: data
});

const createPromoCodeError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

export const retrieveAllPromoCodes = () => {
    return dispatch => {
        axios
            .get(PROMOCODE_BASE_URL + "/retrieveAllPromoCode")
            .then(response => {
                const { data } = jsog.decode(response);
                dispatch(retrieveAllPromoCodesSuccess(data));
            })
            .catch(err => {
                dispatch(retrieveAllPromoCodesError(err.response.data));
            });
    };
};

const retrieveAllPromoCodesSuccess = data => ({
    type: types.RETRIEVE_ALL_PROMOCODES,
    allPromoCodes: data
});

const retrieveAllPromoCodesError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

export const deletePromoCode = (promoCodeId, history) => {
    return dispatch => {
        axios
            .delete(PROMOCODE_BASE_URL + "/removePromoCode/" + promoCodeId)
            .then(response => {
                const { data } = jsog.decode(response);
                toast.success("Promo Code Deleted!", {
                    position: toast.POSITION.TOP_CENTER
                });
                dispatch(deletePromoCodeSuccess(data));
                retrieveAllPromoCodes()(dispatch);
                history.push(`/promoCode/viewAll`);
            })
            .catch(err => {
                console.log(err);
                dispatch(deletePromoCodeError(err.response.data));
            });
    };
};

const deletePromoCodeSuccess = data => ({
    type: types.DELETE_PROMOCODE,
    deletedPromoCode: data
});

const deletePromoCodeError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

export const updatePromoCode = (promoCodeUpdateRequest, history) => {
    return dispatch => {
        //redux thunk passes dispatch
        axios
            .post(PROMOCODE_BASE_URL + "/updatePromoCode", promoCodeUpdateRequest)
            .then(response => {
                const { data } = jsog.decode(response);
                dispatch(updatePromoCodeSuccess(data));
                toast.success("Promo Code Updated!", {
                    position: toast.POSITION.TOP_CENTER
                });
                retrieveAllPromoCodes()(dispatch);
                history.push(`/promoCode/viewAll`);
            })
            .catch(err => {
                dispatch(updatePromoCodeError(err.response.data));
                // console.log(err.response.data);
            });
    };
};

const updatePromoCodeSuccess = data => ({
    type: types.UPDATE_PROMOCODE,
    updatedPromoCode: data
});

const updatePromoCodeError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

export const retrievePromoCodeById = (promoCodeId, history) => {
    return dispatch => {
        axios
            .get(PROMOCODE_BASE_URL + "/retrievePromoCodeById/" + promoCodeId)
            .then(response => {
                const { data } = jsog.decode(response);
                dispatch(retrievePromoCodeSuccess(data));
            })
            .catch(err => {
                toast.error("Promo Code Not Found!", {
                    position: toast.POSITION.TOP_CENTER
                });
                history.push(`/promoCode/viewAll`);
                dispatch(retrievePromoCodeError(err.response.data));
            });
    };
};

const retrievePromoCodeSuccess = data => ({
    type: types.RETRIEVE_PROMOCODE,
    retrievedPromoCode: data
});

const retrievePromoCodeError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});