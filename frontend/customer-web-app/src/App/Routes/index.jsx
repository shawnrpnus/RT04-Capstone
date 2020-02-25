import React from "react";
import { Route, Switch } from "react-router-dom";
import WrappedRoutes from "./WrappedRoutes";

const Router = () => (
  <main>
    <Switch>
      <Route path="/login" />
      <Route path="/" component={WrappedRoutes} />
    </Switch>
  </main>
);

export default Router;
