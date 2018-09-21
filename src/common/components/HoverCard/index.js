import "./HoverCard.css";

import React from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";

const HoverCard = ({ children, background, overlay, target, cardStyles }) => {
  const styles = Object.assign({}, {
    backgroundImage: background ? `url(${background})` : null
  }, cardStyles);

  return (
    <Link to={target}
      className="hover_card" style={styles}>
      <span className="hover_card__overlay"
        style={{
          backgroundColor: overlay
        }} ></span>
      <span>
        {children}
      </span>
    </Link>
  )
}

HoverCard.propTypes = {
  children: propTypes.any,
  background: propTypes.string,
  overlay: propTypes.string,
  cardStyles: propTypes.object,
  target: propTypes.string
};

export default HoverCard;