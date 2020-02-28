import * as types from "./types";
import { GET_ERRORS } from "./types";

export const clearErrors = () => ({
  type: types.CLEAR_ERRORS
});

const errorMapError = data => ({
  type: GET_ERRORS,
  errorMap: data
});

export const dispatchErrorMapError = (err, dispatch) => {
  const errorMap = window._.get(err, "response.data", null);
  if (errorMap) {
    dispatch(errorMapError(errorMap));
  } else {
    console.log(err);
  }
};
