import React from "react";
import propTypes from "prop-types";

const Radio = ({ active, radioStyles }) => {
  const styles = Object.assign({}, {
    display: "inline-block",
    width: "24px",
    height: "24px",
    backgroundColor: active ? "#FF6561" : "rgba(51,51,51,0.05)",
    borderRadius: "50%",
    padding: "4px"
  }, radioStyles);

  return (
    <span className="radio" style={styles}>
      <span className="radio__inner"
        style={{
          display: "inline-block",
          backgroundColor: "inherit",
          border: "2px solid white",
          borderRadius: "50%",
          width: "100%",
          height: "100%"
        }}></span>
    </span>
  )
}

Radio.defaultProps = {
  active: false
};

Radio.propTypes = {
  active: propTypes.bool,
  radioStyles: propTypes.object
};

export default Radio;