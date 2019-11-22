import React from 'react';
import { makeClassString } from '../../utils';

interface FlexContainerProps {
  children: React.ReactChildren | JSX.Element | JSX.Element[] | null;
  direction?: string;
  styles?: React.CSSProperties;
  classes?: string[];
}

class FlexContainer extends React.Component<FlexContainerProps> {
  public render() {
    const { children, direction = 'row', styles, classes = [] } = this.props;
    const containerStyles = {
      display: 'flex',
      flexFlow: `${direction} wrap`,
      justifyContent: 'space-evenly', 
      ...styles
    };

    return (
      <div className={makeClassString(['flex_container', ...classes])} style={containerStyles}>
        {children}
      </div>
    );
  }
}

export default FlexContainer;