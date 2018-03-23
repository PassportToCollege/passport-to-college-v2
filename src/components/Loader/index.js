import "./Loader.css";

import React from "react";
import propTypes from "prop-types";

const Loader = ({ color, width, styles }) => {
  styles = styles || {};
  const loaderStyles = Object.assign({}, styles, {
    width,
    height: width,
    borderTopColor: color
  });

  return <div className="loader" style={loaderStyles}></div>
}

Loader.defaultProps = {
  color: "#FF6561",
  width: "64px"
};

Loader.propTypes = {
  color: propTypes.string,
  width: propTypes.string,
  styles: propTypes.object
};

export default Loader;