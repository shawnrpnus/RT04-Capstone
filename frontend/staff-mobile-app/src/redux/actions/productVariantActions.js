import {ALL_SKU, STAFF_LOGIN, STAFF_LOGOUT} from "src/redux/actions/types";
import { SPRING_BACKEND_URL } from "src/constants/routes";
import axios from "axios";
import {dispatchErrorMapError} from "src/redux/actions/index";

const jsog = require("jsog");

const PRODUCT_VAR_BASE_URL = SPRING_BACKEND_URL + "/api/productVariant";

export const retrieveAllSKUs = () => {
  return dispatch => {
    axios
      .get(PRODUCT_VAR_BASE_URL + "/retrieveAllSku")
      .then(response => {
        const SKUs = jsog.decode(response.data);
        dispatch(allSku(SKUs));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const allSku = data => ({
  type: ALL_SKU,
  SKUs: data
})

