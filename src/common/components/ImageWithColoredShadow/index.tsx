import './ImageWithColoredShadow.css';

import React from 'react';

interface ImageWithColoredShadowProps {
  image: string;
  shadowColor: string;
  width: string;
}

const ImageWithColoredShadow = (props: ImageWithColoredShadowProps): React.ReactNode => {
  const { image, shadowColor, width } = props;
  return (
    <div 
      className="image_with_colored_shadow"
      style={{
        width,
        height: width
      }} 
    >
      <span
        style={{
          borderColor: shadowColor
        }}
      />
      <img 
        src={image} 
        alt=""
        style={{
          maxWidth: width
        }} 
      />
    </div>
  );
};

export default ImageWithColoredShadow;