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
    options: propTypes.arrayOf(propTypes.object),
    onActiveChange: propTypes.func
  }

  componentDidMount() {
    const autoSwitcher = setInterval(() => {
      this.switchNext();
    }, 5000);

    this.setState({ autoSwitcher });
  }

  componentWillUnmount() {
    clearInterval(this.state.autoSwitcher);
  }

  render() {
    return (
      <div className="scroll_switcher">
        <span className="scroll_switcher__previous"
          onClick={this.switchPrevious}>
          <FontAwesomeIcon icon={faAngleUp} />
        </span>
        <ul className="scroll_switcher__list">
          <li className="scroll_switcher__previous_item"
            onClick={this.switchPrevious}>
            {this.props.options[this.state.previous].label}
          </li>
          <li className="scroll_switcher__active_item">
            <h3>{this.props.options[this.state.active].label}</h3>
          </li>
          <li className="scroll_switcher__next_item"
            onClick={this.switchNext}>
            {this.props.options[this.state.next].label}
          </li>
        </ul>
        <span className="scroll_switcher__next"
          onClick={this.switchNext}>
          <FontAwesomeIcon icon={faAngleDown} />
        </span>
      </div>
    )
  }

  switchNext = () => {
    const { options } = this.props;
    const { active, next } = this.state;

    this.setState({
      active: next,
      previous: active,
      next: (next + 1 <= options.length - 1) ? next + 1 : 0
    }, () => {
      if ("function" === typeof this.props.onActiveChange)
        this.props.onActiveChange(options[this.state.active]);
    });

  }

  switchPrevious = () => {
    const { options } = this.props;
    const { active, previous } = this.state;

    this.setState({
      active: previous,
      previous: (previous - 1 >= 0) ? previous - 1 : options.length - 1,
      next: active
    }, () => {
      if ("function" === typeof this.props.onActiveChange)
        this.props.onActiveChange(options[this.state.active]);
    });
  }
}

export default ScrollSwitcher;