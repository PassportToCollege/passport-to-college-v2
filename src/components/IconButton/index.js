import "./IconButton.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faInfo, faExternalLinkAlt } from "@fortawesome/fontawesome-free-solid";

class IconButton extends Component {
  handleClick = (e) => {
    if ("function" === typeof this.props.doClick)
      this.props.doClick(e);
  }

  render() {
    const icons = {
      default: faInfo,
      delete: faTrashAlt,
      edit: faEdit,
      open: faExternalLinkAlt
    };
    let buttonStyles = Object.assign({}, this.props.styles);

    if (this.props.solid) {
      buttonStyles = Object.assign({}, buttonStyles, {
        backgroundColor: this.props.styles.backgroundColor || "#FF6561",
        borderColor: this.props.styles.backgroundColor || "#FF6561",
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
      <button className="icon_button" type={this.props.type} onClick={this.handleClick}
        style={buttonStyles}
        disabled={this.props.disabled}>
        <FontAwesomeIcon icon={icons[this.props.icon]} />
      </button>
    )
  }
}

IconButton.defaultProps = {
  styles: {},
  icon: "default",
  type: "button"
};

IconButton.propTypes = {
  styles: propTypes.object,
  type: propTypes.string,
  doClick: propTypes.func,
  text: propTypes.string,
  solid: propTypes.bool,
  disabled: propTypes.bool,
  icon: propTypes.string
};

export default IconButton;