import {
  ALL_SKU,
  DISPLAY_PRODUCT_VARIANT,
  DISPLAY_STOCKS
} from "src/redux/actions/types";
import { SPRING_BACKEND_URL } from "src/constants/routes";
import axios from "axios";
import { dispatchErrorMapError } from "src/redux/actions/index";

const _ = require("lodash");
const jsog = require("jsog");

const PROMO_CODE_BASE_URL = SPRING_BACKEND_URL + "/api/promoCode";

export const applyPromoCode = (
  customerId,
  promoCode,
  finalTotalAmount,
  setLoading,
  setErrorMessage
) => {
  setLoading(true);
  return axios
    .get(PROMO_CODE_BASE_URL + `/applyPromoCode`, {
      params: { customerId, promoCode, finalTotalAmount }
    })
    .then(response => {
      const { data } = jsog.decode(response);
      setLoading(false);
      return data;
    })
    .catch(err => {
      setLoading(false);
      setErrorMessage(_.get(err, "response.data.errorMessage"));
      console.log(err.response);
    });
};
