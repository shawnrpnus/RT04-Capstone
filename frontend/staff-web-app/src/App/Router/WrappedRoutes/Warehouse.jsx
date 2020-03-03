import React from "react";

import {InventoryTable} from "../../../components/Warehouse";
import { Route, Switch } from "react-router-dom";
import { ProductCard } from "../../../components/Product/ProductPage";


export default () => (
  <Switch>
    <Route exact path="/warehouse/viewWarehouse" component={InventoryTable} />
    <Route exact path="/warehouse/viewProductStocksDetails/:id" component={ProductCard} />
  </Switch>
);

