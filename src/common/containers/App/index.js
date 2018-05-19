import './App.css';

import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as routes from "../../constants/routes";
import * as postsActions from "../../actions/postsActions";
import {
  isAuthorized,
  initializeFacebook,
  isBrowser,
  activeUser,
  isApplicant,
  isAdmin
} from "../../utils";

import Navigation from "../Navigation";
import Hamburger from"../Hamburger";

import SignIn from "../Auth/SignIn";
import SignUp from "../Auth/SignUp";
import ResetPassword from "../Auth/ResetPassword";
import ConfirmEmail from "../Auth/ConfirmEmail";

import Dashboard from "../Dashboard";
import Apply from "../Apply";
import ApplicationPortal from "../Apply/Portal";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hamburgerState: "closed",
      location: ""
    };
  }

  static propTypes = {
    posts: propTypes.object,
    postsActions: propTypes.object
  }

  componentDidMount() {
    if (isBrowser) {
      this.props.postsActions.doPostsGetMostRecent();
    } else {
      this.props.postsActions.postsGetMostRecentInitiated();
    }

    initializeFacebook(document, "script", "facebook-jssdk");
  }

  render() {
    let mainBg = {};
    let bodyStyles = {};

    if (this.state.location === "sign-in" ||
      this.state.location === "apply" ||
      this.state.location === "reset" ||
      this.state.location === "confirm-email" ||
      this.state.location === "sign-up") {
      mainBg.backgroundColor = "#FF6561";
    } else if (this.state.location.indexOf("dashboard") > -1 ||
      this.state.location === "application portal") {
      mainBg.backgroundColor = "#FFF";
      bodyStyles = {
        paddingTop: "0",
        minHeight: "100vh",
        position: "static"
      };
    }

    return (
      <div className="app">
        {this.renderHamburger()}
        <div className="app__main" data-hamburger={this.state.hamburgerState} style={mainBg}>
          {this.selectNavigation()}
          <div className={`app__body app__body_${this.state.location}`} style={bodyStyles}>
            <Route path={routes.SIGN_IN.route} render={(props) => this.authMiddleware(props, SignIn)}></Route>
            <Route path={routes.SIGN_UP.route} render={props => this.authMiddleware(props, SignUp)}></Route>
            <Route path={routes.RESET_PASSWORD.route} render={(props) => this.authMiddleware(props, ResetPassword)}></Route>
            <Route path={routes.CONFIRM_EMAIL_ADDRESS.route} render={(props) => this.defaultRouteMiddleware(props, ConfirmEmail)}></Route>
            <Route path={routes.DASHBOARD.route} render={props => this.protectedMiddleware(props, Dashboard)}></Route>
            <Route exact path={routes.APPLY.route} render={props => this.applyLandingMiddleware(props, Apply)}></Route>
            <Route path={routes.APPLY_PORTAL.route} render={props => this.applicationPortalMiddleware(props, ApplicationPortal)}></Route>
          </div>
        </div>
      </div>
    );
  }

  defaultRouteMiddleware(props, Component) {
    return <Component {...props} updateLocation={newLocation => { this.setState({ location: newLocation }) }} />
  }

  authMiddleware(props, Component) {
    if(isAuthorized()) {
      if(isAdmin())
        return <Redirect to="/admin/dashboard"/>

      return <Redirect to="/" />
    }

    return <Component {...props} updateLocation={newLocation => { this.setState({ location: newLocation }) }} />
  }

  protectedMiddleware(props, Component) {
    if (!isAuthorized())
      return <Redirect to="/auth/sign-in" />

    return <Component {...props} updateLocation={newLocation => { this.setState({ location: newLocation }) }} />
  }

  applyLandingMiddleware(props) {
    if (isAuthorized()) {
      if (isApplicant())
        return <Redirect to={`/apply/p/${activeUser()}`} />

      if (isAdmin())
        return <Redirect to="/admin/dashboard" />

      return <Redirect to="/" />
    }

    return <Apply {...props} updateLocation={newLocation => { this.setState({ location: newLocation }); }} />
  }

  applicationPortalMiddleware(props) {
    if (isApplicant())
      return <ApplicationPortal {...props} updateLocation={newLocation => { this.setState({ location: newLocation }); }} />
      
    return <Redirect to="/" />
  }

  selectNavigation() {
    if (this.state.location !== "application portal") {
      if(this.state.location.indexOf("dashboard") > -1)
        return null;

      return <Navigation 
        onWhite={this.state.location === "stories"}
        updateHamburgerState={newState => this.setState({ hamburgerState: newState})}/>
    }

    return null;
  }

  renderHamburger() {
    if (this.state.location.indexOf("dashboard") === -1 &&
      this.state.location !== "application portal")
      return <Hamburger updateHamburgerState={newState => this.setState({ hamburgerState: newState })} />
  }
}

const mapStateToProps = state => {
  return {
    posts: state.posts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postsActions: bindActionCreators(postsActions, dispatch)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
