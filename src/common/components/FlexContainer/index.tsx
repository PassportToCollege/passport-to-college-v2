import React from 'react';
import { makeClassString } from '../../utils';

interface FlexContainerProps {
  children: React.ReactChildren;
  direction: string;
  styles: React.CSSProperties;
  classes: string[];
}

const FlexContainer = (props: FlexContainerProps): React.ReactNode => {
  const { children, direction = 'row', styles, classes = [] } = props;
  const containerStyles = {
    display: 'flex',
    flexFlow: `${direction} wrap`,
    justifyContent: 'space-evenly', ...styles};

  return (
    <div className={makeClassString(['flex_container', ...classes])} style={containerStyles}>
      {children}
    </div>
  );
};

export default FlexContainer;