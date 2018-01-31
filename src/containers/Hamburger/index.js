import "./Hamburger.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import feather from "feather-icons";

import * as hamburgerActions from "../../actions/hamburgerActions";
import * as routes from "../../constants/routes";

class Hamburger extends Component {
  componentWillMount() {
    this.props.hamburgerActions.closeHamburger();
  }

  componentWillUnmount() {
    this.props.hamburgerActions.closeHamburger();
  }

  render() {
    return (
      <div className="hamburger" data-active={this.props.hamburgerOpen ? "yes" : "no"}>
        <div 
          className="hamburger__close_button" 
          onClick={() => this.props.hamburgerActions.closeHamburger()}>
          <i data-feather="x" width="18" height="18"></i>
        </div>
        <div className="hamburger__navs">
          <div className="hamburger__main_nav">
            <ul>
              <li><NavLink exact to={routes.LANDING} activeClassName="active">Home</NavLink></li>
              <li><NavLink to={routes.ABOUT_US} activeClassName="active">About Us</NavLink></li>
              <li><NavLink to={routes.SCHOLARS} activeClassName="active">Scholars</NavLink></li>
              <li><NavLink to={routes.EVENTS} activeClassName="active">Events</NavLink></li>
              <li><NavLink to={routes.STORIES} activeClassName="active">Stories</NavLink></li>
              <li><NavLink to={routes.CONTACT_US} activeClassName="active">Contact Us</NavLink></li>
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