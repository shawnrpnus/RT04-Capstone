import axios from "axios";
import * as types from "./types";
import { toast } from "react-toastify";

const TAG_BASE_URL = "/api/tag/";
const jsog = require("jsog");

export const createNewTag = (createTagRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(TAG_BASE_URL + "createNewTag", createTagRequest)
      .then(response => {
        const data = jsog.decode(response);
        const tagId = data.tagId;
        console.log(data);
        dispatch(createTagSuccess(response.data));
        toast.success("Tag Created!", {
          position: toast.POSITION.TOP_CENTER
        });
        retrieveAllTags()(dispatch);
        history.push(`/tag`);
      })
      .catch(err => {
        dispatch(createTagError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const createTagSuccess = data => ({
  type: types.CREATE_TAG,
  tag: data
});

const createTagError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const retrieveAllTags = () => {
  return dispatch => {
    axios
      .get(TAG_BASE_URL + "/retrieveAllTags")
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveAllTagsSuccess(data));
      })
      .catch(err => {
        dispatch(retrieveAllTagsError(err.response.data));
      });
  };
};

const retrieveAllTagsSuccess = data => ({
  type: types.RETRIEVE_ALL_TAGS,
  allTags: data
});

const retrieveAllTagsError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const updateTag = (updateTagRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(TAG_BASE_URL + "/updateTag", updateTagRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        const tagId = data.tagId;
        dispatch(updateTagSuccess(data));
        toast.success("Store Updated!", {
          position: toast.POSITION.TOP_CENTER
        });
        retrieveAllTags()(dispatch);
        history.push(`/tag`);
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage.toString(), {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(updateTagError(err.response.data));
        // console.log(err.response.data);
      });
  };
};

const updateTagSuccess = data => ({
  type: types.UPDATE_TAG,
  storeEntity: data
});

const updateTagError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const deleteTag = (tagId, history) => {
  return dispatch => {
    axios
      .delete(TAG_BASE_URL + "/deleteTag/" + tagId)
      .then(response => {
        const { data } = jsog.decode(response);
        toast.success("Tag Deleted!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(deleteTagSuccess(data));
        retrieveAllTags()(dispatch);
        history.push(`/tag`);
      })
      .catch(err => {
        console.log(err);
        dispatch(deleteTagError(err.response.data));
      });
  };
};

const deleteTagSuccess = data => ({
  type: types.DELETE_TAG,
  deletedTag: data
});

const deleteTagError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});
