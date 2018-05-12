import "./LoadingText.css";

import React from "react";
import propTypes from "prop-types";

/*
  Accepted Options
  - class === className of container
  - bg === background-color
  - height === height of lines
  - lines === array of line objects
    - line === line object
      - color === color of lines
      - width === line width
*/ 

const LoadingText = props => {
  let { options } = props;

  return (
    <div 
      className={`loading_text__container ${options.class || ""}`}
      style={{backgroundColor: options.bg || "#fff"}}>
      {
        options.lines.map((line, i) => {
          return (
          <span key={i} 
                style={{
                  width: line.width, 
                  height: options.height, 
                  backgroundColor: line.color
                }}>
          </span>
          )
        })
      }
    </div>
  )
}

LoadingText.propTypes = {
  options: propTypes.object
};

export default LoadingText;

