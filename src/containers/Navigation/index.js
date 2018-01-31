import "./Navigation.css";

import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

import * as routes from "../../constants/routes";
import * as hamburgerActions from "../../actions/hamburgerActions";
const logo = require("../../assets/images/logo__text__white.png");

const mainNavItems = [
  routes.LANDING,
  routes.ABOUT_US,
  routes.SCHOLARS,
  routes.EVENTS,
  routes.STORIES,
  routes.CONTACT_US
]

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
            {mainNavItems.map((v, i) => {
              return (
                <li>
                  <NavLink exact to={v.route} activeClassName="active" onClick={this.handleCloseButtonClick}>
                    {v.name}
                  </NavLink>
                </li>
              )
            })}            
          </ul>
        </nav>
        <div 
          className="navigation__hamburger"
          onClick={this.handleHamburgerOpenClick}>
          <span className="toggle toggle__top"></span>
          <span className="toggle toggle__middle"></span>
          <span className="toggle toggle__bottom"></span>
        </div>
      </div>
    );
  }

  handleHamburgerOpenClick = () => {
    this.props.hamburgerActions.openHamburger();
    this.props.updateHamburgerState("open");
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