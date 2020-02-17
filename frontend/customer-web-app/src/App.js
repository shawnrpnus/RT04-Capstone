import React from 'react';
import {Provider} from "react-redux";
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {ScrollContext} from 'react-router-scroll-4';
import store from './store';
import './index.scss';


import {Login, Register} from "./components/customer";

import Layout from './components/layout';

import Fashion from './components/layouts/fashion/main';


function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <ScrollContext>
                    <Switch>
                        <Layout>
                            {/*Customer Routes*/}
                            <Route exact key="home" path="/" component={Fashion}/>
                            <Route exact key="login" path="/login" component={Login}/>
                            <Route exact key="register" path="/register" component={Register}/>
                        </Layout>
                    </Switch>
                </ScrollContext>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
