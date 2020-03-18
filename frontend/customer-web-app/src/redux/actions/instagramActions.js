import axios from "axios";
import { RETRIEVE_ALL_ACTIVE_INSTAGRAM_POST } from "redux/actions/types";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const jsog = require("jsog");
const INSTAGRAM_BASE_URL = "/api/instagramPost";

const handleRetrieveAllActiveInstagramPost = data => ({
  type: RETRIEVE_ALL_ACTIVE_INSTAGRAM_POST,
  instagramPosts: data
});

export const retrieveAllActiveInstagramPost = () => {
  return dispatch => {
    axios
      .get(INSTAGRAM_BASE_URL + "/retrieveAllActiveInstagramPost")
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveAllActiveInstagramPost(data));
      })
      .catch(err => {
        console.log(err.response);
      });
  };
};
