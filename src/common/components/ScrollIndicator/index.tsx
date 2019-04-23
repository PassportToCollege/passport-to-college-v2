import "./ScrollIndicator.css";

import React from "react";

const ScrollIndicator = () => {
  return (
    <span className="scroll_indicator">
      <span className="scroll_indicator__vert_line"></span>
      <span className="scroll_indicator__arrow_down"></span>
      <span className="scroll_indicator__mouse_body"></span>
    </span>
  )
}

export default ScrollIndicator;