import './TwoToneInfoCard.css';

import React, { PureComponent } from 'react';

interface TwoToneInfoCardProps {
  heading: string;
  subheading: string;
  children: React.ReactNode;
  topBackground: string;
  bottomBackground: string;
  styles: React.CSSProperties;
}

export default class TwoToneInfoCard extends PureComponent<TwoToneInfoCardProps> {
  public render() {
    const { heading, subheading, children, topBackground, bottomBackground, styles } = this.props;

    return (
      <div className="two_tone_info_card" style={styles}>
        <div 
          className="two_tone_info_card__top"
          style={{ backgroundColor: topBackground }}
        >
          <h4>{heading}</h4>
          <p className="type__smaller type__uppercase">{subheading}</p>
        </div>
        <div 
          className="two_tone_info_card__bottom"
          style={{ backgroundColor: bottomBackground }}
        >
          {children}
        </div>
      </div>
    );
  }
}