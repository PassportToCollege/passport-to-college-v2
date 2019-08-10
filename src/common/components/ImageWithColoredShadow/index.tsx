import './ImageWithColoredShadow.css';

import React, { PureComponent } from 'react';

interface ImageWithColoredShadowProps {
  image?: string;
  shadowColor: string;
  width: string;
}

export default class ImageWithColoredShadow extends PureComponent<ImageWithColoredShadowProps> {
  public render() {
    const { image, shadowColor, width } = this.props;
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
  }
}