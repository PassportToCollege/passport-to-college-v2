import './App.css';

import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from "react-router-dom";

import * as routes from "../../constants/routes";

import Hamburger from "../Hamburger";
import Navigation from "../Navigation";

import Home from "../../components/Home";
import Login from "../../components/Auth/Login";

class App extends Component {
    constructor() {
        super();

        this.state = {
            hamburgerState: "closed"
        }
    }
     render() {
        return (
            <Router {...this.props}>
                <div className="app">
                    <Hamburger updateHamburgerState={ newState => { this.setState({ hamburgerState: newState }) } }/>
                    <div className="app__main" data-hamburger={this.state.hamburgerState}>
                        <Navigation updateHamburgerState={newState => { this.setState({ hamburgerState: newState }) }} />
                            <Route exact path={routes.LANDING.route} component={Home}></Route>
                            <Route exact path={routes.LOGIN.route} component={Login}></Route>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
