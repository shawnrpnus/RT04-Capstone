import React from "react";
import { Route } from "react-router-dom";
import Layout from "components/Layout";
import Account from "./Account";
import Banner from "components/Layout/components/Banner";

export default () => (
  <div>
    <Layout>
      <Route
        exact
        path="/"
        render={props => <Banner {...props} landingPage />}
      />
      <Route path="/account" component={Account} />
    </Layout>
  </div>
);
