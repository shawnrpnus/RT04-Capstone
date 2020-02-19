import React from 'react';
import {Route} from 'react-router-dom';
import Layout from "../../../components/Layout";
import StoreEdit from "../../../components/Store";

export default () => (
  <div>
    <Layout />
    <div className="container__wrap">
        <Route path="/storeEdit" component={StoreEdit} />
    </div>
  </div>
);
