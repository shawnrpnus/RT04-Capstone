import React from "react";

import {
  ProductsStockTable,
  ProductStockContainer
} from "../../../components/ProductStock";
import { Route, Switch } from "react-router-dom";
import { ProductsStockDetails } from "../../../components/ProductStock";
import RetailRoute from "./../RetailRoute";

export default () => (
  <Switch>
    <RetailRoute
      exact
      path="/productStock/viewAll"
      component={ProductsStockTable}
    />
    <RetailRoute
      path="/productStock/viewProductStocksDetails/:id"
      component={ProductsStockDetails}
    />
  </Switch>
);
