import React from 'react';
import {Route} from 'react-router-dom';
import Layout from "../../../components/Layout";
import ProductTable from "../../../components/DataTable/Products";
import ProductPage from "../../../components/Product/ProductPage";
import TagEdit from "../../../components/Tag";
import Store from "./Store";

export default () => (
    <div>
        <Layout/>
        <div className="container__wrap">
            <Route path="/store" component={Store}/>
            <Route path="/tag" component={TagEdit}/>
            <Route path="/viewAllProduct" component={ProductTable}/>
            <Route path="/viewProductDetails/:id" component={ProductPage}/>
        </div>
    </div>
);
