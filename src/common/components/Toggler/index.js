import "./Toggler.css";

import React from "react";
import propTypes from "prop-types";

const Toggler = ({ state, doClick, options, disabled }) => {
  const handleClick = () => {
    if (disabled)
      return;
      
    if ("function" === typeof doClick) {
      if (options.clickArg)
        return doClick(options.clickArg, state);
      
      return doClick(state);
    }
  }

  return (
    <span className={`toggler toggler__${state} ${disabled ? "toggler__disabled" : ""}`}
      onClick={handleClick}>
      <span className="toggler__ball"></span>
    </span>
  )
}

Toggler.defaultProps = {
  state: "off",
  options: {},
  disabled: false
};

Toggler.propTypes = {
  state: propTypes.string,
  doClick: propTypes.func,
  options: propTypes.object,
  disabled: propTypes.bool
}

export default Toggler;