import "./ContactUsNav.css";

import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import propTypes from "prop-types";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faEnvelope, faIdCard } from "@fortawesome/fontawesome-free-solid";

import {
  CONTACT_US,
  CONTACT_US_MESSAGE
} from "../../../constants/routes";

class ContactUsNav extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  static propTypes = {}

  render() {
    
    return (
      <nav className="contact_us__nav">
        <NavLink exact
          to={CONTACT_US.route}
          activeClassName="active">
          <span>
            <FontAwesomeIcon icon={faIdCard} />
          </span>
        </NavLink>
        <NavLink exact
          to={CONTACT_US_MESSAGE.route}
          activeClassName="active"
          title="Send Message">
          <span>
            <FontAwesomeIcon icon={faEnvelope} />
          </span>
        </NavLink>
      </nav>
    );
  }
}

export default ContactUsNav;