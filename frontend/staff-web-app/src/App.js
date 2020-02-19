import React from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { ScrollContext } from "react-router-scroll-4";
import "./App.css";

import Login from "./components/auth/login";
import Dashboard from "./components/dashboard";
import Layout from "./components/layout";
import AddProduct from './components/product/physical/add-product';
import Category from "./components/product/physical/category";
import ProductDetail from "./components/product/physical/product-detail";
import ProductList from "./components/product/physical/product-list";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";


const theme = createMuiTheme({
  palette: {
    // primary: { 500: "#ff8084" },
  },
});

function App() {
  return (
    // <Provider store={store}>
    <BrowserRouter basename={'/'}>
      <ScrollContext>
        <MuiThemeProvider theme={theme}>

          <Switch>
            {/*Staff Routes*/}
            <Route exact key="login" path="/" component={Login} />
            <Route exact key="login" path="/login" component={Login} />

            <Layout>
              <Route key="dashboard" path="/dashboard" component={Dashboard} />
              <Route path='/product/physical/add-product' component={AddProduct} />
              <Route path='/product/physical/category' component={Category} />
              <Route path='/product/physical/product-detail' component={ProductDetail} />
              <Route path='/product/physical/product-list' component={ProductList} />

            </Layout>

            <Redirect from="/" exact to="/login" />
            <Redirect to="/login" />
          </Switch>
        </MuiThemeProvider>
      </ScrollContext>

    </BrowserRouter>
    // </Provider>
  );
}


export default App;
