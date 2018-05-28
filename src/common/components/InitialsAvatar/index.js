import "./InitialsAvatar.css";

import React from "react";
import propTypes from "prop-types";

const InitialsAvatar = ({ initials, styles }) => {
  return (
    <span className="initials_avatar" style={styles}>
      {initials}
    </span>
  )
}

InitialsAvatar.defaultProps = {
  styles: {}
};

InitialsAvatar.propTypes = {
  initials: propTypes.string,
  styles: propTypes.object
};

export default InitialsAvatar;