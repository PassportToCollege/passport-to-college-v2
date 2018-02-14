import "./Button.css";

import React, { Component } from "react";
import propTypes from "prop-types";

class Button extends Component {
  handleClick = (e) => {
    if ("function" === typeof this.props.doClick)
      this.props.doClick(e);
  }

  render() {
    let buttonStyles = Object.assign({}, this.props.styles);

    if (this.props.solid) {
      buttonStyles = Object.assign({}, buttonStyles, {
        backgroundColor: "#FF6561",
        color: "#fff"
      });
    }

    return (
      <button className="button" type={this.props.type} onClick={this.handleClick} style={buttonStyles}>
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