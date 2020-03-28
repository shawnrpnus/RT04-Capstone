import axios from "axios";
import { RETRIEVE_ALL_STORE } from "redux/actions/types";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const jsog = require("jsog");
const STORE_BASE_URL = "/api/store";

const handleRetrieveAllStore = data => ({
  type: RETRIEVE_ALL_STORE,
  stores: data
});

export const retrieveAllStore = () => {
  return dispatch => {
    axios
      .get(STORE_BASE_URL + "/retrieveAllStores")
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveAllStore(data));
      })
      .catch(err => {
        console.log(err.response);
      });
  };
};
