import './LoadingText.css';

import React, { Component } from 'react';

interface LoadingTextLine {
  color: string;
  width: string;
}

interface LoadingTextProps {
  backgroundColor: string;
  classes: string;
  height: string;
  lines: LoadingTextLine[];
}

class LoadingText extends Component<LoadingTextProps> {
  public render() {
    const { backgroundColor, classes, height, lines } = this.props;

    return (
      <div 
        className={`loading_text__container ${classes || ''}`}
        style={{backgroundColor: backgroundColor || '#fff'}}
      >
        {
          lines.map((line, i) => {
            return (
              <span 
                key={i} 
                style={{
                  width: line.width, 
                  height, 
                  backgroundColor: line.color
                }}
              />
            );
          })
        }
      </div>
    );
  }
}

export default LoadingText;