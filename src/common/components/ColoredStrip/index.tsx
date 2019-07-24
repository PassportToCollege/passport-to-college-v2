import React from 'react';

interface ColoredStripProps  {
  children: React.ReactNode;
  background: string;
}

const ColoredStrip = (props: ColoredStripProps): React.ReactNode => {
  return (
    <div 
      className="colored_strip"
      style={{
        backgroundColor: props.background,
        width: '100%',
        padding: '3em'
      }} 
    >
      {props.children}
    </div>
  );
};

export default ColoredStrip;