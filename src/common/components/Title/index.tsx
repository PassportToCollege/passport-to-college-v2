import React, { PureComponent } from 'react';
import { makeClassString } from '../../utils';

interface TitleProps {
  classes: string[];
  styles: React.CSSProperties;
  children: React.ReactChildren;
}

export default class Title extends PureComponent<TitleProps> {
  public render() {
    const { children, classes, styles } = this.props;

    const titleStyles: React.CSSProperties = {...{
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '5px',
        fontSize: '42px'
      }, 
      ... styles
    };
  
    return (
      <h3 
        className={makeClassString(classes)}
        style={titleStyles}
      >
        {children}
      </h3>
    );
  }
}