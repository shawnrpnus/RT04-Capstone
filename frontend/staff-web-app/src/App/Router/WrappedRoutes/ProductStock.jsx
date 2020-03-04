import React from "react";

import {
  ProductsStockTable,
  ProductStockContainer
} from "../../../components/ProductStock";
import { Route, Switch } from "react-router-dom";
import { ProductsStockDetails } from "../../../components/ProductStock";
import SecureRoute from "../SecureRoute";

export default () => (
  <Switch>
    <SecureRoute
      exact
      path="/productStock/viewAll"
      component={ProductsStockTable}
    />
    <SecureRoute
      path="/productStock/viewProductStocksDetails/:id"
      component={ProductsStockDetails}
    />
  </Switch>
);
