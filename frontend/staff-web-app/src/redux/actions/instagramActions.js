import axios from "axios";
import { toast } from "react-toastify";
import * as types from "./types";
import { dispatchErrorMapError } from "./index";
import { openCircularProgress, closeCircularProgress } from "./utilActions";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const INSTAGRAM_BASE_URL = "/api/instagramPost";
const jsog = require("jsog");

const handleRetrieveAllInstagramPost = data => ({
  type: types.RETRIEVE_ALL_INSTAGRAM_POST,
  instagramPosts: data
});

export const retrieveAllInstagramPost = () => {
  return dispatch => {
    axios
      .get(INSTAGRAM_BASE_URL + "/retrieveAllInstagramPost")
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveAllInstagramPost(data));
      })
      .catch(err => {
        console.log(err);
        toast.error(err.response, {
          position: toast.POSITION.TOP_CENTER
        });
      });
  };
};

export const createInstagramPost = request => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(INSTAGRAM_BASE_URL + `/createInstagramPost`, request)
      .then(({ data }) => {
        dispatch(retrieveAllInstagramPost());
        toast.success("Succesfully created Instagram post!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        console.log(err.response);
        try {
          // Input data validation
          toast.error("Instagram post already exist in database", {
            position: toast.POSITION.TOP_CENTER
          });
        } catch (error) {
          console.log(error);
        }
        dispatch(closeCircularProgress());
      });
  };
};

export const activateInstagramPost = instagramPostId => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .get(INSTAGRAM_BASE_URL + `/activateInstagramPost/${instagramPostId}`)
      .then(({ data }) => {
        dispatch(retrieveAllInstagramPost());
        toast.success("Succesfully activated Instagram post!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        // toast.error(err.response, {
        //   position: toast.POSITION.TOP_CENTER
        // });
        console.log(err);
        dispatch(closeCircularProgress());
      });
  };
};

export const disableInstagramPost = instagramPostId => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .get(INSTAGRAM_BASE_URL + `/disableInstagramPost/${instagramPostId}`)
      .then(({ data }) => {
        dispatch(retrieveAllInstagramPost());
        toast.success("Succesfully disabled Instagram post!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        // toast.error(err.response, {
        //   position: toast.POSITION.TOP_CENTER
        // });
        console.log(err);
        dispatch(closeCircularProgress());
      });
  };
};

export const updateProductsToInstagramPostAssociation = (request, onClose) => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(
        INSTAGRAM_BASE_URL + `/updateProductsToInstagramPostAssociation`,
        request
      )
      .then(({ data }) => {
        dispatch(retrieveAllInstagramPost());
        toast.success(
          "Succesfully updated product to Instagram post association!",
          {
            position: toast.POSITION.TOP_CENTER
          }
        );
        dispatch(closeCircularProgress());
        onClose();
      })
      .catch(err => {
        // toast.error(err.response, {
        //   position: toast.POSITION.TOP_CENTER
        // });
        console.log(err.response);
        dispatch(closeCircularProgress());
      });
  };
};

export const deleteInstagramPost = instagramPostId => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .delete(INSTAGRAM_BASE_URL + `/deleteInstagramPost/${instagramPostId}`)
      .then(({ data }) => {
        dispatch(retrieveAllInstagramPost());
        toast.success("Succesfully deleted Instagram post!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        console.log(err.response);
        toast.error("An error has occured when deleting the Instagram post!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      });
  };
};

export const getInstagramPostsByHashtag = async (hashtag, source) => {
  if (!hashtag) return [];
  console.log(hashtag);
  return await axios
    .get(`https://www.instagram.com/explore/tags/${hashtag}/?__a=1`, {
      cancelToken: source ? source.token : null
    })
    .then(({ data }) => {
      return data.graphql.hashtag.edge_hashtag_to_media.edges;
    })
    .catch(err => {
      // unsubscribing the get request
      if (axios.isCancel(err)) {
        console.log("cancelled");
      } else {
        console.log(err);
        toast.error("Hashtag not found!", {
          position: toast.POSITION.TOP_CENTER
        });
      }
    });
};

export const getInstagramPostByShortcode = async (shortCode, source) => {
  return await axios
    .get(`https://www.instagram.com/p/${shortCode}/?__a=1`, {
      cancelToken: source ? source.token : null
    })
    .then(({ data }) => {
      return data.graphql.shortcode_media;
    })
    .catch(err => {
      // unsubscribing the get request
      if (axios.isCancel(err)) {
        console.log("cancelled");
      } else {
        toast.error("Post not found!", {
          position: toast.POSITION.TOP_CENTER
        });
        console.log(err);
      }
    });
};

// shortcode : https://www.instagram.com/p/B9w7MG0BizT/
