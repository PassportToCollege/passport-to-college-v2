import React from "react";
import propTypes from "prop-types";

import { makeClassString } from "../../utils";

const Title = ({ children, classes, styles }) => {
  const titleStyles = Object.assign({}, {
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.25em"
  }, styles);

  return (
    <h2 className={makeClassString(classes)}
      style={titleStyles}>
      {children}
    </h2>
  )
};

Title.propTypes = {
  children: propTypes.any,
  styles: propTypes.object,
  classes: propTypes.arrayOf(propTypes.string)
};

export default Title;