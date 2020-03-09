import React from "react";
import { Route } from "react-router-dom";
import Layout from "../../../components/Layout";
import Store from "./Store";
import Tag from "./Tag";
import Category from "./Category";
import Product from "./Product";
import Staff from "./Staff";
import ProductStock from "./ProductStock";
import InventoryTable from "./Warehouse";
import Feedback from "./Feedback";

export default () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <Route path="/store" component={Store} />
      <Route path="/category" component={Category} />
      <Route path="/tag" component={Tag} />
      <Route path="/product" component={Product} />
      <Route path="/staff" component={Staff} />
      <Route path="/productStock" component={ProductStock} />
      <Route path="/warehouse" component={InventoryTable} />
      <Route path="/feedback" component={Feedback} />
    </div>
  </div>
);
