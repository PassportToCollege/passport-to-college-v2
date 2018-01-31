import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import App from "./containers/App";

const Routes = props => {
    return (
        <Router {...props}>
            <Route path="/" component={App}></Route>
        </Router>
    );
}

export default Routes;