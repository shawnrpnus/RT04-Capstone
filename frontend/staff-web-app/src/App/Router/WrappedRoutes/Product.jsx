import React from "react";
import { Route, Switch } from "react-router-dom";
import { ProductsTable } from "../../../components/Product/ProductsList";
import { ProductCard } from "../../../components/Product/ProductPage";

export default () => (
  <Switch>
    <Route path="/product/viewAllProduct" component={ProductsTable} />
    <Route path="/product/viewProductDetails/:id" component={ProductCard} />
  </Switch>
);
