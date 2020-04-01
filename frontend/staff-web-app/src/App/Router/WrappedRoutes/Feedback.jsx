import React from "react";
import { Route, Switch } from "react-router-dom";
import { FeedbackTable } from "../../../components/Feedback";
import CRMRoute from "../CRMRoute";

export default () => (
  <Switch>
    <CRMRoute exact path="/feedback/viewAll" component={FeedbackTable} />
  </Switch>
);
