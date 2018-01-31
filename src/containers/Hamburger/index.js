import "./Hamburger.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import feather from "feather-icons";

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
  componentWillMount() {
    this.props.hamburgerActions.closeHamburger();
  }

  render() {
    return (
      <div className="hamburger" data-active={this.props.hamburgerOpen ? "yes" : "no"}>
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
                    <NavLink exact to={v.route} activeClassName="active" onClick={this.handleCloseButtonClick}>
                      {v.name}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="hamburger__other_nav">
            <ul>
              <li><NavLink to={routes.APPLY}>Apply</NavLink></li>
              <li><NavLink to={routes.LOGIN}>Login</NavLink></li>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hamburger);