import React from "react";
import { Route, Switch } from "react-router-dom";
import { CategoryTree } from "../../../components/Category";
import RetailRoute from "./../RetailRoute";

export default () => (
  <Switch>
    <RetailRoute exact path="/category/viewAll" component={CategoryTree} />
  </Switch>
);
