import React from 'react';
import {Route} from 'react-router-dom';
import Layout from "../../../components/Layout";
import ProductTable from "../../../components/DataTable/Products";
import ProductPage from "../../../components/Product/ProductPage";
import StoreEdit from "../../../components/Store";
import TagEdit from "../../../components/Tag";

export default () => (
    <div>
        <Layout/>
        <div className="container__wrap">
            <Route path="/store" component={StoreEdit}/>
            <Route path="/tag" component={TagEdit}/>
            <Route path="/viewAllProduct" component={ProductTable}/>
            <Route path="/viewProductDetails/:id" component={ProductPage}/>
        </div>
    </div>
);
