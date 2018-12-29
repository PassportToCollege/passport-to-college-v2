import React from "react";
import propTypes from "prop-types";

import { makeClassString } from "../../utils";

const Title = ({ children, classes, styles }) => {
  const titleStyles = Object.assign({}, {
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "5px",
    fontSize: "42px"
  }, styles);

  return (
    <h3 className={makeClassString(classes)}
      style={titleStyles}>
      {children}
    </h3>
  )
};

Title.propTypes = {
  children: propTypes.any,
  styles: propTypes.object,
  classes: propTypes.arrayOf(propTypes.string)
};

export default Title;