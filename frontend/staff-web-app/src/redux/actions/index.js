import { CLEAR_ERRORS, UPDATE_ERRORS } from "./types";

export const clearErrors = () => ({
  type: CLEAR_ERRORS
});

export const updateErrors = errorMap => ({
  type: UPDATE_ERRORS,
  errorMap: errorMap
});
