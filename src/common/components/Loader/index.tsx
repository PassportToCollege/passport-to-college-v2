import './Loader.css';

import React, { Component } from 'react';

interface LoaderProps {
  color?: string;
  width?: string;
  styles?: React.CSSProperties;
}

class Loader extends Component<LoaderProps> {
  public render() {
    const { color = '#ff6561', width = '64px', styles = {}} = this.props;
    const loaderStyles = {
      ...styles, 
      width,
      height: width,
      borderTopColor: color};
  
    return <div className="loader" style={loaderStyles}/>;
  }
}

export default Loader;