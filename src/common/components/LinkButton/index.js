import "./LinkButton.css";

import React from "react";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/fontawesome-free-solid";

const LinkButton = props => {
  props = props || {};
  let icon;

  if (props.icon === "faHome")
    icon = faHome;

  return (
    <Link to={props.target} className={`link__button ${props.classes || ""}`}>
      {
        props.text ? props.text : null
      }
      {
        props.icon ? 
          <FontAwesomeIcon icon={icon} />
        :
          null
      }
    </Link>
  )
}

LinkButton.propTypes = {
  target: propTypes.string,
  text: propTypes.string,
  classes: propTypes.string,
  icon: propTypes.string
};

export default LinkButton;