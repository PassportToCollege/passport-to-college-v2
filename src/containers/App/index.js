import './App.css';

import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from "react-router-dom";

import * as routes from "../../constants/routes";

import Hamburger from "../Hamburger";
import Navigation from "../Navigation";

import Home from "../../components/Home";
import SignIn from "../../components/Auth/SignIn";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hamburgerState: "closed",
            location: "landing"
        }
    }

     render() {
        return (
            <Router {...this.props}>
                <div className="app">
                    <Hamburger updateHamburgerState={ newState => { this.setState({ hamburgerState: newState }) } }/>
                    <div className="app__main" data-hamburger={this.state.hamburgerState}>
                        <Navigation updateHamburgerState={newState => { this.setState({ hamburgerState: newState }) }} />
                        <Route 
                            exact 
                            path={routes.LANDING.route} 
                            component={Home} 
                            updateLocation={newLocation => { this.setState({ location: newLocation }) }}>
                        </Route>
                        <Route 
                            exact 
                            path={routes.SIGN_IN.route} 
                            component={SignIn} 
                            updateLocation={newLocation => { this.setState({ location: newLocation }) }}
                            ></Route>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
