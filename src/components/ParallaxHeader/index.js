import "./ParallaxHeader.css";

import React from "react";
import propTypes from "prop-types";

import LinkButton from "../LinkButton";

const ParallaxHeader = props => {
  props = props || {};

  let headerStyles = {
    height: props.height || "100vh",
    backgroundImage: `url("${props.bgImage}")`
  }

  let overlayStyles = {
    backgroundColor: props.overlayColor
  }

  return (
    <div className="parallax_header" style={headerStyles}>
      <div className="parallax_header__overlay" style={overlayStyles}></div>
      <div className="parallax_header__content">
        <div className="parallax_header__big_text">
          <h1>{props.bigText}</h1>
        </div>
        {
          props.showLinkButton ?
          <LinkButton target={props.linkButton.target} text={props.linkButton.text} /> :
          ""
        }
      </div>
      {
        props.showScrollStrip ?
          <div className="parallax_header__scroll_strip">
            
          </div> :
          null
      }
    </div>
  )
}

ParallaxHeader.propTypes = {
  height: propTypes.string,
  bgImage: propTypes.string,
  overlayColor: propTypes.string,
  bigText: propTypes.string,
  showLinkButton:  propTypes.bool,
  linkButton: propTypes.object,
  showScrollStrip: propTypes.bool
}

export default ParallaxHeader;

