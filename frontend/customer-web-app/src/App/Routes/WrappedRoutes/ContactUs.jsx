import React from "react";

import { Route, Switch } from "react-router-dom";
import ContactUsTicket from "../../../components/ContactUs/ContactUsTicket";

export default () => (
  <Switch>
    <Route exact path="/contactUs/ticket" component={ContactUsTicket} />

  </Switch>
);
