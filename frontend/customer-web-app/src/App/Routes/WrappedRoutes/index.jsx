import React from "react";
import { Route } from "react-router-dom";
import Layout from "components/Layout";
import Account from "./Account";
import Banner from "components/Layout/components/Banner";
import ErrorPage from "components/Layout/components/Error/ErrorPage";

export default () => (
  <div>
    <Layout>
      <Route exact path="/" component={Banner} />} />
      <Route exact path="/404" component={ErrorPage} />
      <Route path="/account" component={Account} />
    </Layout>
  </div>
);