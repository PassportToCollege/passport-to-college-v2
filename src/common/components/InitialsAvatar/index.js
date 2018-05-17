import React from "react";
import propTypes from "prop-types";

const InitialsAvatar = ({ initials, styles }) => {
  const avatarStyles = Object.assign({}, styles, {
    width: styles.width || "64px",
    height: styles.height || "64px",
    display: styles.display || "inline-block",
    borderRadius: styles.borderRadius || "50%",
    backgroundColor: styles.backgroundColor || "#FFCB61",
    color: styles.color || "#FFF",
    textAlign: "center",
    fontSize: "2em",
    padding: "0.45em",
    fontWeight: "bolder",
    fontFamily: "Muli, Nunito, Roboto, san-serif",
    overflow: "hidden"
  });

  return (
    <span className="initials_avatar" style={avatarStyles}>
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