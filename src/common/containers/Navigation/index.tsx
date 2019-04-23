import "./Navigation.css";

import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import propTypes from "prop-types";
import { isBrowser } from "../../utils";
import * as routes from "../../constants/routes";
import * as hamburgerActions from "../../actions/hamburgerActions";

import logoWhite from "../../assets/images/logo__text__white.png";
import logoDark from "../../assets/images/logo__text__dark.png";

const mainNavItems = [
  routes.LANDING,
  routes.ABOUT_US,
  routes.SCHOLARS,
  // routes.EVENTS,
  routes.STORIES,
  routes.CONTACT_US
]

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addBackground: false,
      lastScroll: 0,
      sDirection: "none",
      onWhite: props.onWhite
    };
  }

  componentDidMount() {
    if (isBrowser) {
      this.setState({ lastScroll: window.pageYOffset || document.documentElement.scrollTop });
      window.addEventListener("scroll", this.watchScroll);
    }
  }

  componentWillUnmount() {
    if (isBrowser)
      window.removeEventListener("scroll", this.watchScroll);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.onWhite !== nextProps.onWhite)
      return { onWhite: nextProps.onWhite };

    return null;
  }

  render() {
    return (
      <div className="navigation" 
        data-add-bg={this.state.addBackground ? "active" : "inactive"}
        data-scroll-direction={this.state.sDirection}
        data-on-white={this.state.onWhite ? "active" : "inactive"}>
        <div className="navigation__container">
          <div className="navigation__logo_container">
            <Link to={routes.LANDING.route}>
              <img src={this.state.addBackground || this.state.onWhite ? logoDark : logoWhite} 
                alt="Passport to College Logo" />
            </Link>
          </div>
          <nav className="navigation__nav_container">
            <ul>
              {mainNavItems.map(v => {
                return (
                  <li key={v.route}>
                    <NavLink
                      exact={v.name === "Stories" || v.name === "Scholars" ? false : true} 
                      to={v.route}
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
    const { lastScroll } = this.state;
    const currScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (lastScroll > 100) {
      this.setState({ addBackground: true });
    } else {
      this.setState({ addBackground: false });
    }

    if (currScroll > lastScroll && lastScroll > 500) {
      this.setState({ sDirection: "down" });
    } else {
      this.setState({ sDirection: "up" });
    }

    this.setState({ lastScroll: currScroll });
  }

  handleHamburgerOpenClick = () => {
    this.props.hamburgerActions.openHamburger();
    this.props.updateHamburgerState("open");
  }
}

Navigation.defaultProps = {
  onWhite: false
};

Navigation.propTypes = {
  hamburgerActions: propTypes.object,
  hamburgerState: propTypes.object,
  updateHamburgerState: propTypes.func,
  onWhite: propTypes.bool
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