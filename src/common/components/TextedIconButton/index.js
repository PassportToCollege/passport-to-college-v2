import "./TextedIconButton.css";

import React from "react";
import propTypes from "prop-types";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/fontawesome-free-brands";

const TextedIconButton = ({ doClick, type, icon, text, buttonStyles }) => {
  const icons = {
    google: faGoogle,
    facebook: faFacebook
  }

  const handleClick = () => {
    if ("function" === typeof doClick)
      return doClick();
  }

  return (
    <button className="texted_icon_button" type={type}
      onClick={handleClick}
      style={buttonStyles}>
      <span className={`texted_icon_button__icon ${icon}`}>
        <FontAwesomeIcon icon={icons[icon]} />
      </span>
      <span className="texted_icon_button__text">{text}</span>
    </button>
  )
}

TextedIconButton.defaultProps = {
  type: "button"
};

TextedIconButton.propTypes = {
  doClick: propTypes.func,
  type: propTypes.string,
  icon: propTypes.string,
  text: propTypes.string,
  buttonStyles: propTypes.object
};

export default TextedIconButton;