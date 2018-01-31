import "./Navigation.css";

import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

import * as routes from "../../constants/routes";
import * as hamburgerActions from "../../actions/hamburgerActions";
const logo = require("../../assets/images/logo__text__white.png");

class Navigation extends Component {
  render() {
    return (
      <div className="navigation">
        <div className="navigation__logo_container">
          <Link to={routes.LANDING}>
            <img src={logo} alt="Passport to College Logo" />
          </Link>
        </div>
        <nav className="navigation__nav_container">
          <ul>
            <li><NavLink exact to={routes.LANDING} activeClassName="active">Home</NavLink></li>
            <li><NavLink exact to={routes.ABOUT_US} activeClassName="active">About Us</NavLink></li>
            <li><NavLink exact to={routes.SCHOLARS} activeClassName="active">Scholars</NavLink></li>
            <li><NavLink to={routes.EVENTS} activeClassName="active">Events</NavLink></li>
            <li><NavLink to={routes.STORIES} activeClassName="active">Stories</NavLink></li>
            <li><NavLink to={routes.CONTACT_US} activeClassName="active">Contact Us</NavLink></li>            
          </ul>
        </nav>
        <div 
          className="navigation__hamburger"
          onClick={() => this.props.hamburgerActions.openHamburger()}>
          <span className="toggle toggle__top"></span>
          <span className="toggle toggle__middle"></span>
          <span className="toggle toggle__bottom"></span>
        </div>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    hamburgerOpen: state.hamburgerOpen
  };
}

const mapDispatchToProps = dispatch => {
  return {
    hamburgerActions: bindActionCreators(hamburgerActions, dispatch)
  }
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation));