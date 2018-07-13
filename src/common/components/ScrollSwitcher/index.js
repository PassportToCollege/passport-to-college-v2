import "./ScrollSwitcher.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/fontawesome-free-solid";

class ScrollSwitcher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 0,
      next: props.options.length > 1 ? 1 : 0,
      previous: props.options.length - 1
    }
  }

  static propTypes = {
    options: propTypes.arrayOf(propTypes.object)
  }

  render() {
    return (
      <div className="scroll_switcher">
        <span className="scroll_switcher__previous">
          <FontAwesomeIcon icon={faAngleUp} />
        </span>
        <ul className="scroll_switcher__list">
          <li className="scroll_switcher__previous_item">
            {this.props.options[this.state.previous].label}
          </li>
          <li className="scroll_switcher__active_item">
            <h3>{this.props.options[this.state.active].label}</h3>
          </li>
          <li className="scroll_switcher__next_item">
            {this.props.options[this.state.next].label}
          </li>
        </ul>
        <span className="scroll_switcher__next">
          <FontAwesomeIcon icon={faAngleDown} />
        </span>
      </div>
    )
  }
}

export default ScrollSwitcher;