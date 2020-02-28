import React from "react";

import {
  ProductsStockTable,
  ProductStockContainer
} from "../../../components/ProductStock";
import { Route, Switch } from "react-router-dom";
import { ProductsStockDetails } from "../../../components/ProductStock";

export default () => (
  <Switch>
    <Route exact path="/productStock/viewAll" component={ProductsStockTable} />
    <Route
      path="/productStock/viewProductStockDetails/:id"
      component={ProductsStockDetails}
    />
  </Switch>
);
