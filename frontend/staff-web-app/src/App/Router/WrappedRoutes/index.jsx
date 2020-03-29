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
import Review from "./Review";
import RestockOrder from "./RestockOrder";
import Delivery from "./Delivery";
import Advertisement from "./Advertisement";
import Refund from "./Refund"

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
      <Route path="/review" component={Review} />
      <Route path="/restockOrder" component={RestockOrder} />
      <Route path="/delivery" component={Delivery} />
      <Route path="/advertisement" component={Advertisement} />
      <Route path="/refund" component={Refund} />
    </div>
  </div>
);
