import axios from "axios";
import { dispatchErrorMapError } from "redux/actions/index";
import { RETRIEVE_ROOT_CATEGORIES } from "redux/actions/types";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const jsog = require("jsog");
const CATEGORY_BASE_URL = "/api/category";

export const retrieveAllRootCategories = () => {
  return dispatch =>
    axios
      .get(CATEGORY_BASE_URL + "/retrieveAllRootCategories")
      .then(response => {
        updateRootCategories(response.data, dispatch);
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
};

const retrieveRootCategories = data => ({
  type: RETRIEVE_ROOT_CATEGORIES,
  categories: data
});

const updateRootCategories = (responseData, dispatch) => {
  const categories = jsog.decode(responseData);
  dispatch(retrieveRootCategories(categories));
};
