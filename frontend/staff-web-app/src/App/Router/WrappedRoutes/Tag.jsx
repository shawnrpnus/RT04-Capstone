import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TagEdit from "../../../components/Tag";

export default () => (
    <Switch>
        <Route exact path="/tag/edit" component={TagEdit} />
    </Switch>
);
