import React from "react";

import { Route, Switch } from "react-router-dom";
import Lookbook from "components/Lookbook";

export default () => (
  <Switch>
    <Route exact path="/lookbook" component={Lookbook} />
  </Switch>
);
