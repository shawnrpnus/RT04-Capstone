import React from "react";
import { Route, Switch } from "react-router-dom";
import { ProductsTable } from "../../../components/Product/ProductsList";
import { ProductCard } from "../../../components/Product/ProductPage";
import { ProductForm } from "../../../components/Product/ProductCreate";
import SecureRoute from "../SecureRoute";

export default () => (
  <Switch>
    <SecureRoute path="/product/createProduct" component={ProductForm} />
    <SecureRoute path="/product/viewAllProduct" component={ProductsTable} />
    <SecureRoute
      path="/product/viewProductDetails/:id"
      component={ProductCard}
    />
  </Switch>
);
