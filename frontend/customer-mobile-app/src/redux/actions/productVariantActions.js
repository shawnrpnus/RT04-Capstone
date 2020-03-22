import {
  ALL_SKU,
  DISPLAY_PRODUCT_VARIANT,
  DISPLAY_STOCKS
} from "src/redux/actions/types";
import { SPRING_BACKEND_URL } from "src/constants/routes";
import axios from "axios";
import { dispatchErrorMapError } from "src/redux/actions/index";

const jsog = require("jsog");

const PRODUCT_VAR_BASE_URL = SPRING_BACKEND_URL + "/api/productVariant";

const PRODUCT_STOCK_BASE_URL = SPRING_BACKEND_URL + "/api/productStock";

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
});

export const retrieveProductVariantBySKU = (sku, navigation, setSKU) => {
  const req = { sku };
  return dispatch => {
    axios
      .post(PRODUCT_VAR_BASE_URL + "/retrieveProductVariantBySku", req)
      .then(response => {
        const pv = jsog.decode(response.data);
        dispatch(updateDisplayedProductVariant(pv));
        navigation.navigate("Product Details");
        setSKU("");
      })
      .catch(err => {
        //either blank field error ({sku: notfound}) OR pv not found ({errorMessage: msg})
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const updateDisplayedProductVariant = data => ({
  type: DISPLAY_PRODUCT_VARIANT,
  productVariant: data
});

export const retrieveStocksForProductVariant = productVariantId => {
  return dispatch => {
    axios
      .get(PRODUCT_VAR_BASE_URL + "/retrieveStocksForProductVariant", {
        params: { productVariantId }
      })
      .then(response => {
        const data = jsog.decode(response.data);
        dispatch(updateStocksForProdVariant(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const updateStocksForProdVariant = data => ({
  type: DISPLAY_STOCKS,
  stocks: data
});

export const retrieveProductStockById = async productStockId => {
  try {
    const response = await axios.get(
      PRODUCT_STOCK_BASE_URL + `/retrieveProductStockById/${productStockId}`
    );
    return jsog.decode(response.data);
  } catch (err) {
    console.log(err);
    return null;
  }
};
