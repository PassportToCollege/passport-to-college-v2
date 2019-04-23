import "./Checkbox.css";

import React, { Component } from "react";
import propTypes from "prop-types";

class Checkbox extends Component {
  static propTypes = {
    boxName: propTypes.string,
    boxValue: propTypes.string,
    boxChecked: propTypes.bool,
    boxLabel: propTypes.string,
    doClick: propTypes.func
  }

  static defaultProps = {
    boxChecked: false
  }

  render() {
    return (
      <div className="checkbox__container" role="tablist">
        <span className="checkbox" role="tab"
          data-checked={this.props.boxChecked ? "checked" : "unchecked"}
          onClick={this.handleCheckboxClick}>
          <span className="checkbox__inner"></span>
        </span>
        <span className="checkbox__label"
          onClick={this.handleCheckboxClick}>
          {this.props.boxLabel}
        </span>
      </div>
    )
  }

  handleCheckboxClick = () => {
    if ("function" === typeof this.props.doClick)
      this.props.doClick(this.props.boxName, !this.props.boxChecked);
  }
}

export default Checkbox;