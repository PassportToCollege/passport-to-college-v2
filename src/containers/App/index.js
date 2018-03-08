import './App.css';

import React, { Component } from 'react';
import { Route, BrowserRouter, Redirect } from "react-router-dom";

import * as routes from "../../constants/routes";
import { isAuthorized, isApplicant, activeUser } from "../../utils";

import Hamburger from "../Hamburger";
import Navigation from "../Navigation";
import NavigationAdmin from "../NavigationAdmin";

import Home from "../Home";
import SignIn from "../Auth/SignIn";
import ResetPassword from "../Auth/ResetPassword";
import ConfirmEmail from "../Auth/ConfirmEmail";

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
    let bodyStyles = {};
    if(this.state.location === "sign-in" ||
      this.state.location === "apply" ||
      this.state.location === "reset" ||
      this.state.location === "confirm-email") {
      main_bg.backgroundColor = "#FF6561";
    } else if(this.state.location.indexOf("dashboard") > -1 || 
      this.state.location === "application portal") {
      main_bg.backgroundColor = "#FFF";
      bodyStyles = {
        paddingTop: "0",
        minHeight: "100vh",
        position: "static"
      };
    }

    return (
      <BrowserRouter>
        <div className="app">
          {this.renderHamburger()}
          <div className="app__main" data-hamburger={this.state.hamburgerState} style={main_bg}>
            {this.selectNavigation()}
            <div className="app__body" style={bodyStyles}>
              <Route exact path={routes.LANDING.route} render={props => this.defaultRouteMiddleware(props, Home)}></Route>
              <Route path={routes.SIGN_IN.route} render={(props) => this.authMiddleware(props, SignIn)}></Route>
              <Route path={routes.RESET_PASSWORD.route} render={(props) => this.authMiddleware(props, ResetPassword)}></Route>
              <Route path={routes.CONFIRM_EMAIL_ADDRESS.route} render={(props) => this.defaultRouteMiddleware(props, ConfirmEmail)}></Route>
              <Route exact path={routes.DASHBOARD.route} render={props => this.protectedMiddleware(props, Dashboard)}></Route>
              <Route path={routes.APPLICATIONS.route} render={props => this.protectedMiddleware(props, Applications)}></Route>
              <Route path={routes.USERS.route} render={props => this.protectedMiddleware(props, Users)}></Route>
              <Route path={routes.PROFILE.route} render={props => this.protectedMiddleware(props, Profile)}></Route>
              <Route exact path={routes.APPLY.route} render={props => this.applyLandingMiddleware(props, Apply)}></Route>
              <Route path={routes.APPLY_PORTAL.route} render={props => this.applicationPortalMiddleware(props, ApplicationPortal)}></Route>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }

  defaultRouteMiddleware(props, Component) {
    return <Component {...props} updateLocation={newLocation => { this.setState({ location: newLocation }) }} />
  }

  authMiddleware(props, Component) {
    if(isAuthorized())
      return <Redirect to="/"/>

    return <Component {...props} updateLocation={newLocation => { this.setState({ location: newLocation }) }} />
  }

  protectedMiddleware(props, Component) {
    if (!isAuthorized())
      return <Redirect to="/" />

    return <Component {...props} updateLocation={newLocation => { this.setState({ location: newLocation }) }} />
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
