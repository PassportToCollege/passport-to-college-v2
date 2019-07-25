import './Loader.css';

import React from 'react';

interface LoaderProps {
  color?: string;
  width?: string;
  styles?: React.CSSProperties;
}

const Loader = (props: LoaderProps): React.ReactNode => {
  const { color = '#ff6561', width = '64px', styles = {}} = props;
  const loaderStyles = {
    ...styles, 
    width,
    height: width,
    borderTopColor: color};

  return <div className="loader" style={loaderStyles}/>;
};

export default Loader;