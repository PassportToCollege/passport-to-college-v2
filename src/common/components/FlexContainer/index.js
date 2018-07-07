import React from "react";
import propTypes from "prop-types";

const FlexContainer = ({ children, direction, styles }) => {

  const containerStyles = Object.assign({}, {
    display: "flex",
    flexFlow: `${direction} wrap`,
    justifyContent: "space-evenly"
  }, styles);

  return (
    <div className="flex_container" style={containerStyles}>
      {children}
    </div>
  )
};

FlexContainer.defaultProps = {
  direction: "row"
};

FlexContainer.propTypes = {
  children: propTypes.any,
  direction: propTypes.string,
  styles: propTypes.object
};

export default FlexContainer;