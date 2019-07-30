import './InitialsAvatar.css';

import React, { PureComponent } from 'react';

interface InitialsAvatarProps {
  initials: string;
  styles?: React.CSSProperties;
}

export default class InitialsAvatar extends PureComponent<InitialsAvatarProps> {
  public render() {
    const { initials } = this.props;
    let { styles } = this.props;
  
    styles = styles || {};
    
    return (
      <span 
        className="initials_avatar" 
        style={styles}
      >
        <span>{initials}</span>
      </span>
    );
  }
}