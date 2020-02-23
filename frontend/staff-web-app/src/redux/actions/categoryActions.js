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
          toast.error(errorMap.errorMessage, {
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

export const deleteCategory = categoryId => {
  return dispatch => {
    axios
      .delete(CATEGORY_BASE_URL + `/deleteCategory/${categoryId}`)
      .then(response => {
        const { data } = jsog.decode(response);
        if (parseInt(data.categoryId) === parseInt(categoryId)) {
          retrieveAllCategories()(dispatch);
          toast.success("Category deleted!", {
            position: toast.POSITION.TOP_CENTER
          });
        }
      })
      .catch(err => {
        if (!!err.response && !!err.response.data) {
          console.log(err.response);
          const { errorMessage } = err.response.data;
          toast.error(errorMessage, {
            position: toast.POSITION.TOP_CENTER
          });
        } else {
          console.log(err);
        }
      });
  };
};

export const createCategory = (createCategoryReq, closeDialog) => {
  return dispatch => {
    axios
      .post(CATEGORY_BASE_URL + "/createNewCategory", createCategoryReq)
      .then(response => {
        const { data } = jsog.decode(response);
        retrieveAllCategories()(dispatch);
        toast.success("Category created!", {
          position: toast.POSITION.TOP_CENTER
        });
        closeDialog();
      })
      .catch(err => {
        if (!!err.response && !!err.response.data) {
          const { errorMessage } = err.response.data;
          if (errorMessage) {
            //not inputDataValidationException
            toast.error(errorMessage, {
              position: toast.POSITION.TOP_CENTER
            });
          } else {
            dispatch(createCategoryError(err.response.data));
          }
        } else {
          console.log(err);
        }
      });
  };
};

const createCategoryError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const updateCategory = (updateCategoryReq, closeDialog) => {
  return dispatch => {
    axios
      .post(CATEGORY_BASE_URL + "/updateCategory", updateCategoryReq)
      .then(response => {
        const { data } = jsog.decode(response);
        retrieveAllCategories()(dispatch);
        toast.success("Category updated!", {
          position: toast.POSITION.TOP_CENTER
        });
        closeDialog();
      })
      .catch(err => {
        if (!!err.response && !!err.response.data) {
          const { errorMessage } = err.response.data;
          if (errorMessage) {
            //not inputDataValidationException
            toast.error(errorMessage, {
              position: toast.POSITION.TOP_CENTER
            });
          } else {
            dispatch(updateCategoryError(err.response.data));
          }
        } else {
          console.log(err);
        }
      });
  };
};

const updateCategoryError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});
