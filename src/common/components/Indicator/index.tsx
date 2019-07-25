import React from 'react';

interface IndicatorProps {
  color: string;
  width: string;
  solid: boolean;
  styles: React.CSSProperties;
}

const Indicator = (props: IndicatorProps): React.ReactNode => {
  const { color, width, solid, styles } = props;
  const indicatorStyles = {
    display: 'inline-block',
    width,
    height: width,
    borderStyle: 'solid',
    borderWidth: '3px',
    borderColor: color,
    borderRadius: '50%',
    backgroundColor: solid ? color : '#FFFFFF',
    ...styles
  };

  return <span style={indicatorStyles}/>;
};

Indicator.defaultProps = {
  color: '#53D1D7',
  width: '16px',
  styles: {}
};

export default Indicator;