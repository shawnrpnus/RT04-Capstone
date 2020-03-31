import axios from "axios";
import { toast } from "react-toastify";
import * as types from "./types";
import { openCircularProgress, closeCircularProgress } from "./utilActions";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const jsog = require("jsog");

const handleRetrieveMarketBasketAnalysisResult = data => ({
  type: types.RETRIEVE_MARKET_BASKET_ANALYSIS,
  basket: data
});

export const retrieveMarketBasketAnalysisResult = () => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .get("/crazy")
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(handleRetrieveMarketBasketAnalysisResult(data));
        dispatch(closeCircularProgress());
      })
      .catch(err => {
        toast.error(err.response, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(closeCircularProgress());
      });
  };
};
