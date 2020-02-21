import axios from "axios";
import {CREATE_TAG, GET_ERRORS, default as types, RETRIEVE_ALL_TAGS} from "./types";

const TAG_BASE_URL = "/api/tag/";
const jsog = require("jsog");

export const createNewTag = (createTagRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(TAG_BASE_URL + "createNewTag", createTagRequest)
      .then(response => {
        const data = jsog.decode(response);
        console.log(data);
        dispatch(createTagSuccess(response.data));
      })
      .catch(err => {
        dispatch(createTagError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const createTagSuccess = data => ({
  type: CREATE_TAG,
  tag: data
});

const createTagError = data => ({
  type: GET_ERRORS,
  errorMap: data
});

export const retrieveAllTags = () => {
  return dispatch => {
    axios
      .get(TAG_BASE_URL + "/retrieveAllTags")
      .then(response => {
        const {data} = jsog.decode(response);
        dispatch(retrieveAllStoresSuccess(data));
      })
      .catch(err => {
        dispatch(retrieveAllStoresError(err.response.data));
      })
  };
};

const retrieveAllStoresSuccess = data => ({
  type: RETRIEVE_ALL_TAGS,
  allTags: data
});

const retrieveAllStoresError = data => ({
  type: GET_ERRORS,
  errorMap: data
});
