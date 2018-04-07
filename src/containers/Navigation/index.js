import "./Navigation.css";

import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import propTypes from "prop-types";

import * as routes from "../../constants/routes";
import * as hamburgerActions from "../../actions/hamburgerActions";

const logoWhite = require("../../assets/images/logo__text__white.png");
const logoDark = require("../../assets/images/logo__text__dark.png");

const mainNavItems = [
  routes.LANDING,
  routes.ABOUT_US,
  routes.SCHOLARS,
  routes.EVENTS,
  routes.STORIES,
  routes.CONTACT_US
]

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addBackground: false
    };
  }

  componentWillMount() {
    window.addEventListener("scroll", this.watchScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.watchScroll);
  }

  render() {
    return (
      <div className="navigation" data-add-bg={this.state.addBackground ? "active" : "inactive"}>
        <div className="navigation__container">
          <div className="navigation__logo_container">
            <Link to={routes.LANDING}>
              <img src={this.state.addBackground ? logoDark : logoWhite} 
                alt="Passport to College Logo" />
            </Link>
          </div>
          <nav className="navigation__nav_container">
            <ul>
              {mainNavItems.map((v, i) => {
                return (
                  <li key={v.route}>
                    <NavLink
                      exact to={v.route}
                      activeClassName="active"
                      onClick={this.handleCloseButtonClick}>
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
      </div>
    );
  }

  watchScroll = () => {
    const scrollTop = document.scrollingElement.scrollTop;
    
    if (scrollTop > 100) {
      this.setState({ addBackground: true });
    } else {
      this.setState({ addBackground: false });
    }
  }

  handleHamburgerOpenClick = () => {
    this.props.hamburgerActions.openHamburger();
    this.props.updateHamburgerState("open");
  }
}

Navigation.propTypes = {
  hamburgerActions: propTypes.object,
  hamburgerState: propTypes.object,
  updateHamburgerState: propTypes.func
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