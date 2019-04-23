import "./ImageWithColoredShadow.css";

import React from "react";
import propTypes from "prop-types";

const ImageWithColoredShadow = ({ image, shadowColor, width }) => {
  return (
    <div className="image_with_colored_shadow"
      style={{
        width: width,
        height: width
      }} >
      <span
        style={{
          borderColor: shadowColor
        }}></span>
      <img src={image} alt=""
        style={{
          maxWidth: width
        }} />
    </div>
  )
}

ImageWithColoredShadow.propTypes = {
  image: propTypes.string,
  shadowColor: propTypes.string,
  width: propTypes.string
}

export default ImageWithColoredShadow;