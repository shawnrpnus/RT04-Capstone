import React from "react";
import { Route, Switch } from "react-router-dom";
import TagContainer from "../../../components/Tag/components/TagContainer";

export default () => (
  <Switch>
    <Route
      exact
      path="/tag/manage"
      render={props => <TagContainer {...props} mode="viewAll" />}
    />
  </Switch>
);
