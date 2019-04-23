import "./List.css";

import React from "react";
import propTypes from "prop-types";

const List = ({ width, children }) => {
  return (
    <ul className="list"
      style={{
        maxWidth: width
      }}>
      {children}
    </ul>
  )
}

List.defaultProps = {
  width: "100%"
}

List.propTypes = {
  children: propTypes.any,
  width: propTypes.string
}

export default List;