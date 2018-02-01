import './App.css';

import React, { Component } from 'react';
import { Route, Router, Redirect } from "react-router-dom";

import history from "../../constants/history";
import * as routes from "../../constants/routes";
import { isAuthorized } from "../../utils";

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
        let main_bg = {};
        if(this.state.location === "sign-in")
            main_bg.backgroundColor = "#FF6561";

        return (
            <Router history={history}>
                <div className="app">
                    <Hamburger updateHamburgerState={ newState => { this.setState({ hamburgerState: newState }) } }/>
                    <div 
                        className="app__main" 
                        data-hamburger={this.state.hamburgerState}
                        style={main_bg}>
                        <Navigation updateHamburgerState={newState => { this.setState({ hamburgerState: newState }) }} />
                        <Route 
                            exact 
                            path={routes.LANDING.route} 
                            render={props => <Home {...props} updateLocation={newLocation => { this.setState({ location: newLocation }) }}/>}
                        ></Route>
                        <Route 
                            exact 
                            path={routes.SIGN_IN.route}
                            render={props => {
                                if(isAuthorized())
                                    return <Redirect to="/"/>

                                return <SignIn {...props} updateLocation={newLocation => { this.setState({ location: newLocation }) }} />
                            }}
                        ></Route>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
