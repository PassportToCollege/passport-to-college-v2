import "./CardNavigation.css";

import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserGraduate,
  faBriefcase,
  faUserTie,
  faLock
} from "@fortawesome/fontawesome-free-solid";
import propTypes from "prop-types";

class CardNavigation extends Component {
  static propTypes = {
    locations: propTypes.arrayOf(propTypes.object)
  }

  icons = {
    users: faUsers,
    students: faUserGraduate,
    staff: faBriefcase,
    applicants: faUserTie,
    admins: faLock
  }

  getIcon = (icon) => {
    return this.icons[icon];
  }

  render() {
    return (
      <nav className="card_navigation">
        { 
          this.props.locations.length ?
            this.props.locations.map(location => {
              return (
                <NavLink key={location.pathname} 
                  to={location.pathname}
                  activeClassName="active" 
                  className="card_navigation__item">
                  <span className="card_navigation__icon">
                    <FontAwesomeIcon icon={this.getIcon(location.icon)} />
                  </span>
                  <span className="card_navigation__label">{location.label}</span>
                </NavLink>
              )
            }) : null
          }
      </nav>
    )
  }
}

export default withRouter(CardNavigation);