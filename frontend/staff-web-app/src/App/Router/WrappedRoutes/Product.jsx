import React from "react";
import { Route, Switch } from "react-router-dom";
import { ProductsTable } from "../../../components/Product/ProductsList";
import { ProductCard } from "../../../components/Product/ProductPage";
import { ProductForm } from "../../../components/Product/ProductCreate";
import RetailRoute from "./../RetailRoute";

export default () => (
  <Switch>
    <RetailRoute path="/product/createProduct" component={ProductForm} />
    <RetailRoute path="/product/viewAllProduct" component={ProductsTable} />
    <RetailRoute
      path="/product/viewProductDetails/:id"
      component={ProductCard}
    />
  </Switch>
);
