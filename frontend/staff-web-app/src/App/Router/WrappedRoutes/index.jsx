import React from 'react';
import {Route} from 'react-router-dom';
import Layout from "../../../components/Layout";

export default () => (
  <div>
    <Layout />
    <div className="container__wrap">
        <Route />
    </div>
  </div>
);
