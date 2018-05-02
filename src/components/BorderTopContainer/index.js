import React from "react";
import propTypes from "prop-types";

const BorderTopContainer = ({ color, thickness, style, classes, children }) => {
  const containerStyles = {
    borderTop: `${thickness} ${style} ${color}`
  };

  return (
    <div className={`border_top_container ${classes}`}
      style={containerStyles}>
      {children}
    </div>
  )
}

BorderTopContainer.defaultProps = {
  color: "rgba(51,51,51,0.1)",
  thickness: "1px",
  style: "solid"
};

BorderTopContainer.propTypes = {
  color: propTypes.string,
  thickness: propTypes.string,
  style: propTypes.string,
  classes: propTypes.string,
  children: propTypes.node
};

export default BorderTopContainer;