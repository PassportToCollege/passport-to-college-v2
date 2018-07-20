import "./LabeledIconCard.css";

import React from "react";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faBook,
  faGlobe,
  faCalendar

} from "@fortawesome/fontawesome-free-solid";

const LabeledIconCard = ({ icon, label, children, cardStyles }) => {
  const icons = {
    school: faSchool,
    book: faBook,
    globe: faGlobe,
    date: faCalendar
  }

  return (
    <span className="labeled_icon_card" style={cardStyles}>
      <span className="labeled_icon_card__icon">
        <FontAwesomeIcon icon={icons[icon]} />
      </span>
      {children}
      <p className="labeled_icon_card__label type__uppercase type__light">{label}</p>
    </span>
  )
}

LabeledIconCard.propTypes = {
  icon: propTypes.string,
  label: propTypes.string,
  children: propTypes.any,
  cardStyles: propTypes.object
};

export default LabeledIconCard;