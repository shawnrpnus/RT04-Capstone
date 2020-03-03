import React from "react";
import { Route, Switch } from "react-router-dom";
import { StoreFormContainer, StoreTable } from "../../../components/Store";
import SecureRoute from "../SecureRoute";

export default () => (
  <Switch>
    <SecureRoute
      exact
      path="/store/create"
      render={props => <StoreFormContainer {...props} mode="create" />}
    />
    <SecureRoute
      exact
      path="/store/view/:storeId"
      render={props => <StoreFormContainer {...props} mode="view" />}
    />
    <SecureRoute
      exact
      path="/store/update/:storeId"
      render={props => <StoreFormContainer {...props} mode="update" />}
    />
    <SecureRoute exact path="/store/viewAll" component={StoreTable} />
  </Switch>
);
