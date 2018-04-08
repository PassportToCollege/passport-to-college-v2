import React from "react";
import propTypes from "prop-types";

const StatItem = ({ stat, label, itemStyles }) => {
  const combinedStyles = Object.assign({
    color: "white",
    textAlign: "center",
    lineHeight: "1",
    padding: "1em 3em"
  }, itemStyles);

  return (
    <span className="stat__item" style={combinedStyles}>
      <h1 style={{
        color: "inherit",
        margin: "0",
        fontFamily: "Nunito, san-serif",
        fontSize: "5em"
      }}>{stat}</h1>
      <h4 style={{
        color: "inherit",
        textTransform: "uppercase",
        margin: "0",
        fontWeight: "400",
        fontSize: "16px"
      }}>{label}</h4>
    </span>
  )
}

StatItem.propTypes = {
  stat: propTypes.oneOfType([propTypes.string, propTypes.number]),
  label: propTypes.string,
  itemStyles: propTypes.object
};

export default StatItem;