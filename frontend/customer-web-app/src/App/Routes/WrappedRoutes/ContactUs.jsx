import React from "react";
import Switch from "@material-ui/core/Switch";
import Route from "react-router-dom/es/Route";

export default () => (
  <Switch>
    <Route exact path="/account/login" component={LoginPage} />

  </Switch>
);
