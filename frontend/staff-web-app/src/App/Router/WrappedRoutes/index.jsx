import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Layout from "../../../components/Layout";
import Store from "./Store";
import Tag from "./Tag";
import Style from "./Style";
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
import Instagram from "./Instagram";
import Refund from "./Refund";
import PromoCode from "./PromoCode";
import Discount from "./Discount";
import Transaction from "./Transaction";
import Dashboard from "./Dashboard";
import Leave from "./Leave";
import Payrolls from "./Payrolls";
import SalesGraph from "../../../components/SalesGraphs/SalesGraph";

export default () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <Switch>
        <Route path="/store" component={Store} />
        <Route path="/category" component={Category} />
        <Route path="/tag" component={Tag} />
        <Route path="/style" component={Style} />
        <Route path="/product" component={Product} />
        <Route path="/staff" component={Staff} />
        <Route path="/productStock" component={ProductStock} />
        <Route path="/warehouse" component={InventoryTable} />
        <Route path="/feedback" component={Feedback} />
        <Route path="/review" component={Review} />
        <Route path="/restockOrder" component={RestockOrder} />
        <Route path="/delivery" component={Delivery} />
        <Route path="/advertisement" component={Advertisement} />
        <Route path="/instagram" component={Instagram} />
        <Route path="/refund" component={Refund} />
        <Route path="/promoCode" component={PromoCode} />
        <Route path="/discount" component={Discount} />
        <Route path="/transaction" component={Transaction} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/leave" component={Leave} />
        <Route path = "/payrolls" component ={Payrolls} />
        <Route path="/salesGraph" component={SalesGraph}/>
        <Redirect from="/" exact to="/dashboard" />
      </Switch>
    </div>
  </div>
);
