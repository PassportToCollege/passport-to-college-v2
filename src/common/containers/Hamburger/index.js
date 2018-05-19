import "./Hamburger.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import feather from "feather-icons";
import propTypes from "prop-types";
import Cookies from "universal-cookie";

import * as hamburgerActions from "../../actions/hamburgerActions";
import * as authActions from "../../actions/authActions";
import * as routes from "../../constants/routes";
import { isAuthorized, isAdmin } from "../../utils";

const mainNavItems = [
  routes.LANDING
]

const cookies = new Cookies();

class Hamburger extends Component {
  componentDidMount() {
    feather.replace();
  }
  
  render() {
    return (
      <div className="hamburger" data-active={this.props.hamburgerState.current}>
        <div className="hamburger__close_space"
          onClick={this.handleCloseButtonClick}>
        </div>
        <div className="hamburger__navs">
          <div
            className="hamburger__close_button"
            onClick={this.handleCloseButtonClick}>
            <i data-feather="x" width="18" height="18"></i>
          </div>
          <div className="hamburger__main_nav">
            <ul>
              {mainNavItems.map((v) => {
                return (
                  <li key={v.route}>
                    <a 
                      href={v.route}
                      onClick={this.handleCloseButtonClick}>
                      {v.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="hamburger__other_nav">
            <ul>
              <li><NavLink to={routes.APPLY.route} onClick={this.handleCloseButtonClick}>{routes.APPLY.name}</NavLink></li>
              {this.selectAuthLink()}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  selectAuthLink() {
    if (isAuthorized()) {
      let links = [];
      
      if(isAdmin())
        links.push(<li key="dashboard"><NavLink to={routes.DASHBOARD.route} onClick={this.handleCloseButtonClick}>{routes.DASHBOARD.name}</NavLink></li>);
      
      links.push(<li key="sign-out"><NavLink to={routes.SIGN_OUT.route} onClick={this.handleSignOutClick}>{routes.SIGN_OUT.name}</NavLink></li>);
      return links;
    }

    return <li><NavLink to={routes.SIGN_IN.route} onClick={this.handleCloseButtonClick}>{routes.SIGN_IN.name}</NavLink></li>
  }

  handleCloseButtonClick = () => {
    this.props.hamburgerActions.closeHamburger();
    this.props.updateHamburgerState("closed");
  }

  handleSignOutClick = (e) => {
    e.preventDefault();

    const user = cookies.get("ssid");

    this.handleCloseButtonClick();
    this.props.authActions.doSignOut(user);
  }
}

Hamburger.propTypes = {
  hamburgerActions: propTypes.object,
  hamburgerState: propTypes.object,
  authActions: propTypes.object,
  updateHamburgerState: propTypes.func
};

const mapStateToProps = state => {
  return {
    hamburgerState: state.hamburgerState,
    auth: state.auth
  };
}

const mapDispatchToProps = dispatch => {
  return {
    hamburgerActions: bindActionCreators(hamburgerActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hamburger);