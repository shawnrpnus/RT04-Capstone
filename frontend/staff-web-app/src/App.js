import React from 'react';
import {Route, Switch, Redirect, BrowserRouter} from 'react-router-dom';
import { Provider } from "react-redux";
import { ScrollContext } from "react-router-scroll-4";
import "./App.css";

import Login from "./components/auth/login";
import Dashboard from "./components/dashboard";
import Layout from "./components/layout";
import AddProduct from './components/product/physical/add-product';

function App() {
  return (
      // <Provider store={store}>
      <BrowserRouter basename={'/'}>
          <ScrollContext>
            <Switch>
                {/*Staff Routes*/}
                <Route exact key="login" path="/" component={Login} />
                <Route exact key="login" path="/login" component={Login} />

                <Layout>
                    <Route exact key="dashboard" path="/dashboard" component={Dashboard} />
                    <Route path='/product/physical/add-product' component={AddProduct} />

                </Layout>

                <Redirect from="/" exact to="/login" />
                <Redirect to="/login" />
            </Switch>
          </ScrollContext>
      </BrowserRouter>
      // </Provider>
  );
}


export default App;
