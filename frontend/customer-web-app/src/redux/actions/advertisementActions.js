import axios from "axios";
import { RETRIEVE_ALL_ACTIVE_ADVERTISEMENT } from "redux/actions/types";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const jsog = require("jsog");
const ADVERTISEMENT_BASE_URL = "/api/advertisement";

const handleRetrieveAllActiveAdvertisement = data => ({
  type: RETRIEVE_ALL_ACTIVE_ADVERTISEMENT,
  advertisements: data
});

export const retrieveAllActiveAdvertisement = () => {
  return dispatch => {
    axios
      .get(ADVERTISEMENT_BASE_URL + "/retrieveAllActiveAdvertisement")
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveAllActiveAdvertisement(data));
      })
      .catch(err => {
        console.log(err.response);
      });
  };
};
