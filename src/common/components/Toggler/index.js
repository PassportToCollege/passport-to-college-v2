import "./Toggler.css";

import React from "react";
import propTypes from "prop-types";

const Toggler = ({ state, doClick, options }) => {
  const handleClick = () => {
    if ("function" === typeof doClick) {
      if (options.clickArg)
        return doClick(options.clickArg, state);
      
      return doClick(state);
    }
  }

  return (
    <span className={`toggler toggler__${state}`}
      onClick={handleClick}>
      <span className="toggler__ball"></span>
    </span>
  )
}

Toggler.defaultProps = {
  state: "no",
  options: {}
};

Toggler.propTypes = {
  state: propTypes.string,
  doClick: propTypes.func,
  options: propTypes.object
}

export default Toggler;