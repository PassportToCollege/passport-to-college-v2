import "./LinkDropdown.css";

import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import propTypes from "prop-types";

class LinkDropdown extends Component {
  render() {
    return (
      <ul className="link_dropdown" data-state="closed"
        tabIndex="0"
        ref={ul => this.dropdown = ul}
        onBlur={this.handleBlur}>
        <li className="link_dropdown__toggle"
          onClick={this.toggleState}>{this.props.name}</li>
        <li className="link_dropdown__items">
          <ul>
            {
              this.props.data.map((item, i) => {
                return (
                  <li key={i} className="link_dropdown__item">
                    <NavLink exact to={item.to} 
                      className="link_dropdown__link"
                      activeClassName="active"
                      data-label={item.label}
                      onClick={this.props.handleLinkClick}>
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
  }

  toggleState = () => {
    const curr = this.dropdown.getAttribute("data-state");
    this.dropdown.setAttribute("data-state", curr === "closed" ? "open" : "closed");
  }

  handleBlur = e => {
    e.preventDefault();
    this.dropdown.setAttribute("data-state", "closed");
  }

  handleLinkClick = e => {
    if ("function" === typeof this.props.doClick)
      this.props.doClick(e)
  }
};

LinkDropdown.propTypes = {
  name: propTypes.string,
  data: propTypes.arrayOf(propTypes.object),
  doClick: propTypes.func
};

export default withRouter(LinkDropdown);