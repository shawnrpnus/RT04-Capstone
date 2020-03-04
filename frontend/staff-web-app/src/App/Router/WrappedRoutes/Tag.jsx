import React from "react";
import { Route, Switch } from "react-router-dom";
import TagContainer from "../../../components/Tag/components/TagContainer";
import { StoreTable } from "../../../components/Store";
import AddTagToProduct from "../../../components/Tag/components/AddTagToProduct";
import RetailRoute from "./../RetailRoute";

export default () => (
  <Switch>
    <RetailRoute
      exact
      path="/tag/manage"
      render={props => <TagContainer {...props} mode="viewAll" />}
    />
    <RetailRoute
      exact
      path="/tag/addTagToProducts"
      component={AddTagToProduct}
    />
  </Switch>
);
