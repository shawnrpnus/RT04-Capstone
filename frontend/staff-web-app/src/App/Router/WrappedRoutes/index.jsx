import React from "react";
import { Route } from "react-router-dom";
import Layout from "../../../components/Layout";
import Store from "./Store";
import Tag from "./Tag";
import Category from "./Category";
import Product from "./Product";
import Staff from "./Staff";

export default () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <Route path="/store" component={Store} />
      <Route path="/category" component={Category} />
      <Route path="/tag" component={Tag} />
      <Route path="/product" component={Product} />
      <Route path="/staff" component={Staff} />
    </div>
  </div>
);
