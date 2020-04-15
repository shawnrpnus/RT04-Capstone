import React from "react";
import { Redirect, Route } from "react-router-dom";
import Layout from "components/Layout";
import Banner from "components/Layout/components/Banner";
import ErrorPage from "components/Layout/components/Error/ErrorPage";
import Account from "App/Routes/WrappedRoutes/Account";
import Product from "App/Routes/WrappedRoutes/Product";
import ContactUs from "App/Routes/WrappedRoutes/ContactUs";
import Lookbook from "App/Routes/WrappedRoutes/Lookbook";
import Location from "components/Location";

export default () => (
  <div>
    <Layout>
      <Route exact path="/" component={Banner} />
      <Route exact path="/404" component={ErrorPage} />
      <Route path="/account" component={Account} />
      <Route path="/contactUs" component={ContactUs} />
      <Route path="/shop" component={Product} />
      <Route path="/lookbook" component={Lookbook} />
      <Route path="/location" component={Location} />
      {/*<Route path="*">*/}
      {/*  <Redirect to="/" />*/}
      {/*</Route>*/}
    </Layout>
  </div>
);
