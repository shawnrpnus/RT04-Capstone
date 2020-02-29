import axios from "axios";
import { dispatchErrorMapError } from "redux/actions/index";
import { RETRIEVE_ALL_TAGS } from "redux/actions/types";

const jsog = require("jsog");
const TAG_BASE_URL = "/api/tag";

export const retrieveAllTags = () => {
  return dispatch =>
    axios
      .get(TAG_BASE_URL + "/retrieveAllTags")
      .then(response => {
        updateAllTags(response.data, dispatch);
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
};

const retrieveTags = data => ({
  type: RETRIEVE_ALL_TAGS,
  tags: data
});

const updateAllTags = (responseData, dispatch) => {
  const tags = jsog.decode(responseData);
  dispatch(retrieveTags(tags));
};
