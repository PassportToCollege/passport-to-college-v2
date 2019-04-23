import "./IconBullet.css";

import React from "react";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faGlobe,
  faUniversity,
  faSchool,
  faBriefcase,
  faUserGraduate
} from "@fortawesome/fontawesome-free-solid";

const IconBullet = ({ styles, icon, heading, children }) => {
  const icons = {
    pen: faPencilAlt,
    globe: faGlobe,
    university: faUniversity,
    school: faSchool,
    briefcase: faBriefcase,
    graduate: faUserGraduate
  };

  return (
    <div className="icon_bullet" style={styles}>
      <i><FontAwesomeIcon icon={icons[icon]} /></i>
      <h5>{heading}</h5>
      {children}
    </div>
  );
}

IconBullet.propTypes = {
  styles: propTypes.object,
  icon: propTypes.string,
  heading: propTypes.string,
  children: propTypes.any
}

export default IconBullet;