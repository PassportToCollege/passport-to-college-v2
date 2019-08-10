import React, { PureComponent } from 'react';

interface RadioProps {
  active?: boolean;
  radioStyles?: React.CSSProperties;
}

export default class Radio extends PureComponent<RadioProps> {
  public render() {
    const { active, radioStyles } = this.props;
    const styles: React.CSSProperties = {
      display: 'inline-block',
      width: '24px',
      height: '24px',
      backgroundColor: active ? '#FF6561' : 'rgba(51,51,51,0.05)',
      borderRadius: '50%',
      padding: '4px', 
      ...radioStyles
    };
  
    return (
      <span className="radio" style={styles}>
        <span 
          className="radio__inner"
          style={{
            display: 'inline-block',
            backgroundColor: 'inherit',
            border: '2px solid white',
            borderRadius: '50%',
            width: '100%',
            height: '100%'
          }}
        />
      </span>
    );
  }
}