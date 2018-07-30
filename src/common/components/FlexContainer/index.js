import React from "react";
import propTypes from "prop-types";

import { makeClassString } from "../../utils";

const FlexContainer = ({ children, direction, styles, classes }) => {

  const containerStyles = Object.assign({}, {
    display: "flex",
    flexFlow: `${direction} wrap`,
    justifyContent: "space-evenly"
  }, styles);

  return (
    <div className={makeClassString(["flex_container", ...classes])} style={containerStyles}>
      {children}
    </div>
  )
};

FlexContainer.defaultProps = {
  direction: "row",
  classes: []
};

FlexContainer.propTypes = {
  children: propTypes.any,
  direction: propTypes.string,
  styles: propTypes.object,
  classes: propTypes.arrayOf(propTypes.string)
};

export default FlexContainer;