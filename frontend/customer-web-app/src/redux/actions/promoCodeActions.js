import axios from "axios";
// import { RETRIEVE_ALL_ACTIVE_ADVERTISEMENT } from "redux/actions/types";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const jsog = require("jsog");
const PROMO_CODE_BASE_URL = "/api/promoCode";

export const applyPromoCode = (
  customerId,
  promoCode,
  finalTotalAmount,
  enqueueSnackbar
) => {
  return axios
    .get(PROMO_CODE_BASE_URL + `/applyPromoCode`, {
      params: { customerId, promoCode, finalTotalAmount }
    })
    .then(response => {
      const { data } = jsog.decode(response);
      enqueueSnackbar(`${data.promoCodeName} applied`, {
        variant: "success",
        autoHideDuration: 1200
      });
      return data;
    })
    .catch(err => {
      enqueueSnackbar(err.response.data.errorMessage, {
        variant: "error",
        autoHideDuration: 1200
      });
      console.log(err.response);
    });
};
