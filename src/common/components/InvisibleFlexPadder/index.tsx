import React from 'react';

interface InvisibleFlexPadderProps {
  width: string;
  height: string;
  padderStyles: React.CSSProperties;
}

const InvisibleFlexPadder = (props: InvisibleFlexPadderProps): React.ReactNode => {
  const { width, height, padderStyles } = props;
  const styles = {
    display: 'block',
    width,
    height,
    maxWidth: width,
    backgroundColor: 'transparent', 
    ...padderStyles
  };

  return (
    <span className="invisible_flex_padder" style={styles}/>
  );
};

export default InvisibleFlexPadder;