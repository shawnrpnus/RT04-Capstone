import React from "react";
import { Route } from "react-router-dom";
import Layout from "../../../components/Layout";
import ProductsList from "../../../components/Product/ProductsList";
import ProductPage from "../../../components/Product/ProductPage";
import Store from "./Store";
import Tag from "./Tag";
import Category from "./Category";

export default () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <Route path="/store" component={Store} />
      <Route path="/category" component={Category} />
      <Route path="/tag" component={Tag} />
      <Route path="/viewAllProduct" component={ProductsList} />
      <Route path="/viewProductDetails/:id" component={ProductPage} />
    </div>
  </div>
);
