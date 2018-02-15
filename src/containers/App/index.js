import './App.css';

import React, { Component } from 'react';
import { Route, Router, Redirect } from "react-router-dom";

import history from "../../constants/history";
import * as routes from "../../constants/routes";
import { isAuthorized, isApplicant, activeUser } from "../../utils";

import Hamburger from "../Hamburger";
import Navigation from "../Navigation";
import NavigationAdmin from "../NavigationAdmin";

import Home from "../Home";
import SignIn from "../Auth/SignIn";

import Dashboard from "../Dashboard/Home";
import Applications from "..//Dashboard/Applications";
import Users from "../Dashboard/Users";
import Profile from "../Dashboard/Profile";
import Apply from "../Apply";
import ApplicationPortal from "../Apply/Portal";

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
    if(this.state.location === "sign-in" ||
      this.state.location === "apply") {
      main_bg.backgroundColor = "#FF6561";
    } else if(this.state.location.indexOf("dashboard") > -1 || 
      this.state.location === "application portal") {
      main_bg.backgroundColor = "#FFF";
    }

    return (
      <Router history={history}>
        <div className="app">
          {this.renderHamburger()}
          <div className="app__main" data-hamburger={this.state.hamburgerState} style={main_bg}>
            {this.selectNavigation()}
            <Route exact path={routes.LANDING.route} render={props => this.defaultRouteMiddleware(props, Home)}></Route>
            <Route path={routes.SIGN_IN.route} render={(props) => this.signInMiddleware(props)}></Route>
            <Route exact path={routes.DASHBOARD.route} render={props => this.defaultRouteMiddleware(props, Dashboard)}></Route>
            <Route path={routes.APPLICATIONS.route} render={props => this.defaultRouteMiddleware(props, Applications)}></Route>
            <Route path={routes.USERS.route} render={props => this.defaultRouteMiddleware(props, Users)}></Route>
            <Route path={routes.PROFILE.route} render={props => this.defaultRouteMiddleware(props, Profile)}></Route>
            <Route exact path={routes.APPLY.route} render={props => this.applyLandingMiddleware(props, Apply)}></Route>
            <Route path={routes.APPLY_PORTAL.route} render={props => this.applicationPortalMiddleware(props, ApplicationPortal)}></Route>
          </div>
        </div>
      </Router>
    );
  }

  defaultRouteMiddleware(props, Component) {
    return <Component {...props} updateLocation={newLocation => { this.setState({ location: newLocation }) }} />
  }

  signInMiddleware(props) {
    if(isAuthorized())
      return <Redirect to="/"/>

    return <SignIn {...props} updateLocation={newLocation => { this.setState({ location: newLocation }) }} />
  }

  applyLandingMiddleware(props) {
    if(isApplicant())
      return <Redirect to={`/apply/p/${activeUser()}`} />

    return <Apply {...props} updateLocation={newLocation => { this.setState({ location: newLocation }); }} />
  }

  applicationPortalMiddleware(props) {
    if (isApplicant())
      return <ApplicationPortal {...props} updateLocation={newLocation => { this.setState({ location: newLocation }); }} />
      
    return <Redirect to="/apply/" />
  }

  renderHamburger() {
    if (this.state.location.indexOf("dashboard") === -1 &&
      this.state.location !== "application portal")
      return <Hamburger updateHamburgerState={newState => { this.setState({ hamburgerState: newState }) }} />
  }

  selectNavigation() {
    if (this.state.location !== "application portal") {
      if(this.state.location.indexOf("dashboard") > -1)
        return <NavigationAdmin />
      
      return <Navigation updateHamburgerState={newState => { this.setState({ hamburgerState: newState }) }} />
    }

    return null;
  }
}

export default App;
