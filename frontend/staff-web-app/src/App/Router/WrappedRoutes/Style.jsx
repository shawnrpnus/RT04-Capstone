import React from "react";
import { Route, Switch } from "react-router-dom";
import StyleContainer from "../../../components/Style/components/StyleContainer";
import { StoreTable } from "../../../components/Store";
import AddStyleToProduct from "../../../components/Style/components/AddStyleToProduct";
import StyleQuiz from "../../../components/Style/components/StyleQuiz";
import RetailRoute from "./../RetailRoute";

export default () => (
  <Switch>
    <RetailRoute
      exact
      path="/style/manage"
      render={props => <StyleContainer {...props} mode="viewAll" />}
    />
    <RetailRoute
      exact
      path="/style/addStyleToProducts"
      component={AddStyleToProduct}
    />
    <RetailRoute
      exact
      path="/style/manageStyleQuiz"
      component={StyleQuiz}
    />
  </Switch>
);
