import React from 'react';

interface BorderTopContainerProps {
  color: string;
  thickness: string;
  style: string;
  classes: string;
  children: React.ReactChild;
}

const BorderTopContainer = (props: BorderTopContainerProps) => {
  let { color, thickness, style } = props;
  const { classes, children } = props;

  if (!color) { color = 'rgba(51,51,51,0.1)'; }
  if (!thickness) { thickness = '1px'; }
  if (!style) { style = 'solid'; }

  const containerStyles = {
    borderTop: `${thickness} ${style} ${color}`
  };

  return (
    <div 
      className={`border_top_container ${classes}`}
      style={containerStyles}
    >
      {children}
    </div>
  );
};

export default BorderTopContainer;