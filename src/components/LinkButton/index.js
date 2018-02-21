import "./LinkButton.css";

import React from "react";
import propTypes from "prop-types";

const LinkButton = props => {
  props = props || {};

  return (
    <a href={props.target} className={`link__button ${props.classes || ""}`}>
      {props.text}
    </a>
  )
}

LinkButton.propTypes = {
  target: propTypes.string,
  text: propTypes.string,
  classes: propTypes.string
};

export default LinkButton;