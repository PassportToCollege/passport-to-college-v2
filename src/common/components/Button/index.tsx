import "./Button.css";

import React, { Component } from "react";
import propTypes from "prop-types";

class Button extends Component {
  static propTypes = {
    styles: propTypes.object,
    type: propTypes.string,
    doClick: propTypes.func,
    text: propTypes.string,
    solid: propTypes.bool,
    disabled: propTypes.bool
  }

  handleClick = (e) => {
    if ("function" === typeof this.props.doClick)
      this.props.doClick(e);
  }

  render() {
    let buttonStyles = Object.assign({}, this.props.styles);

    if (this.props.solid) {
      buttonStyles = Object.assign({}, buttonStyles, {
        backgroundColor: (this.props.styles && this.props.styles.backgroundColor) ? this.props.styles.backgroundColor : "#FF6561",
        borderColor: (this.props.styles && this.props.styles.backgroundColor) ? this.props.styles.backgroundColor : "#FF6561",
        color: "#fff"
      });
    }

    if (this.props.disabled) {
      buttonStyles = Object.assign({}, buttonStyles, {
        backgroundColor: "#999",
        borderColor: "#999",
        cursor: "auto"
      });
    }

    return (
      <button className="button" type={this.props.type} onClick={this.handleClick} 
        style={buttonStyles}
        disabled={this.props.disabled}>
        {this.props.text}
      </button>
    )
  }
}

export const BackButton = ({ doClick, text }) => {
  const handleClick = () => {
    if ("function" === typeof doClick)
      return doClick();
  }

  return (
    <button type="button" className="button__back"
      onClick={handleClick}>
      {text}
    </button>
  )
};

BackButton.propTypes = {
  doClick: propTypes.func,
  text: propTypes.string
};

export default Button;