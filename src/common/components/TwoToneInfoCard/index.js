import "./TwoToneInfoCard.css";

import React from "react";
import propTypes from "prop-types";

const TwoToneInfoCard = ({ heading, subheading, children, topBg, bottomBg, styles }) => {
  return (
    <div className="two_tone_info_card" style={styles}>
      <div className="two_tone_info_card__top"
        style={{ backgroundColor: topBg }}>
        <h4>{heading}</h4>
        <p className="type__smaller type__uppercase">{subheading}</p>
      </div>
      <div className="two_tone_info_card__bottom"
        style={{ backgroundColor: bottomBg }}>
        {children}
      </div>
    </div>
  )
};

TwoToneInfoCard.propTypes = {
  heading: propTypes.string,
  subheading: propTypes.string,
  children: propTypes.any,
  topBg: propTypes.string,
  bottomBg: propTypes.string,
  styles: propTypes.object
};

export default TwoToneInfoCard;