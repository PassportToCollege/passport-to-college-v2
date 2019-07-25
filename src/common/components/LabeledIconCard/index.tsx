import './LabeledIconCard.css';

import React from 'react';
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSchool,
  faBook,
  faGlobe,
  faCalendar,
  faTrophy,
  faStar

} from '@fortawesome/fontawesome-free-solid';

interface LabeledIconCardProps {
  icon: 'school' | 'book' | 'globe' | 'date' | 'feature' | 'accomplishment';
  label: string;
  children: React.ReactChildren;
  cardStyles: React.CSSProperties;
}

const LabeledIconCard = (props: LabeledIconCardProps): React.ReactNode => {
  const { icon, label, children, cardStyles } = props;
  const icons = {
    school: faSchool,
    book: faBook,
    globe: faGlobe,
    date: faCalendar,
    feature: faStar,
    accomplishment: faTrophy
  };

  return (
    <span 
      className="labeled_icon_card" 
      style={cardStyles}
    >
      <span className="labeled_icon_card__icon">
        <FontAwesomeIcon icon={icons[icon]} />
      </span>
      {children}
      <p className="labeled_icon_card__label type__caption type__uppercase type__light">{label}</p>
    </span>
  );
};

export default LabeledIconCard;