import "./LinkDropdown.css";

import React from "react";
import { withRouter, NavLink } from "react-router-dom";
import propTypes from "prop-types";

const LinkDropdown = ({ name, data, doClick }) => {
  const toggleState = () => {
    const curr = this.dropdown.getAttribute("data-state");
    this.dropdown.setAttribute("data-state", curr === "closed" ? "open" : "closed");
  }

  const handleBlur = e => {
    e.preventDefault();
    this.dropdown.setAttribute("data-state", "closed");
  }

  const handleLinkClick = e => {
    if ("function" === typeof doClick)
      doClick(e)
  }

  return (
    <ul className="link_dropdown" data-state="closed"
      tabIndex="0"
      ref={ul => this.dropdown = ul}
      onBlur={handleBlur}>
      <li className="link_dropdown__toggle"
        onClick={toggleState}>{name}</li>
      <li className="link_dropdown__items">
        <ul>
          {
            data.map((item, i) => {
              return (
                <li key={i} className="link_dropdown__item">
                  <NavLink exact to={item.to} 
                    className="link_dropdown__link"
                    activeClassName="active"
                    data-label={item.label}
                    onClick={handleLinkClick}>
                    {item.label}
                  </NavLink>
                </li>
              )
            })
          }
        </ul>
      </li>
    </ul>
  )
};

LinkDropdown.propTypes = {
  name: propTypes.string,
  data: propTypes.arrayOf(propTypes.object),
  doClick: propTypes.func
};

export default withRouter(LinkDropdown);