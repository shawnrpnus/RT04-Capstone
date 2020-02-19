import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from "../../../components/Layout";
import ProductTable from "../../../components/DataTable/Products";
import ProductPage from "../../../components/product/ProductPage";

export default () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <Route path="/viewAllProduct" component={ProductTable} />
      <Route path="/viewProductDetails/:id" component={ProductPage} />
    </div>
  </div>
);
