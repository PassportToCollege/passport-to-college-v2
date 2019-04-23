import React from "react";
import propTypes from "prop-types";

const ColoredStrip = ({ children, background }) => {
  return (
    <div className="colored_strip"
      style={{
        backgroundColor: background,
        width: "100%",
        padding: "3em"
      }} >
      {children}
    </div>
  );
};

ColoredStrip.propTypes = {
  children: propTypes.any,
  background: propTypes.string
}

export default ColoredStrip;