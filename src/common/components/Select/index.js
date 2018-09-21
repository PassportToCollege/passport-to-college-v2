import "./Select.css";

import React, { Component } from "react";
import propTypes from "prop-types";

class Select extends Component {
  render() {
    return (
      <select className="select"
        ref={select => this.select = select}
        defaultValue={this.props.selectDefault}
        disabled={this.props.selectDisabled}
        name={this.props.selectName}
        onChange={this.onSelectChange}>
        {this.props.children}
      </select>
    )
  }

  onSelectChange = () => {
    if ("function" === typeof this.props.whenChange)
      this.props.whenChange(this.select)
  }
}

Select.defaultProps = {
  selectDisabled: false
};

Select.propTypes = {
  selectName: propTypes.string,
  selectDisabled: propTypes.bool,
  selectDefault: propTypes.string,
  whenChange: propTypes.func,
  children: propTypes.any
}

export default Select;