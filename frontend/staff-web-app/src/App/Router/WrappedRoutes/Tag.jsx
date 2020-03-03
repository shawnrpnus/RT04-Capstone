import React from "react";
import { Route, Switch } from "react-router-dom";
import TagContainer from "../../../components/Tag/components/TagContainer";
import { StoreTable } from "../../../components/Store";
import AddTagToProduct from "../../../components/Tag/components/AddTagToProduct";
import SecureRoute from "../SecureRoute";

export default () => (
  <Switch>
    <SecureRoute
      exact
      path="/tag/manage"
      render={props => <TagContainer {...props} mode="viewAll" />}
    />
    <SecureRoute exact path="/tag/addTagToProducts" component={AddTagToProduct} />
  </Switch>
);
