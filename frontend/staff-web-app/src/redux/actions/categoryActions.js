import axios from "axios";
import { toast } from "react-toastify";
import * as types from "./types";

const CATEGORY_BASE_URL = "/api/category";
const jsog = require("jsog");

export const retrieveAllCategories = () => {
  return dispatch => {
    axios
      .get(CATEGORY_BASE_URL + "/retrieveAllCategories")
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveAllCategoriesSuccess(data));
      })
      .catch(err => {
        if (!!err.response && !!err.response.data) {
          const { errorMap } = err.response.data;
          toast.error(errorMap.message, {
            position: toast.POSITION.TOP_CENTER
          });
          dispatch(retrieveAllCategoriesError(err.response.data));
        } else {
          console.log(err);
        }
      });
  };
};

const retrieveAllCategoriesSuccess = data => ({
  type: types.RETRIEVE_ALL_CATEGORIES,
  categories: data
});

const retrieveAllCategoriesError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});
