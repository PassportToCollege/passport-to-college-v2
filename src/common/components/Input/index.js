import "./Input.css";

import React, { Component } from "react";
import propTypes from "prop-types";

class Input extends Component {
  render() {
    return (
      <input className="input" 
        ref={input => this.input = input}
        type={this.props.inputType}
        defaultValue={this.props.inputDefault}
        placeholder={this.props.inputPlaceholder}
        disabled={this.props.inputDisabled}
        name={this.props.inputName}
        onChange={this.onInputChange}
        onBlur={this.onInputBlur} />
    )
  }

  onInputChange = () => {
    if ("function" === typeof this.props.whenChange)
      this.props.whenChange(this.input)
  }

  onInputBlur = () => {
    if ("function" === typeof this.props.whenBlur)
      this.props.whenBlur(this.input);
  }
}

Input.defaultProps = {
  inputType: "text",
  inputDisabled: false
};

Input.propTypes = {
  inputType: propTypes.string,
  inputName: propTypes.string,
  inputDisabled: propTypes.bool,
  inputDefault: propTypes.string,
  inputPlaceholder: propTypes.string,
  whenChange: propTypes.func,
  whenBlur: propTypes.func
}

export default Input;