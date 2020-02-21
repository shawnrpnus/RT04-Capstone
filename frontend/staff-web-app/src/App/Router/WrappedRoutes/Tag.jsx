import React from "react";
import { Route, Switch } from "react-router-dom";
import TagContainer from "../../../components/Tag/components/TagContainer";

export default () => (
  <Switch>
    <Route
      exact
      path="/tag"
      render={props => <TagContainer {...props} mode="viewAll" />}
    />
    <Route
      exact
      path="/tag/view/:tagId"
      render={props => <TagContainer {...props} mode="viewOne" />}
    />
  </Switch>
);
