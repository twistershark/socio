import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CreateDonor from './pages/CreateDonor';

const Routes = () => {
    return(
        <BrowserRouter>
            <Route component={Home} path="/" exact />
            <Route component={CreateDonor} path="/create-donor" />
        </BrowserRouter>
    );
}

export default Routes;