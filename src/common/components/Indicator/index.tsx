import React from "react";
import propTypes from "prop-types";

const Indicator = ({ color, width, solid, styles }) => {
  const indicatorStyles = Object.assign({}, styles, {
    display: "inline-block",
    width,
    height: width,
    borderStyle: "solid",
    borderWidth: "3px",
    borderColor: color,
    borderRadius: "50%",
    backgroundColor: solid ? color : "#FFFFFF"
  });

  return <span style={indicatorStyles}></span>
}

Indicator.defaultProps = {
  color: "#53D1D7",
  width: "16px",
  styles: {}
};

Indicator.propTypes = {
  color: propTypes.string,
  width: propTypes.string,
  styles: propTypes.object,
  solid: propTypes.bool
};

export default Indicator;