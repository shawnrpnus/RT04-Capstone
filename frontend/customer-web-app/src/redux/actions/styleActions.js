import axios from "axios";
import { dispatchErrorMapError } from "redux/actions/index";
import { RETRIEVE_ALL_STYLES } from "./types";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const jsog = require("jsog");
const STYLE_BASE_URL = "/api/style";

export const retrieveAllStyles = () => {
  return dispatch => {
    axios
      .get(STYLE_BASE_URL + "/retrieveAllStyles")
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(retrieveAllStylesSuccess(data));
      })
      .catch((err) => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const retrieveAllStylesSuccess = (data) => ({
  type: RETRIEVE_ALL_STYLES,
  styles: data,
});
