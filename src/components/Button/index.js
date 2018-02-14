import "./Button.css";

import React, { Component } from "react";
import propTypes from "prop-types";

class Button extends Component {
  handleClick = (e) => {
    if ("function" === typeof this.props.doClick)
      this.props.doClick(e);
  }

  render() {
    return (
      <button type={this.props.type} onClick={this.handleClick} style={this.props.styles || {}}>
        {this.props.text}
      </button>
    )
  }
}

Button.propTypes = {
  styles: propTypes.object,
  type: propTypes.string,
  doClick: propTypes.func,
  text: propTypes.string
};

export default Button;