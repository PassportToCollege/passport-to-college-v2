import './InitialsAvatar.css';

import React from 'react';

interface InitialsAvatarProps {
  initials: string;
  styles?: React.CSSProperties;
}

const InitialsAvatar = (props: InitialsAvatarProps): React.ReactNode => {
  const { initials } = props;
  let { styles } = props;

  styles = styles || {};
  
  return (
    <span 
      className="initials_avatar" 
      style={styles}
    >
      <span>{initials}</span>
    </span>
  );
};

export default InitialsAvatar;