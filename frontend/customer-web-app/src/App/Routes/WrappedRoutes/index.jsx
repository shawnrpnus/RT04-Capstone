import React from "react";
import { Route } from "react-router-dom";
import Layout from "components/Layout";
import Account from "./Account";
import Banner from "components/Layout/components/Banner";
import ErrorPage from "components/Layout/components/Error/ErrorPage";
import ContactUs from "./ContactUs";

export default () => (
  <div>
    <Layout>
      <Route exact path="/" component={Banner} />} />
      <Route exact path="/404" component={ErrorPage} />
      <Route path="/account" component={Account} />
      <Route path="/contactUs" component={ContactUs} />

    </Layout>
  </div>
);
