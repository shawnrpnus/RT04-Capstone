import { CLEAR_ERRORS, UPDATE_ERRORS } from "./types";
const _ = require("lodash");

export const clearErrors = () => ({
  type: CLEAR_ERRORS
});

export const updateErrors = errorMap => ({
  type: UPDATE_ERRORS,
  errorMap: errorMap
});

export const dispatchErrorMapError = (err, dispatch) => {
  const errorMap = _.get(err, "response.data", null);
  if (errorMap) {
    dispatch(updateErrors(errorMap));
  } else {
    console.log(err);
  }
};
