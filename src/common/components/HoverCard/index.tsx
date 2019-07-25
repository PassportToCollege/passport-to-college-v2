import './HoverCard.css';

import React from 'react';
import { Link } from 'react-router-dom';

interface HoverCardProps {
  children: React.ReactChildren;
  background: string;
  overlay: string;
  target: string;
  cardStyles: React.CSSProperties;
}

const HoverCard = (props: HoverCardProps): React.ReactNode => {
  const { children, background, overlay, target, cardStyles } = props;
  const styles: React.CSSProperties = {
    backgroundImage: background ? `url(${background})` : undefined, 
    ...cardStyles
  };

  return (
    <Link 
      to={target}
      className="hover_card" 
      style={styles}
    >
      <span 
        className="hover_card__overlay"
        style={{
          backgroundColor: overlay
        }} 
      />
      <span>
        {children}
      </span>
    </Link>
  );
};

export default HoverCard;