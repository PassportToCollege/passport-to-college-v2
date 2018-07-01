import "./Toggler.css";

import React from "react";
import propTypes from "prop-types";

const Toggler = ({ state, doClick, disabled, options }) => {
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
    <span className={`toggler toggler__${state}`}
      onClick={handleClick}
      data-disabled={disabled ? "disabled" : "enabled"}
      title={options.title}>
      <span className="toggler__ball"></span>
    </span>
  )
}

Toggler.defaultProps = {
  state: "no",
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