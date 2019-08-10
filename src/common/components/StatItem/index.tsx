import React, { PureComponent } from 'react';
import propTypes from 'prop-types';

interface StatItemProps {
  stat: number;
  label: string;
  itemStyles: React.CSSProperties;
}

export default class StatItem extends PureComponent<StatItemProps> {
  public render() {
    const { itemStyles, stat, label } = this.props;
    const combinedStyles: React.CSSProperties = {
      ...{
        color: 'white',
        textAlign: 'center',
        lineHeight: '1',
        padding: '1em 3em'
      }, 
      ...itemStyles
    };
    const h4Styles: React.CSSProperties = {
      color: 'inherit',
      textTransform: 'uppercase',
      margin: '0',
      fontWeight: 400,
      fontSize: '16px'
    };
  
    return (
      <span className="stat__item" style={combinedStyles}>
        <h1 
          style={{
            color: 'inherit',
            margin: '0',
            fontFamily: 'Nunito, san-serif',
            fontSize: '5em'
          }}
        >
          {stat}
        </h1>
        <h4 style={h4Styles}>
          {label}
        </h4>
      </span>
    );
  }
}