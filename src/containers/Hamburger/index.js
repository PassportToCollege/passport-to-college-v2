import "./Hamburger.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import feather from "feather-icons";
import propTypes from "prop-types";

import * as hamburgerActions from "../../actions/hamburgerActions";
import * as routes from "../../constants/routes";

const mainNavItems = [
  routes.LANDING,
  routes.ABOUT_US,
  routes.SCHOLARS,
  routes.EVENTS,
  routes.STORIES,
  routes.CONTACT_US
]

class Hamburger extends Component {
  render() {
    return (
      <div className="hamburger" data-active={this.props.hamburgerState.hamburgerState}>
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
              {mainNavItems.map((v, i) => {
                return (
                  <li>
                    <NavLink
                      key={v.route} 
                      exact to={v.route} 
                      activeClassName="active" 
                      onClick={this.handleCloseButtonClick}>
                      {v.name}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="hamburger__other_nav">
            <ul>
              <li><NavLink to={routes.APPLY.route} onClick={this.handleCloseButtonClick}>{routes.APPLY.name}</NavLink></li>
              <li><NavLink to={routes.LOGIN.route} onClick={this.handleCloseButtonClick}>{routes.LOGIN.name}</NavLink></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    feather.replace();
  }

  handleCloseButtonClick = () => {
    this.props.hamburgerActions.closeHamburger();
    this.props.updateHamburgerState("closed");
  }
}

Hamburger.propTypes = {
  hamburgerActions: propTypes.object,
  hamburgerState: propTypes.string
};

const mapStateToProps = state => {
  return {
    hamburgerState: state.hamburgerState
  };
}

const mapDispatchToProps = dispatch => {
  return {
    hamburgerActions: bindActionCreators(hamburgerActions, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hamburger);