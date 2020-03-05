import axios from "axios";
import * as types from "./types";
import { emailSent } from "./customerActions";
import { EMAIL_SENT } from "./types";
import { CONTACT_US_SUCCESS } from "./types";
import { GET_ERRORS } from "./types";

const CONTACT_US_BASE_URL = "/api/contactUs";

const _ = require("lodash");
const jsog = require("jsog");

const dispatchErrorMapError = (err, dispatch) => {
  const errorMap = _.get(err, "response.data", null);
  if (errorMap) {
    dispatch(errorMapError(errorMap));
  } else {
    console.log(err);
  }
};

const errorMapError = data => ({
  type: GET_ERRORS,
  errorMap: data
});
export const retrieveAllContactUsCategoryEnum = () => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(CONTACT_US_BASE_URL + "/retrieveAllContactUsCategoryEnum")
      .then(response => {
        // const { data } = jsog.decode(response);
        console.log(response.data);
        dispatch(retrieveAllContactUsCategoryEnumSuccess(response.data));
      })
      .catch(err => {
        dispatch(retrieveAllContactUsCategoryEnumError(err.response.data));
      });
  };
};

const retrieveAllContactUsCategoryEnumSuccess = data => ({
  type: types.RETRIEVE_ALL_CONTACT_US_CATEGORY_ENUM_SUCCESS,
  allContactUsCategoryEnum: data
});

const retrieveAllContactUsCategoryEnumError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const createNewContactUs = (createContactUsRequest, enqueueSnackbar, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(CONTACT_US_BASE_URL + "/createNewContactUs", createContactUsRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(contactUsSuccess(data));
        enqueueSnackbar("Ticket Submitted!", {
          variant: "success",
          autoHideDuration: 1200
        });
        history.push("/contactUs/ticket");
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        console.log(err.response.data);
      });
  };
};

export const contactUsSuccess = data => ({
  type: CONTACT_US_SUCCESS,
  currentContactUs: data
});
