import React from 'react';
import {Route, Switch} from 'react-router-dom';
import LogIn from "../../components/Account/LogIn"
import WrappedRoutes from './WrappedRoutes';
import MainWrapper from "./MainWrapper";


const Router = () => (
    <MainWrapper>
        <main>
            <Switch>
                <Route path="/login" component={LogIn}/>
                <Route path="/" component={WrappedRoutes}/>
            </Switch>
        </main>
    </MainWrapper>
);

export default Router;
