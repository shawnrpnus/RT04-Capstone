import React from "react";
import { Route, Switch } from "react-router-dom";
import { FeedbackTable } from "../../../components/Feedback";

export default () => (
  <Switch>
    <Route exact path="/feedback/viewAll" component={FeedbackTable} />
  </Switch>
);
