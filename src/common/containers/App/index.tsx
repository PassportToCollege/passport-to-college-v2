import './App.css';

import * as React from 'react';
import { Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators, AnyAction } from "redux";

import * as routes from "../../constants/routes";
import * as postsActions from "../../actions/postsActions";
import {
  isAuthorized,
  initializeFacebook,
  isBrowser,
  activeUser,
  isApplicant,
  isStudent,
  isAdmin
} from "../../utils";

import InitialState from "../../reducers/initialState";
import iAppState from "../../imodels/iAppState";

import Hamburger from "../Hamburger";
import Navigation from "../Navigation";
import Footer from "../Footer";

import Home from '../Home';
import About from "../AboutUs";
import ContactUs from "../ContactUs";
import Events from "../Events";
import Stories from "../Stories";
import Story from "../Story";
import Scholars from "../Scholars";
import CommunityGuidlines from "../Stories/CommunityGuidlines";
import SignIn from "../Auth/SignIn";
import SignUp from "../Auth/SignUp";
import ResetPassword from "../Auth/ResetPassword";
import ConfirmEmail from "../Auth/ConfirmEmail";

import Dashboard from "../Dashboard";
import StudentDashboard from "../StudentDashboard";
import Apply from "../Apply";
import ApplicationPortal from "../Apply/Portal";

const AppInitialState = {
  Hamburger : InitialState.Hamburger,
  location : ""
};
type State = typeof AppInitialState;
type Props = {
  Posts : iAppState["Posts"]
  postsActions : any,
};

class App extends React.PureComponent<Props, State> {
  readonly state : State = AppInitialState;

  componentDidMount() {
    if (isBrowser) {
      this.props.postsActions.doPostsGetMostRecent();
    } else {
      this.props.postsActions.postsGetMostRecentInitiated();
    }

    initializeFacebook(document, "script", "facebook-jssdk");
  }

  render() {
    let mainBg : React.CSSProperties = {};
    let bodyStyles: React.CSSProperties = {};

    if (this.state.location === "sign-in" ||
      this.state.location === "apply" ||
      this.state.location === "reset" ||
      this.state.location === "confirm-email" ||
      this.state.location === "sign-up")
    {
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
        <div className="app__main" data-hamburger={this.state.Hamburger.current} style={mainBg}>
          {this.selectNavigation()}
          <div className={`app__body app__body_${this.state.location.replace(" on-white", "")}`} style={bodyStyles}>
            <Route exact path={routes.LANDING.route} render={props => this.landingMiddleware(props)}></Route>
            <Route exact path={routes.ABOUT_US.route} render={props => this.defaultRouteMiddleware(props, About)}></Route>
            <Route path={routes.CONTACT_US.route} render={props => this.defaultRouteMiddleware(props, ContactUs)}></Route>
            {/* <Route exact path={routes.EVENTS.route} render={props => this.defaultRouteMiddleware(props, Events)}></Route> */}
            <Route path={routes.SCHOLARS.route} render={props => this.defaultRouteMiddleware(props, Scholars)}></Route> 
            <Route exact path={routes.STORIES.route} render={props => this.defaultRouteMiddleware(props, Stories)}></Route>
            <Route exact path={routes.COMMUNITY_GUIDLINES.route} render={props => this.defaultRouteMiddleware(props, CommunityGuidlines)}></Route>
            <Route exact path={routes.STORY.route} render={props => this.defaultRouteMiddleware(props, Story)}></Route>
            <Route path={routes.STORIES_CATEGORY.route} render={props => this.defaultRouteMiddleware(props, Stories)}></Route>
            <Route path={routes.SIGN_IN.route} render={(props) => this.authMiddleware(props, SignIn)}></Route>
            <Route path={routes.SIGN_UP.route} render={props => this.authMiddleware(props, SignUp)}></Route>
            <Route path={routes.RESET_PASSWORD.route} render={(props) => this.authMiddleware(props, ResetPassword)}></Route>
            <Route path={routes.CONFIRM_EMAIL_ADDRESS.route} render={(props) => this.defaultRouteMiddleware(props, ConfirmEmail)}></Route>
            <Route path={routes.DASHBOARD.route} render={props => this.protectedAdminMiddleware(props, Dashboard)}></Route>
            <Route path={routes.STUDENT_DASHBOARD.route} render={props => this.protectedStudentMiddleware(props, StudentDashboard)}></Route>
            <Route path={routes.APPLY.route} render={props => this.defaultRouteMiddleware(props, ApplicationPortal)}></Route>
            {/* <Route path={routes.APPLY_PORTAL.route} render={props => this.applicationPortalMiddleware(props, ApplicationPortal)}></Route> */}
          </div>
          {
            this.state.location !== "" &&
            this.state.location !== "application portal" &&
            this.state.location.indexOf("dashboard") === -1 ?
              <Footer posts={this.props.Posts} /> : null 
          }
        </div>
      </div>
    );
  }

  defaultRouteMiddleware(props : RouteComponentProps, Component : any) : JSX.Element 
  {
    return <Component {...props} updateLocation={(newLocation : string) => { this.setState({ location: newLocation }) }} />
  }

  authMiddleware(props: RouteComponentProps, Component: any): JSX.Element 
  {
    if(isAuthorized())
      return <Redirect to="/"/>

    return <Component {...props} updateLocation={(newLocation : string) => { this.setState({ location: newLocation }) }} />
  }

  protectedMiddleware(props: RouteComponentProps, Component: any): JSX.Element {
    if (!isAuthorized())
      return <Redirect to="/auth/sign-in" />

    return <Component {...props} updateLocation={(newLocation : string) => { this.setState({ location: newLocation }) }} />
  }

  protectedAdminMiddleware(props: RouteComponentProps, Component: any): JSX.Element {
     if (!isAuthorized())
      return <Redirect to="/auth/sign-in" />

    if (isAdmin())
      return <Component {...props} updateLocation={(newLocation : string) => { this.setState({ location: newLocation }) }} />

    if (isStudent())
      return <Redirect to="/scholar/dashboard" />


    return <Redirect to="/" />
  }

  protectedStudentMiddleware(props: RouteComponentProps, Component: any): JSX.Element {
    if (!isAuthorized())
      return <Redirect to="/auth/sign-in" />

    if (isAdmin())
      return <Redirect to="/admin/dashboard" />

    if (isStudent())
      return <Component {...props} updateLocation={(newLocation : string) => { this.setState({ location: newLocation }) }} />

    return <Redirect to="/" />
  }

  applyLandingMiddleware(props : RouteComponentProps) : JSX.Element {
    if (isAuthorized()) {
      if(isApplicant())
        return <Redirect to={`/apply/p/${activeUser()}`} />

      return <Redirect to="/" />
    }

    return <Apply {...props} updateLocation={(newLocation : string) => { this.setState({ location: newLocation }); }} />
  }

  landingMiddleware(props : RouteComponentProps) : JSX.Element {
    return (
      <Home {...props} posts={this.props.Posts}
        updateLocation={(newLocation : string) => { this.setState({ location: newLocation }); }} />
    );
  }

  renderHamburger() : JSX.Element | void {
    if (this.state.location.indexOf("dashboard") === -1 &&
      this.state.location !== "application portal")
      {
        return <Hamburger updateHamburgerState={(newState : iAppState["Hamburger"]) => this.setState({ Hamburger : newState })} />
      }
  }

  selectNavigation() : JSX.Element | null {
    if (this.state.location !== "application portal") {
      if(this.state.location.indexOf("dashboard") > -1)
        return null;

      return <Navigation 
        onWhite={this.state.location.indexOf("on-white") > -1}
        updateHamburgerState={(newState: iAppState["Hamburger"]) => this.setState({ Hamburger: newState })} />
    }

    return null;
  }

  renderFooter() : JSX.Element | null {
    if (this.state.location !== "application portal" &&
      this.state.location.indexOf("dashboard") > -1) {
        return <Footer posts={this.props.Posts} />
      }

    return null;
  }
}

const mapStateToProps = (state : iAppState) : any => {
  return {
    Posts: state.Posts
  };
};

const mapDispatchToProps = (dispatch : any) : any => {
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
