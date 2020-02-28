import axios from "axios";
import * as types from "./types";

const CONTACT_US_BASE_URL = "/api/contactUs";

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
