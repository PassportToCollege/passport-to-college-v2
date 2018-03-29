import "./Toggler.css";

import React from "react";
import propTypes from "prop-types";

const Toggler = ({ state, doClick }) => {
  const handleClick = () => {
    if ("function" === typeof doClick)
      doClick();
  }

  return (
    <span className={`toggler toggler__${state}`}
      onClick={handleClick}>
      <span className="toggler__ball"></span>
    </span>
  )
}

Toggler.defaultProps = {
  state: "off"
};

Toggler.propTypes = {
  state: propTypes.string,
  doClick: propTypes.func
}

export default Toggler;