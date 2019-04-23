import React from "react";
import propTypes from "prop-types";

const InvisibleFlexPadder = ({ width, height, padderStyles }) => {
  const styles = Object.assign({}, {
    display: "block",
    width,
    height,
    maxWidth: width,
    backgroundColor: "transparent"
  }, padderStyles);

  return (
    <span className="invisible_flex_padder" style={styles}></span>
  );
}

InvisibleFlexPadder.propTypes = {
  width: propTypes.string,
  height: propTypes.string,
  padderStyles: propTypes.object
};

export default InvisibleFlexPadder;